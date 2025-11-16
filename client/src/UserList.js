import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (search) => {
    setLoading(true);
    const res = await API.getUsers(search);
    if (res.success) setUsers(res.data);
    else alert('Failed to load users');
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchUsers(q);
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    const res = await API.deleteUser(id);
    if (res.success) setUsers(u => u.filter(x => x._id !== id));
    else alert(res.message || 'Delete failed');
  };

  return (
    <div>
      <form onSubmit={onSearch} className="search">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, email, mobile or address" />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setQ(''); fetchUsers(); }}>Clear</button>
      </form>

      <div className="actions">
        <button onClick={() => navigate('/add')}>Add User</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="user-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Mobile</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan="6">No users found</td></tr>}
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>{u.address}</td>
                <td>
                  <Link to={`/edit/${u._id}`}>Edit</Link>
                  <button onClick={() => onDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
