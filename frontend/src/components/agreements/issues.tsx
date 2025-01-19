import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const IssuesComponent = ({ customerId }) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [contentData, setContentData] = useState("");
    const [organization, setOrganization] = useState({});

    // Simulate fetching data with localStorage token
    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken?.accessToken;

    const handleContentChange = (e) => {
        setContentData(e.target.value);
    };

    const handleStatusChange = (issueId: string, newStatus: string) => {
        setIssues(issues.map(issue =>
            issue._id === issueId
                ? { ...issue, status: newStatus }
                : issue
        ));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'Resolved':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            default:
                return <Clock className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl space-y-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center justify-between">
                            Issues Management
                            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Issues List */}
                            <div className="space-y-4">
                                {issues.map((issue) => (
                                    <div
                                        key={issue._id}
                                        onClick={() => setSelectedIssue(issue)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedIssue?._id === issue._id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{issue.title}</h3>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(issue.status)}
                                                <span className={`text-sm ${issue.status === 'Resolved' ? 'text-green-600' :
                                                        issue.status === 'Open' ? 'text-yellow-600' :
                                                            'text-blue-600'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {issue.description}
                                        </p>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Created: {new Date(issue.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}

                                {issues.length === 0 && !isLoading && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            No issues found. Create a new issue to get started.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Issue Details */}
                            <div className="space-y-4">
                                {selectedIssue ? (
                                    <div className="p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold mb-4">Issue Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedIssue.title}
                                                    readOnly
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={selectedIssue.description}
                                                    readOnly
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                {selectedIssue.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => handleStatusChange(selectedIssue._id, 'Resolved')}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                    >
                                                        Mark as Resolved
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">Select an issue to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default IssuesComponent;