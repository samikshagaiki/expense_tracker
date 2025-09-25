"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

interface DataManagementProps {
  transactions: Transaction[]
  onImport: (transactions: Transaction[]) => void
  onClearAll: () => void
}

export function DataManagement({ transactions, onImport, onClearAll }: DataManagementProps) {
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `expense-tracker-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported successfully",
        description: "Your transaction data has been downloaded as a JSON file.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        // Validate the imported data structure
        if (!Array.isArray(importedData)) {
          throw new Error("Invalid data format: expected an array of transactions")
        }

        // Validate each transaction
        const validTransactions = importedData.filter((transaction) => {
          return (
            transaction &&
            typeof transaction === "object" &&
            typeof transaction.id === "string" &&
            (transaction.type === "income" || transaction.type === "expense") &&
            typeof transaction.amount === "number" &&
            typeof transaction.description === "string" &&
            typeof transaction.category === "string" &&
            typeof transaction.date === "string"
          )
        })

        if (validTransactions.length === 0) {
          throw new Error("No valid transactions found in the imported file")
        }

        onImport(validTransactions)

        toast({
          title: "Data imported successfully",
          description: `Imported ${validTransactions.length} transaction${validTransactions.length !== 1 ? "s" : ""}.`,
        })

        // Reset the input
        event.target.value = ""
      } catch (error) {
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid file format. Please check your JSON file.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
      }
    }

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive",
      })
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>Export, import, or clear your transaction data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Export Data */}
          <div className="space-y-2">
            <Label>Export Data</Label>
            <Button onClick={exportData} variant="outline" className="w-full flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <p className="text-xs text-muted-foreground">Download all your transactions as a JSON file</p>
          </div>

          {/* Import Data */}
          <div className="space-y-2">
            <Label htmlFor="import-file">Import Data</Label>
            <div className="relative">
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {isImporting ? "Importing..." : "Upload a JSON file with transaction data"}
            </p>
          </div>

          {/* Clear All Data */}
          <div className="space-y-2">
            <Label>Clear Data</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Clear All Data
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your transactions. This action cannot be undone. Consider exporting
                    your data first as a backup.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onClearAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground">Permanently delete all transaction data</p>
          </div>
        </div>

        {/* Data Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Transactions:</span>
            <span className="font-medium">{transactions.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Data Size:</span>
            <span className="font-medium">
              {new Blob([JSON.stringify(transactions)]).size < 1024
                ? `${new Blob([JSON.stringify(transactions)]).size} bytes`
                : `${(new Blob([JSON.stringify(transactions)]).size / 1024).toFixed(1)} KB`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
