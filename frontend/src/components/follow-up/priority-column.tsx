import { ColumnDef } from "@tanstack/react-table";

export type PriorityColumn = {
    read: boolean;
    _id: string;
    userId: string;
    agreement: string;
    title: string;
    dateToDisplay: string;
    createdAt: string;
    updatedAt: string
};

export const columns: ColumnDef<PriorityColumn>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <div>{row.getValue("title")}</div>
    },
    {
        accessorKey: 'dateToDisplay',
        header: 'Expiry Date',
        cell: ({ row }) => <div>{new Date(row.getValue("dateToDisplay") as string).toLocaleDateString()}</div>
    }
]