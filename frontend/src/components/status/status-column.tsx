import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Sheet, ClipboardPlus } from "lucide-react";
import CreateAgreement from "../agreements/create-agreement";
import CustomerDetailSheet from "../customer/customer-detail-sheet";
import { Button } from "../ui/button";
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { CustomerColumn } from "../customer/customer-column";

interface Revision {
    _id: string;
    revisionNumber: number;
    changes: string;
    revisedBy: string;
    revisedAt: string; // ISO date string
}

export interface StatusColumn {
    customer: string[]; // Array of customer IDs
    _id: string; // Agreement ID
    title: string;
    content: string;
    createdBy: string; // ID of the creator
    status: string; // Example: 'Accepted'
    effectiveDate: string; // ISO date string
    company: string; // ID of the company
    agreementId: string; // Related agreement ID
    revisions: Revision[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    companyName: string;
    __v: number;
    expiryDate: number; // Could represent a duration in days, weeks, etc.
}


export const columns: ColumnDef<StatusColumn>[] = [
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const customerId = row.original._id;
            if (!customerId) return <div>Error: Customer ID missing</div>;

            const handleClick = () => {
                localStorage.setItem('customerIdToCheck', customerId);
            };

            return (
                <div className="flex items-center gap-2 font-dm-sans">
                    <CustomerDetailSheet row={row as unknown as Row<CustomerColumn>} />
                    <Sheet>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-primary/5 transition-colors"
                                        onClick={handleClick}
                                    >
                                        <ClipboardPlus className="h-4 w-4" />
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
                            <CreateAgreement customerId={customerId} />
                        </SheetContent>
                    </Sheet>
                </div>
            );
        }
    },

    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div>{row.index + 1}</div>
        )
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <div>{row.getValue("title")}</div>
        )
    },
    {
        accessorKey: 'expiryDate',
        header: 'Expiry Day',
        cell: ({ row }) => (
            <div>{row.getValue("expiryDate")}</div>
        )
    },
    {
        accessorKey: 'companyName',
        header: 'Organization Name',
        cell: ({ row }) => (
            <div>{row.getValue("companyName")}</div>
        )
    }
]