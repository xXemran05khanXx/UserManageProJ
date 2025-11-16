import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>User Management</h1>
        <nav>
          <Link to="/">User List</Link>
          <Link to="/add">Add User</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/edit/:id" element={<UserForm />} />
        </Routes>
      </main>
    </div>
  );
}
