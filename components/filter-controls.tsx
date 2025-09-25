"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

interface FilterControlsProps {
  filterType: "all" | "income" | "expense"
  filterCategory: string
  onTypeChange: (type: "all" | "income" | "expense") => void
  onCategoryChange: (category: string) => void
  categories: {
    income: string[]
    expense: string[]
  }
}

export function FilterControls({
  filterType,
  filterCategory,
  onTypeChange,
  onCategoryChange,
  categories,
}: FilterControlsProps) {
  const allCategories = [...categories.income, ...categories.expense]
  const hasActiveFilters = filterType !== "all" || filterCategory !== "all"

  const clearFilters = () => {
    onTypeChange("all")
    onCategoryChange("all")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Transaction Type Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Transaction Type</label>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("all")}
                className="flex-1"
              >
                All
              </Button>
              <Button
                variant={filterType === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("income")}
                className="flex-1"
              >
                Income
              </Button>
              <Button
                variant={filterType === "expense" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("expense")}
                className="flex-1"
              >
                Expense
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
            <Select value={filterCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
