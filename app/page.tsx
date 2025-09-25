"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { SummaryCards } from "@/components/summary-cards"
import { FilterControls } from "@/components/filter-controls"
import { DataManagement } from "@/components/data-management"
import { AdvancedFilters } from "@/components/advanced-filters"
import { FinancialInsights } from "@/components/financial-insights"
import { Plus, DollarSign } from "lucide-react"
import { ExpenseChart } from "@/components/expense-chart"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
  expense: ["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Healthcare", "Other Expense"],
}

export default function ExpenseTracker() {
  const [transactions, setTransactions, isLoading] = useLocalStorage<Transaction[]>("expense-tracker-transactions", [])
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [advancedFilters, setAdvancedFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  })
  const { toast } = useToast()

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
    setShowForm(false)

    toast({
      title: "Transaction added",
      description: `${transaction.type === "income" ? "Income" : "Expense"} of $${transaction.amount} has been recorded.`,
    })
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))

    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed from your records.",
    })
  }

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, "id">) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)))

    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    })
  }

  const handleImport = (importedTransactions: Transaction[]) => {
    setTransactions((prev) => {
      const existingIds = new Set(prev.map((t) => t.id))
      const newTransactions = importedTransactions.filter((t) => !existingIds.has(t.id))
      return [...prev, ...newTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })
  }

  const handleClearAll = () => {
    setTransactions([])
    toast({
      title: "All data cleared",
      description: "All transactions have been permanently deleted.",
    })
  }

  const clearAllFilters = () => {
    setFilterType("all")
    setFilterCategory("all")
    setAdvancedFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      sortBy: "date",
      sortOrder: "desc",
    })
  }

  // Apply all filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      // Basic filters
      const matchesType = filterType === "all" || transaction.type === filterType
      const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

      // Advanced filters
      const matchesSearch =
        !advancedFilters.search || transaction.description.toLowerCase().includes(advancedFilters.search.toLowerCase())

      const matchesDateFrom = !advancedFilters.dateFrom || transaction.date >= advancedFilters.dateFrom
      const matchesDateTo = !advancedFilters.dateTo || transaction.date <= advancedFilters.dateTo

      const matchesAmountMin =
        !advancedFilters.amountMin || transaction.amount >= Number.parseFloat(advancedFilters.amountMin)
      const matchesAmountMax =
        !advancedFilters.amountMax || transaction.amount <= Number.parseFloat(advancedFilters.amountMax)

      return (
        matchesType &&
        matchesCategory &&
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesAmountMin &&
        matchesAmountMax
      )
    })

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (advancedFilters.sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "description":
          comparison = a.description.localeCompare(b.description)
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      }

      return advancedFilters.sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [transactions, filterType, filterCategory, advancedFilters])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filterType !== "all") count++
    if (filterCategory !== "all") count++
    if (advancedFilters.search) count++
    if (advancedFilters.dateFrom) count++
    if (advancedFilters.dateTo) count++
    if (advancedFilters.amountMin) count++
    if (advancedFilters.amountMax) count++
    return count
  }, [filterType, filterCategory, advancedFilters])

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">ExpenseTracker</h1>
              <p className="text-muted-foreground mt-1">Manage your finances with ease</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Summary Cards */}
          <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} netIncome={netIncome} />

          {/* Financial Insights */}
          <FinancialInsights transactions={transactions} />

          {/* Charts */}
          <ExpenseChart transactions={transactions} />

          {/* Data Management */}
          <DataManagement transactions={transactions} onImport={handleImport} onClearAll={handleClearAll} />

          {/* Basic Filter Controls */}
          <FilterControls
            filterType={filterType}
            filterCategory={filterCategory}
            onTypeChange={setFilterType}
            onCategoryChange={setFilterCategory}
            categories={CATEGORIES}
          />

          {/* Advanced Filters */}
          <AdvancedFilters
            onFiltersChange={setAdvancedFilters}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearAllFilters}
          />

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Transactions
                {activeFiltersCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {filteredAndSortedTransactions.length} transaction
                {filteredAndSortedTransactions.length !== 1 ? "s" : ""} found
                {filteredAndSortedTransactions.length !== transactions.length && ` out of ${transactions.length} total`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList
                transactions={filteredAndSortedTransactions}
                onDelete={deleteTransaction}
                onUpdate={updateTransaction}
                categories={CATEGORIES}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} categories={CATEGORIES} />
      )}
    </div>
  )
}
