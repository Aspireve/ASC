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
import { Badge } from "@/components/ui/badge";
import CreateAgreement from "../agreements/create-agreement";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        cell: ({ row }) => {
            const customerId = row?.original?._id; // Access the _id directly from original data
            if (!customerId) return null;
            const handleClick = () => {
                localStorage.setItem('customerIdToCheck', customerId);
            };

            return (
                <div className="flex items-center gap-2 font-dm-sans">
                    <CustomerDetailSheet row={row} />
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
                                    Create an agreement for <span className="font-medium text-foreground">{row.getValue("name")}</span>
                                </SheetDescription>
                            </SheetHeader>
                            <CreateAgreement customerId={customerId} /> {/* Pass the _id to CreateAgreement */}
                        </SheetContent>
                    </Sheet>
                </div>
            );
        }
    },
    {
        accessorKey: "_id", // Add _id column for proper data access
        header: "ID",
        cell: ({ row }) => (
            <div className="font-medium text-sm text-muted-foreground w-10">
                #{String(row.index + 1).padStart(3, '0')}
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => {
            const name = row.getValue("name") as string;
            if (!name) return null; // Guard against undefined name

            const initials = name
                .split(' ')
                .map(n => n?.[0] || '')
                .join('')
                .toUpperCase();

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {initials || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{name}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.getValue("email") || 'No email'}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            if (!email) return <span className="text-sm text-muted-foreground">No email</span>;

            return (
                <div className="text-sm">
                    <a
                        href={`mailto:${email}`}
                        className="text-primary hover:underline"
                    >
                        {email}
                    </a>
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = (row.getValue("role") as string)?.toLowerCase() || 'user';
            const roleColors: Record<string, { bg: string; text: string }> = {
                admin: { bg: "bg-red-50", text: "text-red-700" },
                user: { bg: "bg-blue-50", text: "text-blue-700" },
                manager: { bg: "bg-purple-50", text: "text-purple-700" },
                default: { bg: "bg-gray-50", text: "text-gray-700" }
            };

            const { bg, text } = roleColors[role] || roleColors.default;

            return (
                <Badge
                    variant="secondary"
                    className={`${bg} ${text} border-0 font-medium capitalize`}
                >
                    {role}
                </Badge>
            );
        },
    },
]