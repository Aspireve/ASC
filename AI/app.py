from fastapi import FastAPI, HTTPException, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from typing import List
from retriever import generate_response, rag_manager
import os
import shutil
import logging
from dotenv import load_dotenv
import uvicorn
import asyncio
import json
from myproject.myproject.spiders.content_extractor import ContentExtractorSpider
from myproject.myproject.spiders.subdirectory_spider import SubdirectorySpider
import subprocess
import logging
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://agsolgpt.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# asyncioreactor.install()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    customer_id: str
    title: str  


class ChatResponse(BaseModel):
    response: str


class ContentExtractionRequest(BaseModel):
    customer_id: str


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def trigger_root():
    while True:
        logger.info("Triggering the root endpoint...")
        await root()
        logger.info("Root endpoint triggered successfully.")
        await asyncio.sleep(40)


@app.on_event("startup")
async def start_periodic_task():
    logger.info("Starting periodic task...")
    asyncio.create_task(trigger_root())
    logger.info("Periodic task started.")


@app.get("/")
async def root():
    # Log every time the root endpoint is accessed
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the API"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    # Prepare history, processing all but the last message
    history = []
    for i, msg in enumerate(request.messages[:-1]):
        if msg.role == "user":
            history.append({"human": msg.content, "ai": ""})
        elif msg.role == "assistant" and history:
            # Update the last "user" entry with AI response
            history[-1]["ai"] = msg.content

    # The query is the content of the last message
    query = request.messages[-1].content
    title = request.title  # Retrieve the title from the request

    # Format history for the response generator
    formatted_history = "\n".join(
        [f"Human: {h['human']}\nAI: {h['ai']}" for h in history])

    # Generate response
    response = generate_response(
        query, formatted_history, request.customer_id, title)
    return ChatResponse(response=response)


