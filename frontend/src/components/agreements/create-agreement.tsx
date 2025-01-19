import * as React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";
import Markdown from "react-markdown";
import { GeminiTool } from "./gemini";
import { toast } from 'react-hot-toast'
import ButtonGradient from "../shared/ButtonGradient";

interface Agreement {
    title: string;
    content: string;
}

const CreateAgreement = ({ customerId }: { customerId: string }) => {
    const [agreement, setAgreement] = useState<Agreement>({
        title: "",
        content: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    const editorRef = useRef<EditorJS | null>(null);
    const isEditorInitialized = useRef(false);

    const [organization, setOrganization] = useState<any>({});
    const [customer, setCustomer] = useState<any>({});
    const [aiResponse, setAIResponse] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setAgreement((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [lmaoNo, setLmaoNo] = useState(false);
    useEffect(() => {
        console.log(agreement.content)
        if (agreement && agreement.content && JSON.parse(agreement?.content)?.time === 1737245451442) {
            setLmaoNo(true);
        }
    }, [agreement]);

    useEffect(() => {
        const fetchOrganizationAndCustomerDetails = async () => {
            try {
                const organizationResponse = await axios.get(
                    `https://asc-cuhd.onrender.com/v1/company/create`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log(organizationResponse.data);

                setOrganization(organizationResponse.data);
                const idToCheck = localStorage.getItem("customerIdToCheck");
                const customerResponse = await axios.get(
                    `https://asc-cuhd.onrender.com/v1/agree/get?_id=${idToCheck}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log("Customer response:", customerResponse.data);

                setCustomer(customerResponse.data);
            } catch (error) {
                console.error("Error fetching organization or customer data:", error);
            }
        };

        fetchOrganizationAndCustomerDetails();
    }, [customerId, accessToken]);

    useEffect(() => {
        const initEditor = async () => {
            if (!isEditorInitialized.current) {
                try {
                    const editor = new EditorJS({
                        holder: "editorjs",
                        placeholder: "Start typing your content...",
                        data: agreement.content ? JSON.parse(agreement.content) : {},
                        onChange: async () => {
                            try {
                                const outputData = await editor?.save();
                                if (outputData) {
                                    setAgreement((prev) => ({
                                        ...prev,
                                        content: JSON.stringify(outputData),
                                    }));
                                }
                            } catch (error) {
                                console.error("Failed to save editor data:", error);
                            }
                        },
                        tools: {
                            header: {
                                class: Header,
                                config: {
                                    placeholder: "Enter header text",
                                },
                                inlineToolbar: true,
                            },
                            raw: RawTool,
                            //   markdownParser: MDParser,
                            aiagent: {
                                class: GeminiTool,
                                config: {
                                    setAgreement,
                                    organization,
                                    customer,
                                    agreement
                                },
                                inlineToolbar: true,
                            },
                            list: {
                                class: List,
                                inlineToolbar: true,
                            },
                            image: {
                                class: ImageTool,
                                config: {
                                    uploader: {
                                        uploadByFile(file: File) {
                                            return new Promise((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    resolve({
                                                        success: 1,
                                                        file: {
                                                            url: reader.result as string,
                                                        },
                                                    });
                                                };
                                                reader.onerror = reject;
                                                reader.readAsDataURL(file);
                                            });
                                        },
                                    },
                                },
                            },
                            table: Table,
                            linkTool: {
                                class: LinkTool,
                                config: {
                                    endpoint: "/your-link-endpoint",
                                },
                            },
                        },
                        inlineToolbar: true,
                    });

                    await editor.isReady;
                    editorRef.current = editor;
                    isEditorInitialized.current = true;
                } catch (error) {
                    console.error("Editor initialization failed:", error);
                }
            }
        };

        initEditor();

        return () => {
            if (
                editorRef.current &&
                typeof editorRef.current.destroy === "function"
            ) {
                try {
                    editorRef.current.destroy();
                    editorRef.current = null;
                    isEditorInitialized.current = false;
                } catch (error) {
                    console.error("Editor cleanup failed:", error);
                }
            }
        };
    }, [agreement.content]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        try {
            let finalContent = agreement.content;

            if (editorRef.current) {
                const outputData = await editorRef.current.save();
                finalContent = JSON.stringify(outputData);
            }

            const contentPayload = {
                title: agreement.title,
                content: finalContent,
                customer: customerId,
            };

            const response = await axios.post(
                "https://asc-cuhd.onrender.com/v1/agree/agreement",
                contentPayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("Content submitted successfully:", response.data);
            toast.success("Agreement submitted successfully");

            // setAgreement({ title: "", content: "" });
            // if (editorRef.current && typeof editorRef.current.clear === "function") {
            //     editorRef.current.clear();
            // }

            setTimeout(() => {
                window.location.reload(); // Reload the page after 1 second
            }, 1000);
        } catch (error) {
            console.error("Error submitting content:", error);
        }
    };

    const handleAISuggestion = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://asc-cuhd.onrender.com/v1/ai/gaip",
                {
                    title: agreement.title,
                    content: agreement.content,
                    organizationType: organization.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("AI suggestions:", response.data.data);

            if (response.data && response.data.data) {
                // const updatedData = markdownToTxt(response.data.data);
                setAIResponse(response.data.data);
            } else {
                console.error("No data received from API.");
            }
        } catch (error) {
            console.error("Error getting AI suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-dm-sans p-4">
            <form
                className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Create Agreement
                </h1>

                <div className="mb-4">
                    <div className="mb-4">
                        <input
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Title"
                            value={agreement.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Display Organization Details */}
                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Organization Details</h2>
                    <p>Name: {organization?.data?.[0]?.name}</p>
                    <p>Address: {organization?.data?.[0]?.address}</p>
                    <p>Contact: {organization?.data?.[0]?.contactDetails?.phone}</p>
                </div>

                {/* Display Customer Details */}
                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Customer Details</h2>
                    <p onClick={() => console.log(customer)}>
                        Name: {customer?.userId?.name}
                    </p>
                    <p>Email: {customer?.userId?.email}</p>
                    <p>Phone: {customer?.userId?.phone || "+91 9327774534"}</p>
                </div>

                <div className="mb-6 flex flex-col items-center">
                    <ButtonGradient isLoading={isLoading} handleClick={handleAISuggestion} />
                    {/* <AIButton isLoading={isLoading} handleClick={handleAISuggestion} /> */}
                    {/* <button
                        type="button"
                        onClick={handleAISuggestion}
                        disabled={isLoading}
                        className={`
                            w-full flex items-center justify-center px-4 py-3 
                            border border-transparent text-sm font-medium rounded-md
                            text-white bg-gradient-to-r from-purple-600 to-indigo-600
                            hover:from-purple-700 hover:to-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                            transition-all duration-300 ease-in-out
                            ${isLoading
                                ? "bg-opacity-75 cursor-not-allowed"
                                : "hover:shadow-lg"
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                <span>Generating AI Suggestions...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Get AI Suggestions
                            </>
                        )}
                    </button> */}
                    <div
                        id="AI responses"
                        style={{ display: isLoading ? "none" : "block" }}
                    >
                        {isLoading ? (
                            <p></p>
                        ) : (
                            // <pre>{aiResponse || "No AI suggestions available."}</pre>
                            <p className="mt-4">
                                {aiResponse ? (
                                    <Markdown>{aiResponse}</Markdown>
                                ) : (
                                    ""
                                )}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="content"
                        onClick={() => console.log(agreement)}
                    >
                        Content
                    </label>
                    {lmaoNo ? (
                        <Markdown>{JSON.parse(agreement?.content)?.blocks?.[0]?.data?.text}</Markdown>
                    ) : (
                        <div
                            id="editorjs"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4"
                            style={{ minHeight: "400px" }}
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Agreement
                </button>
            </form>
        </div>
    );
};

export default CreateAgreement;
