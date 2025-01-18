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

export const columns: ColumnDef<PriorityColumn>[] = []