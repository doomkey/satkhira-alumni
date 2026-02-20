"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlumniRecord } from "@/lib/types";
import { Pencil, Trash2, ArrowUpDown, UserPlus } from "lucide-react";

interface AlumniDataTableProps {
  data: AlumniRecord[];
  onEdit?: (alumni: AlumniRecord) => void;
  onDelete?: (alumniId: string) => void;
  onAddNew?: () => void;
  onApprove?: (alumniId: string) => void;
}

export const columns: ColumnDef<AlumniRecord>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "session",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Session
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("session")}</div>
    ),
    size: 100,
  },
  { accessorKey: "faculty", header: "Faculty" },
  { accessorKey: "profession", header: "Profession" },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="hidden sm:table-cell text-xs">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "whatsapp",
    header: "WhatsApp",
    cell: ({ row }) => (
      <div className="hidden lg:table-cell text-xs">
        {row.getValue("whatsapp")}
      </div>
    ),
  },
  {
    accessorKey: "upazilla",
    header: "Upazilla",
    cell: ({ row }) => (
      <div className="hidden lg:table-cell text-xs">
        {row.getValue("upazilla")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const { onEdit, onDelete, onApprove } = table.options.meta as {
        onEdit?: (a: AlumniRecord) => void;
        onDelete?: (id: string) => void;
        onApprove?: (alumniId: string) => void;
      };
      const alumni = row.original;

      return (
        <div className="flex flex-wrap gap-2 justify-end">
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(alumni)}
              aria-label={`Edit ${alumni.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(alumni.id)}
              aria-label={`Delete ${alumni.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onApprove && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(alumni.id)}
              className="w-full sm:w-auto"
            >
              Approve
            </Button>
          )}
        </div>
      );
    },
  },
];

export function AlumniDataTable({
  data,
  onEdit,
  onDelete,
  onAddNew,
  onApprove,
}: AlumniDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      onEdit,
      onDelete,
      onApprove,
    },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between py-4">
        <Input
          placeholder="Filter alumni by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full"
        />
        <Button onClick={onAddNew} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="hidden sm:block rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const alumni = row.original;
            return (
              <div
                key={row.id}
                className="border rounded-lg p-3 bg-white shadow-sm"
              >
                <div className="font-semibold text-lg">{alumni.name}</div>
                <div className="text-sm text-muted-foreground">
                  {alumni.faculty} • {alumni.session}
                </div>
                <div className="mt-2 text-sm">{alumni.profession}</div>
                {alumni.email && <div className="text-sm">{alumni.email}</div>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(alumni)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(alumni.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  )}
                  {onApprove && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onApprove(alumni.id)}
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No results found.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
