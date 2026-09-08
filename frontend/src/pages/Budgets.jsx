import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Plus, Trash2, Edit, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ category: '', amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() })

  const categories = ['Food', 'Shopping', 'Bills', 'Transportation', 'Medical', 'Entertainment', 'Education', 'Other']

  const fetchBudgets = () => {
    setLoading(true)
    api.get('/budgets')
      .then(res => setBudgets(res.data))
      .catch(() => toast.error('Failed to load budgets'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBudgets() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, form)
        toast.success('Budget updated')
      } else {
        await api.post('/budgets', form)
        toast.success('Budget created')
      }
      resetForm()
      fetchBudgets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return
    try {
      await api.delete(`/budgets/${id}`)
      toast.success('Budget deleted')
      fetchBudgets()
    } catch (error) {
      toast.error('Failed to delete budget')
    }
  }

  const handleEdit = (budget) => {
    setEditingId(budget.id)
    setForm({ category: budget.category, amount: budget.amount, month: budget.month, year: budget.year })
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ category: '', amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your monthly budgets</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Budget
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Budget Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="input-field" required />
              <input type="number" placeholder="Month" value={form.month} onChange={e => setForm({...form, month: parseInt(e.target.value) || ''})} className="input-field" min="1" max="12" required />
              <input type="number" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value) || ''})} className="input-field" required />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Budget</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const utilization = budget.utilizationPercentage || 0
          const remaining = (budget.amount || 0) - (budget.spent || 0)
          const isOverBudget = utilization >= 100
          const isNearLimit = utilization >= 80 && utilization < 100
          return (
            <div key={budget.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(budget)} className="p-1 text-primary-600 hover:bg-primary-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(budget.id)} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Budget</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(budget.amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Spent</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(budget.spent || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className={`font-medium flex items-center gap-1 ${remaining < 0 ? 'text-danger-600' : 'text-success-600'}`}>
                    {remaining < 0 ? <TrendingDown className="w-4 h-4" /> : remaining > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    ${Math.abs(remaining).toFixed(2)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Utilization</span>
                    <span className={`font-medium ${isOverBudget ? 'text-danger-600' : isNearLimit ? 'text-warning-600' : 'text-success-600'}`}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-danger-500' : isNearLimit ? 'bg-warning-500' : 'bg-success-500'}`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  {(isNearLimit || isOverBudget) && (
                    <p className={`text-xs mt-1 ${isOverBudget ? 'text-danger-600' : 'text-warning-600'}`}>
                      {isOverBudget ? 'Budget exceeded!' : 'Warning: Approaching budget limit'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {budgets.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">No budgets created yet</div>
        )}
      </div>
    </div>
  )
}
