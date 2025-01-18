import * as React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
// @ts-expect-error
import LinkTool from "@editorjs/link";

interface Agreement {
    title: string;
    content: string;
}

const CreateAgreement = ({ customerId }: { customerId: string }) => {
    const [agreement, setAgreement] = useState<Agreement>({
        title: "",
        content: "",
    });

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    const editorRef = useRef<EditorJS | null>(null);
    const isEditorInitialized = useRef(false);

    const [organization, setOrganization] = useState<any>({});
    const [customer, setCustomer] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setAgreement((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchOrganizationAndCustomerDetails = async () => {
            try {
                const organizationResponse = await axios.get(`http://localhost:5000/v1/company/create`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(organizationResponse.data);
                setOrganization(organizationResponse.data);
                const idToCheck = localStorage.getItem("customerIdToCheck");
                const customerResponse = await axios.get(`http://localhost:5000/v1/customer/get/${idToCheck}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
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
            if (editorRef.current && typeof editorRef.current.destroy === "function") {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

            const response = await axios.post("http://localhost:5000/v1/agree/agreement", contentPayload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Content submitted successfully:", response.data);

            setAgreement({ title: "", content: "" });
            if (editorRef.current && typeof editorRef.current.clear === "function") {
                editorRef.current.clear();
            }
        } catch (error) {
            console.error("Error submitting content:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-dm-sans p-4">
            <form
                className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Agreement</h1>

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

                {/* Display Organization Details */}
                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Organization Details</h2>
                    <p>Name: {organization.name}</p>
                    <p>Address: {organization.address}</p>
                    <p>Contact: {organization.contact}</p>
                </div>

                {/* Display Customer Details */}
                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Customer Details</h2>
                    <p>Name: {customer.name}</p>
                    <p>Email: {customer.email}</p>
                    <p>Phone: {customer.phone}</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="content">
                        Content
                    </label>
                    <div
                        id="editorjs"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4"
                        style={{ minHeight: "400px" }}
                    />
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
