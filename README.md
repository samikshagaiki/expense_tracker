# 💰 Expense Tracker

A modern, full-featured expense tracking application built with Next.js that helps you manage your personal finances with ease. Track income and expenses, visualize spending patterns, and gain insights into your financial habits.

## ✨ Features

### Core Functionality
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Categorization**: Organize transactions with predefined categories for both income and expenses
- **Real-time Calculations**: Automatic calculation of total income, expenses, and net balance
- **Data Persistence**: Local storage integration to save your data between sessions

### Advanced Features
- **Data Visualization**: Interactive charts showing expense distribution and monthly trends
- **Advanced Filtering**: Filter transactions by type, category, date range, and amount
- **Search Functionality**: Quick search through transaction descriptions
- **Financial Insights**: Trend analysis, savings rate tracking, and spending pattern identification
- **Data Management**: Export/import functionality for data backup and transfer
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Form Validation**: Comprehensive input validation with helpful error messages
- **Confirmation Dialogs**: Safe deletion with confirmation prompts
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth loading indicators for better UX
- **Empty States**: Helpful guidance when no data is available

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <https://github.com/samikshagaiki/expense_tracker>
   cd expense-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage Guide

### Adding Transactions
1. Click the "Add Transaction" button
2. Select transaction type (Income or Expense)
3. Fill in the required fields:
   - Date
   - Description
   - Category
   - Amount
4. Click "Add Transaction" to save

### Managing Transactions
- **Edit**: Click the edit icon on any transaction to modify it
- **Delete**: Click the delete icon and confirm to remove a transaction
- **Filter**: Use the filter controls to narrow down your transaction list
- **Search**: Use the search bar to find specific transactions

### Data Management
- **Export Data**: Click "Export Data" to download your transactions as a JSON file
- **Import Data**: Click "Import Data" to upload a previously exported file
- **Clear All**: Use "Clear All Data" to reset the application (with confirmation)

### Understanding Your Finances
- **Summary Cards**: View your total income, expenses, net balance, and savings rate at a glance
- **Charts**: Analyze your spending patterns with pie charts and trend graphs
- **Insights**: Check the financial insights section for spending trends and recommendations

## 🛠️ Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Local Storage
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

\`\`\`
expense-tracker/
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── advanced-filters.tsx # Advanced filtering component
│   ├── data-management.tsx  # Export/import functionality
│   ├── expense-chart.tsx    # Data visualization charts
│   ├── filter-controls.tsx  # Basic filter controls
│   ├── financial-insights.tsx # Financial analysis component
│   ├── summary-cards.tsx    # Financial summary cards
│   ├── transaction-form.tsx # Add/edit transaction form
│   └── transaction-list.tsx # Transaction display list
├── hooks/
│   └── use-local-storage.ts # Custom hook for local storage
├── lib/
│   └── utils.ts             # Utility functions
└── types/
    └── transaction.ts       # TypeScript type definitions
\`\`\`

## 🎨 Design Features

- **Modern UI**: Clean, professional interface inspired by financial applications
- **Color-coded Categories**: Visual distinction between income and expense categories
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode Ready**: Design tokens prepared for theme switching

## 📊 Data Format

Transactions are stored in the following format:
\`\`\`typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO date string
  createdAt: string; // ISO date string
}
\`\`\`

## 🔧 Customization

### Adding New Categories
Edit the category arrays in `components/transaction-form.tsx`:
\`\`\`typescript
const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];
const expenseCategories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];
\`\`\`

### Modifying Chart Colors
Update the color schemes in `components/expense-chart.tsx` and the design tokens in `app/globals.css`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

**Happy tracking! 💰📈**