const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return { success: false, message: `Empty response (status ${res.status})` };
  try {
    return JSON.parse(text);
  } catch (err) {
    return { success: false, message: 'Invalid JSON response from server' };
  }
};

const API = {
  getUsers: async (q) => {
    try {
      const url = q ? `/api/users?q=${encodeURIComponent(q)}` : '/api/users';
      const res = await fetch(url);
      return await safeJson(res);
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  getUser: async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      return await safeJson(res);
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  createUser: async (data) => {
    try {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return await safeJson(res);
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  updateUser: async (id, data) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return await safeJson(res);
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  deleteUser: async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      return await safeJson(res);
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};

export default API;
