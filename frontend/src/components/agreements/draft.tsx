import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Markdown from "react-markdown";

interface Agreement {
    title: string;
    content: string;
}

const CreateAgreement = ({ customerId }: { customerId: string }) => {
    const [agreement, setAgreement] = useState<Agreement>({
        title: "",
        content: "",
    });
    const [contentData, setContentData] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [organization, setOrganization] = useState<any>({});
    const [customer, setCustomer] = useState<any>({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [aiResponse, setAIResponse] = useState<string | null>(null);
    const [agreements, setAgreements] = useState<any[]>([]);

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken?.accessToken;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setContentData(value);
        setAgreement((prev) => ({
            ...prev,
            [name]: value,
            content: value,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;

            try {
                const res = await axios.post(
                    `https://asc-cuhd.onrender.com/v1/agree/get-all-agreements`,
                    { status: "Draft" },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const agreementId = localStorage.getItem("customerIdToCheck");

                if (res.data && agreementId) {
                    const matchingAgreement = res.data.find((item: { _id: string; }) => item._id === agreementId);

                    if (matchingAgreement) {
                        setAgreements(matchingAgreement);
                        setContentData(matchingAgreement.content);
                        setName(matchingAgreement.createdBy.name);
                        setEmail(matchingAgreement.createdBy.email);
                        console.log("Matching Agreement:", matchingAgreement);
                    } else {
                        console.warn("No matching agreement found for the given ID.");
                    }
                } else if (res.data?.[0]) {
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

                const idToCheck = localStorage.getItem("customerIdToCheck");
                if (!idToCheck) return;

                const customerResponse = await axios.get(
                    `https://asc-cuhd.onrender.com/v1/agree/get?_id=${idToCheck}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log(customerResponse)
                setCustomer(customerResponse.data);
                setContentData(customerResponse.data.content);
            } catch (error) {
                console.error("Error fetching organization or customer data:", error);
            }
        };

        fetchOrganizationAndCustomerDetails();
    }, [customerId, accessToken]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!accessToken) return;

        try {
            const contentPayload = {
                title: agreements.title,
                content: contentData,
                customer: customerId,
            };

            await axios.post(
                `https://asc-cuhd.onrender.com/v1/agree/approve?_id=${agreements._id}`,
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
                "https://asc-cuhd.onrender.com/v1/ai/gaip",
                {
                    title: agreements.title,
                    content: agreement.content,
                    organizationType: organization.type,
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

                {/* <div className="mb-4">
                    <h2 className="font-semibold text-lg">Customer Details</h2>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p onClick={() => console.log(customer)}>Name: {customer?.userId?.name}</p>
                    <p>Email: {customer?.userId?.email}</p>
                    <p>Phone: {customer?.userId?.phone || "+91 9327774534"}</p>
                </div> */}

                <div className="mb-6">
                    <button
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
                                Get AI Suggestions
                            </>
                        )}
                    </button>
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

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Approve Agreement
                </button>
            </form>
        </div>
    );
};

export default CreateAgreement;