import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Plus, Trash2, Target } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SavingsGoals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '', description: '' })
  const [depositId, setDepositId] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')

  const fetchGoals = () => {
    setLoading(true)
    api.get('/savings-goals')
      .then(res => setGoals(res.data))
      .catch(() => toast.error('Failed to load savings goals'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchGoals() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/savings-goals', form)
      toast.success('Savings goal created')
      resetForm()
      fetchGoals()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/savings-goals/${id}`)
      toast.success('Savings goal deleted')
      fetchGoals()
    } catch (error) {
      toast.error('Failed to delete savings goal')
    }
  }

  const handleDeposit = async () => {
    try {
      await api.post(`/savings-goals/${depositId}/deposit?amount=${depositAmount}`)
      toast.success('Deposit successful!')
      setDepositId(null)
      setDepositAmount('')
      fetchGoals()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed')
    }
  }

  const resetForm = () => {
    setForm({ name: '', targetAmount: '', deadline: '', description: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your financial goals</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Goal
        </button>
      </div>
      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Goal Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
              <input type="number" placeholder="Target Amount" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} className="input-field" required />
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="input-field" required />
              <input type="text" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Create Goal</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target: ${goal.targetAmount.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(goal.id)} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Saved</span>
                <span className="font-medium text-gray-900 dark:text-white">${goal.currentAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-primary-600 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-primary-600">{goal.progressPercentage.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              {depositId === goal.id ? (
                <div className="flex gap-2">
                  <input type="number" placeholder="Amount" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="input-field flex-1" />
                  <button onClick={handleDeposit} className="btn-primary">Deposit</button>
                  <button onClick={() => { setDepositId(null); setDepositAmount('') }} className="btn-secondary">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDepositId(goal.id)} className="btn-secondary w-full text-sm">Add Deposit</button>
              )}
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">No savings goals created yet</div>
        )}
      </div>
    </div>
  )
}
