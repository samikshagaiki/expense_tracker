import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  netIncome: number
}

export function SummaryCards({ totalIncome, totalExpenses, netIncome }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Income */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">Money coming in</p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground mt-1">Money going out</p>
        </CardContent>
      </Card>

      {/* Net Income */}
      <Card className={`border-l-4 ${netIncome >= 0 ? "border-l-blue-500" : "border-l-orange-500"}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
          <DollarSign className={`h-4 w-4 ${netIncome >= 0 ? "text-blue-500" : "text-orange-500"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-blue-600" : "text-orange-600"}`}>
            {formatCurrency(netIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netIncome >= 0 ? "Positive balance" : "Negative balance"}
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate */}
      <Card
        className={`border-l-4 ${savingsRate >= 20 ? "border-l-emerald-500" : savingsRate >= 10 ? "border-l-yellow-500" : "border-l-red-500"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
          <TrendingUp
            className={`h-4 w-4 ${savingsRate >= 20 ? "text-emerald-500" : savingsRate >= 10 ? "text-yellow-500" : "text-red-500"}`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${savingsRate >= 20 ? "text-emerald-600" : savingsRate >= 10 ? "text-yellow-600" : "text-red-600"}`}
          >
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {savingsRate >= 20 ? "Excellent!" : savingsRate >= 10 ? "Good progress" : "Room to improve"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
