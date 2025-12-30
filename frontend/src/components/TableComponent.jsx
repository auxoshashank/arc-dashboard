"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

// Reusable Table Component
const TableComponent = ({ columns, data, onAdd, actions }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting Logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6">
      {/* Table Section */}
      <Table className="border border-gray-300 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} onClick={() => requestSort(column.key)} className="cursor-pointer">
                {column.label}
                {sortConfig.key === column.key && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableHead>
            ))}
            {actions && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={rowIndex % 2 !== 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{column.render ? column.render(row) : row[column.key]}</TableCell>
              ))}

              {/* Actions Dropdown */}
              {actions && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {actions.map((action, actionIndex) => (
                        <DropdownMenuItem
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={action.isDanger ? "text-red-500" : ""}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;