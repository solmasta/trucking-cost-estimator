import React, { useState, useEffect } from 'react';
import './BillsTracker.css';

const BILLS_KEY = 'trucking-bills';
const emptyBill = { name: '', category: 'Truck Payment', amount: '', dueDate: '', frequency: 'monthly' };
const CATEGORIES = ['Truck Payment', 'Insurance', 'Maintenance', 'Permits', 'Other'];
const FREQUENCIES = [
  { value: 'once', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
];

const addInterval = (dateStr, frequency) => {
  const date = new Date(dateStr);
  if (frequency === 'weekly') date.setDate(date.getDate() + 7);
  else if (frequency === 'biweekly') date.setDate(date.getDate() + 14);
  else if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const BillsTracker = () => {
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem(BILLS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState(emptyBill);

  useEffect(() => {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }, [bills]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name || !form.amount || !form.dueDate) return;
    const bill = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      amount: parseFloat(form.amount),
      dueDate: form.dueDate,
      frequency: form.frequency,
    };
    setBills([...bills, bill].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
    setForm(emptyBill);
  };

  const handleDelete = (id) => {
    setBills(bills.filter((b) => b.id !== id));
  };

  const handleMarkPaid = (id) => {
    setBills(
      bills
        .map((b) => {
          if (b.id !== id) return b;
          if (b.frequency === 'once') return null;
          return { ...b, dueDate: addInterval(b.dueDate, b.frequency) };
        })
        .filter(Boolean)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    );
  };

  const today = new Date().toISOString().slice(0, 10);
  const totalMonthly = bills
    .filter((b) => b.frequency === 'monthly')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="card bills-tracker">
      <h2>Bills & Payments</h2>

      <div className="bills-form">
        <input
          type="text"
          name="name"
          placeholder="Bill name (e.g. Truck Payment)"
          value={form.name}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          name="amount"
          placeholder="Amount ($)"
          value={form.amount}
          onChange={handleChange}
        />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        <select name="frequency" value={form.frequency} onChange={handleChange}>
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Add Bill</button>
      </div>

      <div className="bills-summary">
        <span>Recurring monthly total: ${totalMonthly.toFixed(2)}</span>
      </div>

      <div className="bills-list">
        {bills.length === 0 && <p className="empty-state">No bills added yet.</p>}
        {bills.map((bill) => (
          <div key={bill.id} className={`bill-row ${bill.dueDate < today ? 'overdue' : ''}`}>
            <div className="bill-info">
              <strong>{bill.name}</strong>
              <span className="bill-category">{bill.category}</span>
              <span>Due: {bill.dueDate}</span>
              <span>${bill.amount.toFixed(2)} · {FREQUENCIES.find(f => f.value === bill.frequency)?.label}</span>
            </div>
            <div className="bill-actions">
              <button onClick={() => handleMarkPaid(bill.id)}>Mark Paid</button>
              <button className="delete-btn" onClick={() => handleDelete(bill.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsTracker;
