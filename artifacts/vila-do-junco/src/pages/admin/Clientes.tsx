import { useState } from "react";
import { useListCustomers, useUpdateCustomer } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ClientesAdmin() {
  const [search, setSearch] = useState("");
  const { data: customers, isLoading } = useListCustomers({ search: search.length > 2 ? search : undefined });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie a base de clientes e histórico.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input 
          placeholder="Buscar clientes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 focus-visible:ring-0 shadow-none"
        />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Localidade</TableHead>
              <TableHead className="text-right">Total Gasto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                </TableRow>
              ))
            ) : customers?.map((customer) => (
              <TableRow key={customer.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.whatsapp || customer.phone || "-"}</TableCell>
                <TableCell>{[customer.city, customer.state].filter(Boolean).join(" - ") || "-"}</TableCell>
                <TableCell className="text-right font-bold text-primary">R$ {(customer.totalSpent || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {!isLoading && customers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
