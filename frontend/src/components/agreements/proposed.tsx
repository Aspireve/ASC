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
import { Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import { GeminiTool } from "./gemini";
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
    const [contentData, setContentData] = useState(`
AGREEMENT OF PURCHASE
This agreement is entered into by and between  (“Institution”) and  (“Seller”).
WHEREAS, the Seller desires to sell to the Institution a comprehensive collection of  (“Collection”), as more particularly described in the attached inventory (Attachment A), which is incorporated herein by reference; and,
 WHEREAS, the Institution deems it in its interest to acquire the Collection for custodial care and appropriate service to the public, and agrees to purchase the Collection under the terms hereafter stated;
NOW, THEREFORE, the parties hereby agree as follows:

1) Purchase
The Seller agrees to sell, and the Institution agrees to buy, the Collection for a total purchase price of __________ (“Purchase Price”). The Institution shall initiate payment of the Purchase Price immediately after receipt and satisfactory inspection of the Collection.

2) Copyright
The Seller and Institution agree to one of the following options:
a) The Seller hereby dedicates to the public domain such intellectual property as the Seller may own in the Collection.
 OR
 b) The Seller hereby transfers and assigns to the Institution such intellectual property as the Seller may own in the Collection.
 OR
 c) The Seller hereby dedicates to the public domain such intellectual property as the Seller may own in the Collection, subject to the following exceptions:
 _________________________________________________________________.
 OR
 d) The Seller reserves all rights in such intellectual property as the Seller may own in the Collection, subject to the uses identified in Attachment B, which is incorporated herein by reference.

3) Shipping
a) Costs. The Seller will arrange and pay for shipping the Collection to the Institution.
 b) Risk of Loss. The Seller bears responsibility for the Collection, including the risk of loss or damage, until it arrives at the Institution. The Seller is responsible for purchasing private insurance for shipment if desired.
 c) Inspection and Acceptance.
The Institution will have 90 days after receipt to inspect the Collection for inventory accuracy and condition.
If there is a significant discrepancy (defined as __________________), the Institution may refuse the Collection and withhold payment.
If unresolved, the Collection will be returned to the Seller at the Seller’s expense unless the discrepancy is cured within 90 days of notice or any later time agreed upon by both parties.
The Institution will indicate acceptance or rejection of the Collection in writing. For rejected or missing items, payment will be reduced by $___ per item or the Institution may accept alternative replacements.

4) Warranties and Indemnifications
a) Warranty of Title. The Seller represents and warrants they are the lawful owner of the Collection and have full authority to sell it free of encumbrances.
 b) Authority to Sign Agreement. The Seller warrants they have the necessary authority to sign this agreement.
 c) Seller Indemnification. The Seller agrees to indemnify the Institution against all claims, lawsuits, damages, or expenses (including attorneys' fees) arising from the Seller’s breach of warranties or undertakings.

5) Publicity
The Seller must obtain prior written approval from the Institution to use its trademarks, trade names, images, or holdings (“Proprietary Marks”) in any medium. Approved uses in the same context and format do not require additional approval.

6) Notice
All required notices must be in writing and sent to _________________________ via _________________________. Notice becomes effective when given.

7) Miscellaneous
a) Nature of Relationship. This agreement does not create a partnership or joint venture.
 b) No Waiver. Modifications or waivers must be in writing. A waiver of one breach does not waive subsequent breaches.
 c) Severability. If any provision is invalid, the remaining provisions remain in effect.
 d) Force Majeure. Performance is excused during unforeseen events like government restrictions, war, or natural disasters beyond the parties' control.
 e) Captions. Section headings are for convenience only and not for interpreting the agreement.
 f) Counterparts. This agreement may be signed in counterparts, each being deemed an original.
 g) Assignment. Neither party may assign this agreement without the other's written consent.
 h) Entire Agreement. This agreement supersedes prior agreements and constitutes the entire understanding.
 i) Choice of Law and Venue. This agreement is governed by the laws of __________________, with venue exclusively in the courts of __________________.

Effective Date and Signatures
The effective date of this agreement is the last date of signature below.
For the Institution
 By: ______________________________
 Name: ___________________________
 Address: _________________________
 Date: ____________________________
For the Seller
 By: ______________________________
 Date: ____________________________

This formatted version ensures better readability while maintaining the legal structure and content.

This formatted version ensures better readability while maintaining the legal structure and content.`);
    const [isLoading, setIsLoading] = useState(false);
    const [organization, setOrganization] = useState<any>({});
    const [customer, setCustomer] = useState<any>({});
    const [aiResponse, setAIResponse] = useState<string | null>(null);
    const [agreements, setAgreements] = useState<any>({});  // Changed from array to object
    const [changes, setChanges] = useState("");

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken?.accessToken;
    const editorRef = useRef<EditorJS | null>(null);
    const isEditorInitialized = useRef(false);

    async function handleAmend() {
        if (!agreements._id) return;  // Add validation

        try {
            await axios.post(
                `https://asc-cuhd.onrender.com/v1/agree/add-terms?_id=${agreements._id}`,  // Fixed quote
                { changes },  // Send changes as an object
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // window.location.reload();
        } catch (error) {
            console.error("Error amending agreement:", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        if (name === "content") {
            setContentData(value);
        }
        setAgreement((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;

            try {
                const res = await axios.post(
                    `https://asc-cuhd.onrender.com/v1/agree/get-all-agreements`,
                    { status: "Ready" },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // Fetch the agreementId from localStorage
                const agreementId = localStorage.getItem("customerIdToCheck");

                if (res.data && agreementId) {
                    // Find the agreement with the matching _id
                    const matchingAgreement = res.data.find((item: { _id: string; }) => item._id === agreementId);

                    if (matchingAgreement) {
                        // Set the matching agreement in state
                        setAgreements(matchingAgreement);
                        console.log("Matching Agreement:", matchingAgreement);
                    } else {
                        console.warn("No matching agreement found for the given ID.");
                    }
                } else if (res.data?.[0]) {
                    // Fallback: Set the first agreement if no agreementId is in localStorage
                    setAgreements(res.data[0]);
                    console.log("Default Agreement:", res.data[0]);
                }
            } catch (error) {
                console.error("Error fetching agreements:", error);
            }
        };
        fetchData();
    }, [accessToken]);

    useEffect(() => {
        const fetchOrganizationAndCustomerDetails = async () => {
            if (!accessToken) return;

            try {
                const organizationResponse = await axios.get(
                    `https://asc-cuhd.onrender.com/v1/company/create`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setOrganization(organizationResponse.data);

                const idToCheck = customerId || localStorage.getItem("customerIdToCheck");  // Use customerId prop first
                if (!idToCheck) return;

                const customerResponse = await axios.get(
                    `https://asc-cuhd.onrender.com/v1/agree/get?_id=${idToCheck}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
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
            if (editorRef.current?.destroy) {
                try {
                    editorRef.current.destroy();
                    editorRef.current = null;
                    isEditorInitialized.current = false;
                } catch (error) {
                    console.error("Editor cleanup failed:", error);
                }
            }
        };
    }, [agreement.content, organization, customer]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!accessToken) return;

        try {
            let finalContent = agreement.content;

            if (editorRef.current) {
                const outputData = await editorRef.current.save();
                finalContent = JSON.stringify(outputData);
            }

            const contentPayload = {
                title: agreements.title,
                content: contentData,
                customer: customerId,
            };

            await axios.post(
                `https://asc-cuhd.onrender.com/v1/agree/complete?_id=${localStorage.getItem("customerIdToCheck")}`,
                contentPayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            window.location.reload();
        } catch (error) {
            console.error("Error submitting content:", error);
        }
    };

    const handleAISuggestion = async () => {
        if (!accessToken) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://asc-cuhd.onrender.com/v1/ai/gain",
                {
                    title: agreements.title,
                    content: contentData,
                    organizationType: agreements.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data?.data) {
                setAIResponse(response.data.data);
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
                            value={agreements.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Organization Details</h2>
                    <p>Name: {organization?.data?.[0]?.name}</p>
                    <p>Address: {organization?.data?.[0]?.address}</p>
                    <p>Contact: {organization?.data?.[0]?.contactDetails?.phone}</p>
                </div>

                <div className="mb-4">
                    <h2 className="font-semibold text-lg">Customer Details</h2>
                    <p>Name: {customer?.userId?.name}</p>
                    <p>Email: {customer?.userId?.email}</p>
                    <p>Phone: {customer?.userId?.phone || "+91 9327774534"}</p>
                </div>

                <div className="mb-6 flex flex-col items-center">
                    <ButtonGradient isLoading={isLoading} handleClick={handleAISuggestion} />
                    {/* <button
                        type="button"
                        onClick={handleAISuggestion}
                        disabled={isLoading}
                        className={`
                            w-full flex items-center justify-center px-4 py-3 
                            border border-transparent text-sm font-medium rounded-md
                            text-white bg-gradient-to-r from-green-600 to-green-600
                            hover:from-green-700 hover:to-green-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                            transition-all duration-300 ease-in-out
                            ${isLoading ? "bg-opacity-75 cursor-not-allowed" : "hover:shadow-lg"}
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
                                AIagreed Analysis
                            </>
                        )}
                    </button> */}
                    <div className={isLoading ? "hidden" : "block"}>
                        <p className="mt-4">
                            {aiResponse ? (
                                <Markdown>{aiResponse}</Markdown>
                            ) : (
                                ""
                            )}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="content"
                    >
                        Content
                    </label>
                    <div>
                        <textarea
                            id="content"
                            name="content"
                            value={contentData}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4"
                            style={{ minHeight: "400px" }}
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="changes"
                    >
                        Changes
                    </label>
                    <input
                        id="changes"
                        value={changes}
                        onChange={(e) => setChanges(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleAmend}
                    className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Amend Agreement
                </button>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Accept Agreement
                </button>

            </form>

        </div>

    );
};

export default CreateAgreement;