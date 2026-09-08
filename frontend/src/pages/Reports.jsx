import { useEffect, useState } from 'react'
import api from '../utils/api'
import { FileDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Reports() {
  const [report, setReport] = useState(null)
  const [period, setPeriod] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const fetchReport = (p) => {
    setLoading(true)
    api.get(`/reports/${p}`)
      .then(res => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReport(period) }, [period])

  const downloadCSV = async () => {
    if (!report) return
    try {
      const res = await api.get(`/reports/${period}/csv`, { responseType: 'text' })
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${period}-report.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV downloaded')
    } catch (error) {
      toast.error('Failed to download CSV')
    }
  }

  const downloadPDF = async () => {
    if (!report) return
    try {
      const res = await api.get(`/reports/${period}/pdf`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `${period}-report.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and analyze your financial reports</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={downloadCSV} className="btn-secondary flex items-center gap-2">
            <FileDown className="w-4 h-4" /> CSV
          </button>
          <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
            <FileDown className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>
      {loading ? <div className="text-center py-12">Loading report...</div> : report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-success-600">${report.totalIncome.toFixed(2)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-danger-600">${report.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className="text-2xl font-bold text-primary-600">${report.netSavings.toFixed(2)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category-wise Spending</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={report.categoryWiseSpending} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="amount" nameKey="category">
                    {report.categoryWiseSpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Spending Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#3b82f6" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topExpenses.map((exp, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{exp.title}</td>
                      <td className="py-3 px-4 text-sm font-medium text-danger-600">${exp.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{exp.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{exp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
