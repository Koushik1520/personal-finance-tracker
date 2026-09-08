import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Plus, Search, Trash2, Edit, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', amount: '', source: '', description: '', date: '' })
  const [showFilters, setShowFilters] = useState(false)

  const sources = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other']

  const fetchIncomes = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (source) params.source = source
    api.get('/incomes', { params })
      .then(res => setIncomes(res.data))
      .catch(() => toast.error('Failed to load incomes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchIncomes() }, [search, source])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/incomes/${editingId}`, form)
        toast.success('Income updated')
      } else {
        await api.post('/incomes', form)
        toast.success('Income added')
      }
      resetForm()
      fetchIncomes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (income) => {
    setEditingId(income.id)
    setForm({ title: income.title, amount: income.amount, source: income.source, description: income.description || '', date: income.date })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return
    try {
      await api.delete(`/incomes/${id}`)
      toast.success('Income deleted')
      fetchIncomes()
    } catch (error) {
      toast.error('Failed to delete income')
    }
  }

  const resetForm = () => {
    setForm({ title: '', amount: '', source: '', description: '', date: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const totalAmount = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incomes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your income sources</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Income
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
              <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="input-field" required />
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="input-field" required>
                <option value="">Select Source</option>
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
              <input type="text" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field sm:col-span-2" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Income</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search incomes..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <select value={source} onChange={e => setSource(e.target.value)} className="input-field">
              <option value="">All Sources</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {incomes.length > 0 && (
          <div className="mb-4 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
            <p className="text-2xl font-bold text-success-600">${totalAmount.toFixed(2)}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(income => (
                <tr key={income.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{income.title}</td>
                  <td className="py-3 px-4 text-sm font-medium text-success-600">${parseFloat(income.amount).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{income.source}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{income.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(income)} className="p-1 text-primary-600 hover:bg-primary-50 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(income.id)} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {incomes.length === 0 && (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">No incomes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
