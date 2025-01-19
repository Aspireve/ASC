import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { ProposedColumn, columns } from "./proposed-column";
import axios from "axios";

const ProposedPending = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState<ProposedColumn[]>([]);
    const [agreements, setAgreements] = React.useState<ProposedColumn | null>(null);

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    React.useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;

            try {
                const res = await axios.post(
                    `https://asc-cuhd.onrender.com/v1/agree/get-all-agreements`,
                    { status: "Ready" },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setData(res.data);

                // Fetch the agreementId from localStorage
                const agreementId = localStorage.getItem("customerIdToCheck");

                if (res.data && agreementId) {
                    // Find the agreement with the matching _id
                    const matchingAgreement = res.data.find((item: { _id: string; }) => item._id === agreementId);

                    if (matchingAgreement) {
                        // Set the matching agreement in state
                        setAgreements(matchingAgreement);
                        console.log("Matching Agreement:", matchingAgreement);
                    } else {
                        console.warn("No matching agreement found for the given ID.");
                    }
                } else if (res.data?.[0]) {
                    // Fallback: Set the first agreement if no agreementId is in localStorage
                    setAgreements(res.data[0]);
                    console.log("Default Agreement:", res.data[0]);
                }
            } catch (error) {
                console.error("Error fetching agreements:", error);
            }
        };
        fetchData()
    }, [])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4 px-6">
                <Input
                    placeholder="Filter title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 w-full md:w-64"
                />
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto rounded-md px-4 py-2">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100 text-gray-700">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4 py-2 text-sm font-medium">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-t"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3 text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 px-6">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-md px-4 py-2"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-md px-4 py-2"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProposedPending;
