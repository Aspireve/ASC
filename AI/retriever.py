import time
import json
from typing import List
import boto3
from io import BytesIO
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader, UnstructuredMarkdownLoader,
    UnstructuredExcelLoader, UnstructuredPowerPointLoader, UnstructuredCSVLoader, UnstructuredEPubLoader
)
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
import random
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()


class CustomerRAG:
    def __init__(self, customer_id):
        self.customer_id = customer_id
        self.chroma_persist_dir = f"chroma_db_customer{customer_id}"
        self.dataset_dir = f"Dataset_customer{customer_id}"
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", google_api_key=os.environ["GOOGLE_API_KEY2"])
        self.vectorstore = None
        self.batch_size = 7
        self.delay = 38
        # self.rate_limiter = RateLimiter(max_requests_per_minute=10, max_tokens_per_minute=10000)

    def get_retriever(self):
        if not self.vectorstore:
            self.vectorstore = Chroma(
                persist_directory=self.chroma_persist_dir, embedding_function=self.embeddings)

            if self.vectorstore._collection.count() == 0:
                self.load_documents()

        if self.vectorstore._collection.count() == 0:
            raise ValueError(
                "Vectorstore is empty. Please ensure documents are loaded properly.")

        return self.vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})

    def load_documents(self):

        loaders = {
            ".pdf": PyPDFLoader,
            ".txt": TextLoader,
            ".docx": UnstructuredWordDocumentLoader,
            ".md": UnstructuredMarkdownLoader,
            ".xlsx": UnstructuredExcelLoader,
            ".pptx": UnstructuredPowerPointLoader,
            ".csv": UnstructuredCSVLoader,
            ".epub": UnstructuredEPubLoader,
        }

        s3 = boto3.client('s3')
        bucket_name = 'admissionuploads'
        prefix = f'Dataset_customer{self.customer_id}/'
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

        documents = []
        if 'Contents' in response:
            for obj in response['Contents']:
                key = obj['Key']
                file_extension = os.path.splitext(key)[1].lower()
                if file_extension in loaders:
                    obj_body = s3.get_object(Bucket=bucket_name, Key=key)[
                        'Body'].read()
                    file_like_object = BytesIO(obj_body)
                    loader = loaders[file_extension](file_like_object)
                    documents.extend(loader.load_and_split())

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1024, chunk_overlap=200, add_start_index=True)
        texts = text_splitter.split_documents(documents)

        # labeled_texts = self.label_documents(texts)
        if not self.vectorstore:
            self.vectorstore = Chroma(
                persist_directory=self.chroma_persist_dir, embedding_function=self.embeddings)

        self.vectorstore.add_documents(texts)

    def update_document_set(self, new_directory):
        loaders = {
            ".pdf": PyPDFLoader,
            ".txt": TextLoader,
            ".docx": UnstructuredWordDocumentLoader,
            ".md": UnstructuredMarkdownLoader,
            ".xlsx": UnstructuredExcelLoader,
            ".pptx": UnstructuredPowerPointLoader,
            ".csv": UnstructuredCSVLoader,
            ".epub": UnstructuredEPubLoader,
        }

        new_documents = []
        for file in os.listdir(new_directory):
            file_path = os.path.join(new_directory, file)
            file_extension = os.path.splitext(file)[1].lower()
            if file_extension in loaders:
                loader = loaders[file_extension](file_path)
                new_documents.extend(loader.load())
            elif file_extension == ".json":
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        # Assuming each key-value pair is a separate entry
                        for entry in data.values():
                            if isinstance(entry, str):
                                doc = Document(page_content=entry, metadata={
                                               "source": file_path})
                                new_documents.append(doc)
                            elif isinstance(entry, dict) and 'content' in entry:
                                doc = Document(page_content=entry['content'], metadata={
                                               "source": file_path})
                                new_documents.append(doc)
                            else:
                                print(
                                    f"Unexpected format in {file_path}: {entry}")
                    elif isinstance(data, list):
                        for item in data:
                            if isinstance(item, str):
                                doc = Document(page_content=item, metadata={
                                               "source": file_path})
                                new_documents.append(doc)
                            elif isinstance(item, dict) and 'content' in item:
                                doc = Document(page_content=item['content'], metadata={
                                               "source": file_path})
                                new_documents.append(doc)
                            else:
                                print(
                                    f"Unexpected list item format in {file_path}: {item}")
                    else:
                        print(f"Unsupported JSON structure in {file_path}")
            else:
                print(
                    f"Unsupported file type: {file_extension} for file {file}")

        if not new_documents:
            print(f"No new documents found in directory {new_directory}")
            return

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1024, chunk_overlap=200, add_start_index=True
        )
        new_texts = text_splitter.split_documents(new_documents)

        if not new_texts:
            print("No text chunks created from documents.")
            return

        # labeled_texts = self.label_documents(new_texts)
        if not self.vectorstore:
            self.vectorstore = Chroma(
                persist_directory=self.chroma_persist_dir, embedding_function=self.embeddings
            )

        self.vectorstore.add_documents(new_texts)
        print(
            f"Added {len(new_texts)} new document chunks to the database for customer {self.customer_id}.")


class RAGChatbotManager:
    def __init__(self):
        self.customer_rags = {}

    def get_customer_rag(self, customer_id):
        if customer_id not in self.customer_rags:
            self.customer_rags[customer_id] = CustomerRAG(customer_id)
        return self.customer_rags[customer_id]

    def update_customer_dataset(self, customer_id, new_directory):
        customer_rag = self.get_customer_rag(customer_id)
        customer_rag.update_document_set(new_directory)


rag_manager = RAGChatbotManager()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


model = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", api_key=os.environ["GOOGLE_API_KEY2"], temperature=0.5)

template = """
Context: {context}
Query: {query}
Chat History: {history}

Response Guidelines:

Tone and Approach:

Explain things in a simple and beginner-friendly manner.
Break down complex concepts into digestible steps with detailed examples.
Provide clear, actionable instructions.
Avoid jargon or explain any technical terms clearly.
Use analogies where helpful to relate abstract concepts to real-world scenarios.
Core Expertise Areas:

"""
QA_CHAIN_PROMPT = PromptTemplate.from_template(template)


def generate_response(query, history, customer_id):
    try:
        retriever = get_retriever(customer_id)
    except ValueError as e:
        return str(e)

    def _combine_documents(docs):
        return format_docs(docs)

    rag_chain = (
        {
            "context": lambda x: _combine_documents(retriever.invoke(x["query"])),
            "query": RunnablePassthrough(),
            "history": RunnablePassthrough(),
        }
        | QA_CHAIN_PROMPT
        | model
        | StrOutputParser()
    )
    result = rag_chain.invoke(input={"query": query, "history": history})
    return result


def get_retriever(customer_id):
    customer_rag = rag_manager.get_customer_rag(customer_id)
    return customer_rag.get_retriever()
