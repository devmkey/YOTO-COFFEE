const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ── Public ───────────────────────────────────────────────

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function submitContact({ name, email, message }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to register");
  }
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to log in");
  }
  return res.json();
}

// ── User Profile ────────────────────────────────────────

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch profile");
  }
  return res.json();
}

export async function updateProfile(data, token) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update profile");
  }
  return res.json();
}

// ── Admin: Products / Coffee ─────────────────────────────

export async function createProduct(data, token) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create product");
  }
  return res.json();
}

export async function updateProduct(id, data, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update product");
  }
  return res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete product");
  }
  return res.json();
}

// ── Admin: Orders ────────────────────────────────────────

export async function fetchOrders(token) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrder(id, data, token) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update order");
  }
  return res.json();
}

// ── Admin: Reservations ──────────────────────────────────

export async function fetchReservations(token) {
  const res = await fetch(`${API_BASE}/reservations`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch reservations");
  return res.json();
}

export async function updateReservation(id, data, token) {
  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update reservation");
  }
  return res.json();
}

// ── Admin: Users ─────────────────────────────────────────

export async function fetchUsers(token) {
  const res = await fetch(`${API_BASE}/users`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUser(id, data, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update user");
  }
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete user");
  }
  return res.json();
}
