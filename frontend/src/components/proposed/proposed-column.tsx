import { ColumnDef } from "@tanstack/react-table";
import { ClipboardPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import CreateAgreement from "../agreements/proposed";

interface Revision {
    _id: string;
    revisionNumber: number;
    changes: string;
    revisedBy: string;
    revisedAt: string;
}

export interface ProposedColumn {
    customer: string[];
    _id: string;
    title: string;
    content: string;
    createdBy: string;
    status: string;
    effectiveDate: string;
    company: string;
    agreementId: string;
    revisions: Revision[];
    createdAt: string;
    updatedAt: string;
    companyName: string;
    __v: number;
    expiryDate: number;
}

export const columns: ColumnDef<ProposedColumn>[] = [
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const agreementId = row.original._id;
            if (!agreementId) return null;
            const handleLocal = () => {
                localStorage.setItem('customerIdToCheck', row.original._id);
            }

            return (
                <div className="flex items-center gap-2">
                    <Sheet>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-primary/5 transition-colors"
                                    >
                                        <Eye className="h-4 w-4 text-[#1d4ed8]" />
                                    </Button>
                                </SheetTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View agreement details</p>
                            </TooltipContent>
                        </Tooltip>
                        <SheetContent className="sm:max-w-[50vw] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="text-xl font-semibold">Agreement</SheetTitle>
                                <SheetDescription>
                                    See the details of agreement
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-5">
                                <div>
                                    <span className="font-semibold">Title : </span>
                                    <span>{row.getValue("title")}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Content : </span>
                                    <span>{row.getValue("content")}</span>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Sheet>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-primary/5 transition-colors"
                                        onClick={handleLocal}
                                    >
                                        <ClipboardPlus className="h-4 w-4 text-[#50bd6b]" />
                                    </Button>
                                </SheetTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create Agreement</p>
                            </TooltipContent>
                        </Tooltip>
                        <SheetContent className="sm:max-w-[50vw] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="text-xl font-semibold">New Agreement</SheetTitle>
                                <SheetDescription>
                                    Create an agreement for <span className="font-medium text-foreground">{row.getValue("title")}</span>
                                </SheetDescription>
                            </SheetHeader>
                            <CreateAgreement customerId={agreementId} />
                        </SheetContent>
                    </Sheet>
                </div>
            );
        }
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <div className="font-medium text-sm text-muted-foreground w-10">
                #{String(row.index + 1).padStart(3, '0')}
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-sm">{row.getValue("title")}</span>
                <span className="text-xs text-muted-foreground">
                    ID: {row.original._id}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = (row.getValue("status") as string)?.toLowerCase() || 'pending';
            const statusColors: Record<string, { bg: string; text: string }> = {
                accepted: { bg: "bg-green-50", text: "text-green-700" },
                pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
                rejected: { bg: "bg-red-50", text: "text-red-700" },
                expired: { bg: "bg-gray-50", text: "text-gray-700" }
            };

            const { bg, text } = statusColors[status] || statusColors.pending;

            return (
                <Badge
                    variant="secondary"
                    className={`${bg} ${text} border-0 font-medium capitalize`}
                >
                    {status}
                </Badge>
            );
        },
    },
    // {
    //     accessorKey: "expiryDate",
    //     header: "Expiry Days",
    //     cell: ({ row }) => (
    //         <div className="text-sm">
    //             {row.getValue("expiryDate")} days
    //         </div>
    //     ),
    // },
    {
        accessorKey: "companyName",
        header: "Organization",
        cell: ({ row }) => (
            <div className="text-sm font-medium">
                {row.getValue("companyName")}
            </div>
        ),
    },
    {
        accessorKey: 'content',
        header: () => <div></div>,
        cell: () => <div></div>,
    }
];