@app.post("/upload_document")
async def upload_document(customer_id: str = Body(...), file: UploadFile = File(...)):
    try:

        temp_customer_dir = f"Temp_Dataset_customer{customer_id}"
        os.makedirs(temp_customer_dir, exist_ok=True)

        file_path = os.path.join(temp_customer_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(content={
            "message": f"File uploaded successfully to temporary directory for customer {customer_id}",
            "file_name": file.filename
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/finish_documents")
async def finish_documents(customer_id: str = Body(...)):
    try:
        temp_customer_dir = f"Temp_Dataset_customer{customer_id}"
        final_customer_dir = f"Dataset_customer{customer_id}"
        if not os.path.exists(temp_customer_dir):
            raise HTTPException(
                status_code=400, detail=f"No temporary documents found for customer {customer_id}")

        os.makedirs(final_customer_dir, exist_ok=True)
        for filename in os.listdir(temp_customer_dir):
            shutil.move(os.path.join(temp_customer_dir, filename),
                        os.path.join(final_customer_dir, filename))

        shutil.rmtree(temp_customer_dir)
        update_dataset(customer_id, final_customer_dir)
        return JSONResponse(content={
            "message": f"Documents finalized and dataset updated for customer {customer_id}"
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _update_dataset(customer_id: str, new_directory: str):
    try:
        os.makedirs(new_directory, exist_ok=True)
        print(
            f"Updating dataset for customer_id: {customer_id}, new_directory: {new_directory}")
        rag_manager.update_customer_dataset(customer_id, new_directory)
        print(f"Dataset updated successfully for customer {customer_id}")

    except Exception as e:
        raise Exception(
            f"Failed to update dataset for customer {customer_id}. Error: {str(e)}")


@app.post("/update_dataset")
def update_dataset(customer_id: str):
    try:
        new_directory = f"Dataset_customer{customer_id}"
        _update_dataset(customer_id, new_directory)
        return JSONResponse(content={
            "message": f"Dataset updated successfully for customer {customer_id}"
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/run_subdirectory_spider")
async def run_subdirectory_spider(user_url: str = Body(...), customer_id: str = Body(...)):
    subdir_output_file = f"output_customer{customer_id}.json"

    try:
        source_path = os.path.join("myproject", f"{subdir_output_file}")
        destination_path = os.path.join(
            os.path.dirname(__file__), f"{subdir_output_file}")

        if os.path.exists(subdir_output_file):
            os.remove(subdir_output_file)

        if os.path.exists(source_path):
            os.remove(source_path)

        subprocess.call([
            'scrapy', 'crawl', 'subdir_spider',
            '-a', f'start_url={user_url}',
            '-o', f'{subdir_output_file}'
        ], cwd=r'myproject')

        if not os.path.exists(source_path):
            raise Exception(
                f"Spider did not create the expected output file: {source_path}")

        shutil.move(source_path, destination_path)

        with open(subdir_output_file, 'r') as f:
            subdirectory_urls = json.load(f)

        formatted_urls = [entry["url"] for entry in subdirectory_urls]

        with open(subdir_output_file, 'w', encoding='utf-8') as f:
            json.dump(formatted_urls, f, ensure_ascii=False, indent=4)

        customer_dir = f"Dataset_customer{customer_id}"
        os.makedirs(customer_dir, exist_ok=True)

        with open(subdir_output_file, 'r') as f:
            subdirectory_urls = json.load(f)

        destination_path = os.path.join(customer_dir, subdir_output_file)
        shutil.move(subdir_output_file, destination_path)

        return {
            "message": "Subdirectory spider completed successfully",
            "output_file": subdir_output_file,
            "subdirectory_urls": subdirectory_urls,
            "url_count": len(subdirectory_urls)
        }
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/run_content_extraction")
async def run_content_extraction(customer_id: str = Body(...), urls: List[str] = Body(...)):

    urlsList = urls
    content_output_file = f"content_customer{customer_id}.json"
    with open(content_output_file, 'w') as f:
        pass
    try:

        subprocess.call([
            'scrapy', 'crawl', 'content_extractor',
            '-a', f'urls={",".join(urlsList)}',
            '-o', f'{content_output_file}'
        ], cwd=r'myproject')
        # source_path2 = os.path.join("myproject", f"{urlsList}")

        # if os.path.exists(source_path2):
        #     os.remove(source_path2)

        source_path = os.path.join("myproject", f"{content_output_file}")
        destination_path = os.path.join(
            os.path.dirname(__file__), f"{content_output_file}")

        shutil.move(source_path, destination_path)

        with open(content_output_file, 'r', encoding='utf-8') as json_file:
            scraped_data = json.load(json_file)

        sanitized_data = []
        for entry in scraped_data:
            if isinstance(entry, dict):
                sanitized_entry = {}
                for key, value in entry.items():
                    if isinstance(value, str):
                        sanitized_value = value.replace(
                            '\t', ' ').replace('\n', ' ').strip()
                        sanitized_entry[key] = sanitized_value
                    else:
                        sanitized_entry[key] = value
                sanitized_data.append(sanitized_entry)
            elif isinstance(entry, str):
                sanitized_entry = entry.replace(
                    '\t', ' ').replace('\n', ' ').strip()
                sanitized_data.append(sanitized_entry)
            else:
                sanitized_data.append(entry)

        with open(destination_path, 'w', encoding='utf-8') as json_file:
            json.dump(sanitized_data, json_file, ensure_ascii=False, indent=4)

        customer_dir = f"Dataset_customer{customer_id}"
        os.makedirs(customer_dir, exist_ok=True)

        destination_path = os.path.join(customer_dir, content_output_file)
        shutil.move(content_output_file, destination_path)

        _update_dataset(customer_id, customer_dir)

        return {
            "message": "Content extraction completed successfully",
        }
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add_text_to_dataset")
async def add_text_to_dataset(customer_id: str = Body(...), user_text: str = Body(...)):
    try:

        customer_dir = f"Dataset_customer{customer_id}"
        os.makedirs(customer_dir, exist_ok=True)

        text_file_path = os.path.join(
            customer_dir, f"manual_input_{customer_id}.txt")
        with open(text_file_path, 'w', encoding='utf-8') as text_file:
            text_file.write(user_text)

        _update_dataset(customer_id, customer_dir)

        return JSONResponse(content={
            "message": f"Text added successfully to dataset for customer {customer_id}",
            "text_file": f"manual_input_{customer_id}.txt"
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# An api that takes customer id as solana and input title and code and adds it to the dataset of the customer and updates the dataset of the customer and also add embeddings to the vectorstore


@app.post("/add_code_to_dataset")
async def add_code_to_dataset(customer_id: str = Body(...), title: str = Body(...), code: str = Body(...)):
    try:

        customer_dir = f"Dataset_customer{customer_id}"
        os.makedirs(customer_dir, exist_ok=True)

        code_file_path = os.path.join(
            customer_dir, f"manual_code_{customer_id}.txt")
        with open(code_file_path, 'w', encoding='utf-8') as code_file:
            code_file.write(f"{title}\n\n{code}")

        _update_dataset(customer_id, customer_dir)

        return JSONResponse(content={
            "message": f"Code added successfully to dataset for customer {customer_id}",
            "code_file": f"manual_code_{customer_id}.txt"
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add_faq")
def add_faq(customer_id: str = Body(...), question: str = Body(...), answer: str = Body(...)):
    try:
        customer_dir = f"Dataset_customer{customer_id}"
        os.makedirs(customer_dir, exist_ok=True)

        faq_file_path = os.path.join(customer_dir, f"faq_{customer_id}.json")

        if os.path.exists(faq_file_path):
            with open(faq_file_path, 'r', encoding='utf-8') as faq_file:
                faq_data = json.load(faq_file)
        else:
            faq_data = {}

        faq_data[question] = answer

        with open(faq_file_path, 'w', encoding='utf-8') as faq_file:
            json.dump(faq_data, faq_file, indent=4)

        update_dataset(customer_id, customer_dir)

        return JSONResponse(content={
            "message": f"FAQ added successfully for customer {customer_id}",
            "faq_file": f"faq_{customer_id}.json"
        }, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
