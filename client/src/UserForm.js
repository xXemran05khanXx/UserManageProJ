import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from './api';

export default function UserForm() {
  const { id } = useParams();
  const editMode = !!id;
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode) {
      API.getUser(id).then(res => {
        if (res.success) setForm({ name: res.data.name, email: res.data.email, mobile: res.data.mobile, address: res.data.address });
        else alert('Failed to load user');
      });
    }
  }, [editMode, id]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const action = editMode ? API.updateUser(id, form) : API.createUser(form);
    const res = await action;
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      if (res.errors) setErrors(res.errors);
      else alert(res.message || 'Operation failed');
    }
  };

  return (
    <div className="form-container">
      <h2>{editMode ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={onSubmit} noValidate>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} />
        {errors.name && <div className="error">{errors.name}</div>}

        <label>Email</label>
        <input name="email" value={form.email} onChange={onChange} />
        {errors.email && <div className="error">{errors.email}</div>}

        <label>Mobile</label>
        <input name="mobile" value={form.mobile} onChange={onChange} />
        {errors.mobile && <div className="error">{errors.mobile}</div>}

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={onChange} />
        {errors.address && <div className="error">{errors.address}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
