import { Row } from "@tanstack/react-table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { CustomerColumn } from "./customer-column"
import { Eye } from "lucide-react"

const CustomerDetailSheet = ({ row }: { row: Row<CustomerColumn> }) => {
    return (
        <Sheet>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button variant="outline" size='icon'><Eye /></Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View</p>
                </TooltipContent>
            </Tooltip>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Customer Details</SheetTitle>
                    <SheetDescription>
                        Detailed information for customer ID: {row.getValue("customer_id")}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("name")}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("email")}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("phone")}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Agreement Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("agreement_name")}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Agreement Number</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("agreement_number")}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Agreement Start</h3>
                        <p className="mt-1 text-sm text-gray-900">{format(new Date(row.getValue("agreement_start")), 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Agreement End</h3>
                        <p className="mt-1 text-sm text-gray-900">{format(new Date(row.getValue("agreement_end")), 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <p className="mt-1 text-sm text-gray-900">{row.getValue("status")}</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CustomerDetailSheet