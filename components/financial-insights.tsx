"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

interface FinancialInsightsProps {
  transactions: Transaction[]
}

export function FinancialInsights({ transactions }: FinancialInsightsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  // Current month data
  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))
  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  // Last month data
  const lastMonthTransactions = transactions.filter((t) => t.date.startsWith(lastMonth))
  const lastMonthIncome = lastMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const lastMonthExpenses = lastMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate trends
  const incomeChange = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0
  const expenseChange =
    lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

  // Top spending categories this month
  const categorySpending = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Financial health indicators
  const savingsRate =
    currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0
  const budgetUtilization = currentMonthIncome > 0 ? (currentMonthExpenses / currentMonthIncome) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Insights
          </CardTitle>
          <CardDescription>No data available for insights</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Add some transactions to see your financial insights</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Financial Insights
        </CardTitle>
        <CardDescription>Your financial health and spending patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Trends */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Income Trend</span>
              <div className="flex items-center gap-1">
                {incomeChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${incomeChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(incomeChange)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentMonthIncome)} this month vs {formatCurrency(lastMonthIncome)} last month
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expense Trend</span>
              <div className="flex items-center gap-1">
                {expenseChange <= 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${expenseChange <= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(expenseChange)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentMonthExpenses)} this month vs {formatCurrency(lastMonthExpenses)} last month
            </p>
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Financial Health</h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Savings Rate</span>
                <div className="flex items-center gap-2">
                  {savingsRate >= 20 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : savingsRate >= 10 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{savingsRate.toFixed(1)}%</span>
                </div>
              </div>
              <Progress value={Math.min(savingsRate, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {savingsRate >= 20
                  ? "Excellent savings rate!"
                  : savingsRate >= 10
                    ? "Good progress"
                    : "Consider saving more"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Budget Utilization</span>
                <div className="flex items-center gap-2">
                  {budgetUtilization <= 80 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : budgetUtilization <= 100 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{budgetUtilization.toFixed(1)}%</span>
                </div>
              </div>
              <Progress value={Math.min(budgetUtilization, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {budgetUtilization <= 80
                  ? "Well within budget"
                  : budgetUtilization <= 100
                    ? "Close to budget limit"
                    : "Over budget"}
              </p>
            </div>
          </div>
        </div>

        {/* Top Spending Categories */}
        {topCategories.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Top Spending Categories This Month</h4>
            <div className="space-y-2">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm">{category}</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
