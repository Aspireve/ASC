import React from 'react';
import { Row } from "@tanstack/react-table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { CustomerColumn } from "./customer-column";
import { Eye, ExternalLink, History, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface DetailFieldProps {
    label: string;
    value: string | number | null;
    type?: 'text' | 'date' | 'email' | 'status';
}

const DetailField = ({ label, value, type = 'text' }: DetailFieldProps) => {
    if (!value) return null;

    const formattedValue = type === 'date'
        ? format(new Date(value), 'MMM d, yyyy')
        : value;

    return (
        <div className="flex justify-between items-baseline py-3 border-b border-border/40 last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            {type === 'email' ? (
                <a
                    href={`mailto:${value}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                >
                    {value}
                    <ExternalLink className="h-3 w-3" />
                </a>
            ) : type === 'status' ? (
                <Badge
                    variant={value === 'Active' ? 'success' : 'destructive'}
                    className="rounded-full px-3"
                >
                    {value}
                </Badge>
            ) : (
                <span className="text-sm font-medium">{formattedValue}</span>
            )}
        </div>
    );
};

const CustomerHistory = () => {
    const historyItems = [
        {
            date: new Date('2024-03-15'),
            action: 'Agreement Renewed',
            description: 'Customer renewed their agreement for another year',
            type: 'success'
        },
        {
            date: new Date('2024-02-01'),
            action: 'Contact Updated',
            description: 'Updated phone number and email address',
            type: 'info'
        },
        {
            date: new Date('2023-12-15'),
            action: 'Payment Method Changed',
            description: 'Switched to automatic bank transfer',
            type: 'info'
        },
    ];

    return (
        <div className="space-y-6 pt-2">
            {historyItems.map((item, index) => (
                <div key={index} className="relative pl-6">
                    {index !== historyItems.length - 1 && (
                        <div
                            className="absolute left-[11px] top-6 h-full w-[2px] bg-border/30"
                        />
                    )}
                    <div className="relative pb-6">
                        <Circle
                            className={`absolute left-0 top-1 h-[22px] w-[22px] ${item.type === 'success'
                                ? 'text-emerald-500 fill-emerald-500/10'
                                : 'text-blue-500 fill-blue-500/10'
                                }`}
                        />
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                    {item.action}
                                </p>
                                <time className="text-xs text-muted-foreground">
                                    {format(item.date, 'MMM d, yyyy')}
                                </time>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CustomerDetailSheet = ({ row }: { row: Row<CustomerColumn> }) => {
    const customerDetails = [
        { label: 'Customer ID', value: row.getValue('customer_id') },
        { label: 'Name', value: row.getValue('name') },
        { label: 'Email', value: row.getValue('email'), type: 'email' },
        { label: 'Role', value: row.getValue('role') },
        { label: 'Phone', value: row.getValue('phone') },
    ];


    const agreementDetails = [
        { label: 'Agreement Name', value: row.getValue('agreement_name') },
        { label: 'Agreement Number', value: row.getValue('agreement_number') },
        { label: 'Agreement Start', value: row.getValue('agreement_start'), type: 'date' },
        { label: 'Agreement End', value: row.getValue('agreement_end'), type: 'date' },
        { label: 'Status', value: row.getValue('status'), type: 'status' },
    ];

    return (
        <Sheet>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/5 transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View Customer Details</p>
                </TooltipContent>
            </Tooltip>

            <SheetContent className="sm:max-w-xl">
                <SheetHeader className="space-y-1">
                    <SheetTitle className="text-xl font-semibold">
                        {row.getValue('name')}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        Customer #{row.getValue('customer_id')}
                    </p>
                </SheetHeader>

                <Tabs defaultValue="details" className="mt-8">
                    <TabsList className="grid w-full grid-cols-2 h-12">
                        <TabsTrigger
                            value="details"
                            className="flex items-center gap-2 data-[state=active]:bg-primary/5"
                        >
                            <Eye className="h-4 w-4" />
                            Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2 data-[state=active]:bg-primary/5"
                        >
                            <History className="h-4 w-4" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[calc(100vh-14rem)] mt-6">
                        <TabsContent value="details" className="mt-0 focus-visible:outline-none">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-3">Customer Information</h3>
                                    <div className="rounded-lg border border-border/50 divide-y divide-border/50">
                                        {customerDetails.map((detail) => (
                                            <DetailField
                                                key={detail.label}
                                                label={detail.label}
                                                value={detail.value}
                                                type={detail.type as DetailFieldProps['type']}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-3">Agreement Information</h3>
                                    <div className="rounded-lg border border-border/50 divide-y divide-border/50">
                                        {agreementDetails.map((detail) => (
                                            <DetailField
                                                key={detail.label}
                                                label={detail.label}
                                                value={detail.value}
                                                type={detail.type as DetailFieldProps['type']}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="history" className="mt-0 focus-visible:outline-none">
                            <CustomerHistory />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};

export default CustomerDetailSheet;