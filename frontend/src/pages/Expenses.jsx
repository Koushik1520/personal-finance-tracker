import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Plus, Search, Trash2, Edit, Calendar, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', amount: '', category: '', paymentMethod: '', date: '', description: '' })
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['Food', 'Shopping', 'Bills', 'Transportation', 'Medical', 'Entertainment', 'Education', 'Other']
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking']

  const fetchExpenses = () => {
    setLoading(true)
    const params = {}
    if (category) params.category = category
    if (paymentMethod) params.paymentMethod = paymentMethod
    if (search) params.search = search
    api.get('/expenses', { params })
      .then(res => setExpenses(res.data))
      .catch(() => toast.error('Failed to load expenses'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchExpenses() }, [category, paymentMethod, search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, form)
        toast.success('Expense updated')
      } else {
        await api.post('/expenses', form)
        toast.success('Expense added')
      }
      resetForm()
      fetchExpenses()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (expense) => {
    setEditingId(expense.id)
    setForm({ title: expense.title, amount: expense.amount, category: expense.category, paymentMethod: expense.paymentMethod, date: expense.date, description: expense.description || '' })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      toast.success('Expense deleted')
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const resetForm = () => {
    setForm({ title: '', amount: '', category: '', paymentMethod: '', date: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const totalAmount = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your expenses</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
              <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="input-field" required />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="input-field" required>
                <option value="">Select Payment Method</option>
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
              <input type="text" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Expense</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="input-field">
              <option value="">All Payment Methods</option>
              {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-primary-600">${totalAmount.toFixed(2)}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{expense.title}</td>
                  <td className="py-3 px-4 text-sm font-medium text-danger-600">${parseFloat(expense.amount).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{expense.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{expense.paymentMethod}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{expense.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(expense)} className="p-1 text-primary-600 hover:bg-primary-50 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(expense.id)} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">No expenses found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
