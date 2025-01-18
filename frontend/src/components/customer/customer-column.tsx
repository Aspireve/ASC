import { ColumnDef } from "@tanstack/react-table";
import { ClipboardPlus, Eye } from "lucide-react";
import CustomerDetailSheet from "./customer-detail-sheet";
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
            <div>
                <CustomerDetailSheet row={row} />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size='icon'><ClipboardPlus /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create agreement</p>
                    </TooltipContent>
                </Tooltip>

            </div>
        )
    },
    {
        accessorKey: "customer_id",
        header: "ID",
        cell: ({ row }) => (
            <div>{row.getValue("customer_id")}</div>
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