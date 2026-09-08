import { useEffect, useState } from 'react'
import api from '../utils/api'
import { DollarSign, ArrowUpRight, ArrowDownLeft, PieChart, Target, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Wallet } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/expenses', { params: { _limit: 5 } })
        ])
        setSummary(summaryRes.data)
        setRecentTransactions(expensesRes.data.slice(0, 5))
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading dashboard...</div>
  if (!summary) return <div className="flex items-center justify-center min-h-[400px]">Failed to load dashboard</div>

  const budgetRemaining = summary.monthlyBudgetRemaining || 0
  const budgetStatus = budgetRemaining < 0 ? 'exceeded' : budgetRemaining < summary.totalIncome * 0.2 ? 'warning' : 'healthy'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-primary-600 bg-primary-50 dark:bg-primary-900/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(summary.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-success-600 bg-success-50 dark:bg-success-900/30">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(summary.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-danger-600 bg-danger-50 dark:bg-danger-900/30">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(summary.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${budgetStatus === 'exceeded' ? 'text-danger-600 bg-danger-50 dark:bg-danger-900/30' : budgetStatus === 'warning' ? 'text-warning-600 bg-warning-50 dark:bg-warning-900/30' : 'text-success-600 bg-success-50 dark:bg-success-900/30'}`}>
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Remaining</p>
              <p className={`text-xl font-bold ${budgetStatus === 'exceeded' ? 'text-danger-600' : budgetStatus === 'warning' ? 'text-warning-600' : 'text-success-600'}`}>
                ${Math.abs(budgetRemaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-primary-600 bg-primary-50 dark:bg-primary-900/30">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Savings Progress</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{(summary.savingsProgress || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-warning-600 bg-warning-50 dark:bg-warning-900/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Bills</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.upcomingBills || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-success-600 bg-success-50 dark:bg-success-900/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.recentTransactions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie data={summary.categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="amount" nameKey="category">
                {summary.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Expenditure Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent transactions</p>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.category} • {tx.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-danger-600">-${tx.amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
