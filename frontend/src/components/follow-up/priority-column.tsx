import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "../ui/avatar";

export type PriorityColumn = {
  read: boolean;
  _id: string;
  userId: string;
  agreement: string;
  title: string;
  dateToDisplay: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<PriorityColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "dateToDisplay",
    header: "Expiry Date",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("dateToDisplay") as string).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "userId",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("userId");
      console.log(name);
      if (!name) return null; // Guard against undefined name

      const initials = name?.name
        .split(" ")
        .map((n) => n?.[0] || "")
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name?.name}</span>
            <span className="text-xs text-muted-foreground">
              {name?.email || "No email"}
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
      const email = row.getValue("userId") as string;
      if (!email)
        return <span className="text-sm text-muted-foreground">No email</span>;

      return (
        <div className="text-sm">
          <a href={`mailto:${email?.email}`} className="text-primary hover:underline">
            {email?.email}
          </a>
        </div>
      );
    },
  },
];
