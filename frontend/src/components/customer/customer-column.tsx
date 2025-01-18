import { ColumnDef } from "@tanstack/react-table";
import { ClipboardPlus } from "lucide-react";
import CustomerDetailSheet from "./customer-detail-sheet";
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CreateAgreement from "../agreements/create-agreement";

export type CustomerColumn = {
    role: string;
    company: string[];
    _id: string;
    name: string;
    email: string;
    password: string;
    picture: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const columns: ColumnDef<CustomerColumn>[] = [
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
            <div>
                <CustomerDetailSheet row={row} />
                <Sheet>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <Button variant="outline" size='icon'><ClipboardPlus /></Button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Create agreement</p>
                        </TooltipContent>
                    </Tooltip>
                    <SheetContent className="sm:max-w-[50vw] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Create agreement</SheetTitle>
                            <SheetDescription>
                                <p>Create agreement for Customer <span className="font-bold">{row.getValue("name")}</span></p>
                            </SheetDescription>
                        </SheetHeader>
                        <CreateAgreement />
                    </SheetContent>
                </Sheet>
            </div>
        )
    },
    {
        accessorKey: "customer_id",
        header: "ID",
        cell: ({ row }) => (
            // <div>{row.getValue("customer_id")}</div>
            <div>{row.index + 1}</div>
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
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <div>{row.getValue("role")}</div>
        ),
    },
    // {
    //     accessorKey: "phone",
    //     header: "Phone",
    //     cell: ({ row }) => (
    //         <div>{row.getValue("phone")}</div>
    //     ),
    // },
    // {
    //     accessorKey: "agreement_name",
    //     header: "Agreement Name",
    //     cell: ({ row }) => (
    //         <div>{row.getValue("agreement_name")}</div>
    //     ),
    // },
    // {
    //     accessorKey: "agreement_number",
    //     header: "Agreement Number",
    //     cell: ({ row }) => (
    //         <div>{row.getValue("agreement_number")}</div>
    //     ),
    // },
    // {
    //     accessorKey: "agreement_start",
    //     header: "Agreement Start",
    //     cell: ({ row }) => (
    //         <div>{row.getValue("agreement_start")}</div>
    //     ),
    // },
    // {
    //     accessorKey: "agreement_end",
    //     header: "Agreement End",
    //     cell: ({ row }) => (
    //         <div>{row.getValue("agreement_end")}</div>
    //     ),
    // },
    // {
    //     accessorKey: "status",
    //     header: "Status",
    //     cell: ({ row }) => (
    //         <div className="capitalize">{row.getValue("status")}</div>
    //     ),
    // },
]