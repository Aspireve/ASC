import { ColumnDef } from "@tanstack/react-table";
import CustomerDetailSheet from "./customer-detail-sheet";

export type CustomerColumn = {
    customer_id: string;
    name: string;
    email: string;
    phone: string;
    agreement_name: string;
    agreement_number: string;
    agreement_start: string;
    agreement_end: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export const columns: ColumnDef<CustomerColumn>[] = [
    {
        accessorKey: "customer_id",
        header: "ID",
        cell: ({ row }) => (
            <CustomerDetailSheet row={row} />
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div>{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div>{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div>{row.getValue("phone")}</div>
        ),
    },
    {
        accessorKey: "agreement_name",
        header: "Agreement Name",
        cell: ({ row }) => (
            <div>{row.getValue("agreement_name")}</div>
        ),
    },
    {
        accessorKey: "agreement_number",
        header: "Agreement Number",
        cell: ({ row }) => (
            <div>{row.getValue("agreement_number")}</div>
        ),
    },
    {
        accessorKey: "agreement_start",
        header: "Agreement Start",
        cell: ({ row }) => (
            <div>{row.getValue("agreement_start")}</div>
        ),
    },
    {
        accessorKey: "agreement_end",
        header: "Agreement End",
        cell: ({ row }) => (
            <div>{row.getValue("agreement_end")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
]