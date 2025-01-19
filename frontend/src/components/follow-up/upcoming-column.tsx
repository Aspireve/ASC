import { ColumnDef } from "@tanstack/react-table";

interface Revision {
    _id: string;
    revisionNumber: number;
    changes: string;
    revisedBy: string;
    revisedAt: string; // ISO date string
}

export type UpcomingColumn = {
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
    expiryDate: number;
}

export const columns: ColumnDef<UpcomingColumn>[] = [
    // {
    //     accessorKey: 'action',
    //     header: 'Action',
    //     cell: () => (
    //         <div>Action</div>
    //     )
    // },
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
        header: 'Expiry-In Days',
        cell: ({ row }) => (
            <div>{row.getValue("expiryDate")}</div>
        )
    },
    // {
    //     accessorKey: 'companyName',
    //     header: 'Organization Name',
    //     cell: ({ row }) => (
    //         <div>{row.getValue("companyName")}</div>
    //     )
    // }

]