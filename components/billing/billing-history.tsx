"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: "INV001",
    date: "2024-02-01",
    amount: "$9.99",
    status: "paid",
    plan: "Pro Plan",
  },
  {
    id: "INV002",
    date: "2024-01-01",
    amount: "$9.99",
    status: "paid",
    plan: "Pro Plan",
  },
  {
    id: "INV003",
    date: "2023-12-01",
    amount: "$9.99",
    status: "paid",
    plan: "Pro Plan",
  },
];

export function BillingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View your past transactions and invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.plan}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}