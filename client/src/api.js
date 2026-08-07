const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchVideos() {
  const res = await fetch(`${API_BASE}/api/videos`);
  return res.json();
}
export async function fetchVideo(id) {
  const res = await fetch(`${API_BASE}/api/videos/${id}`);
  return res.json();
}
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  return res.json();
}
export async function adminCreateVideo(video, adminPassword) {
  const res = await fetch(`/api/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
    body: JSON.stringify(video)
  });
  return res.json();
}
export async function adminUpdateVideo(id, video, adminPassword) {
  const res = await fetch(`/api/videos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
    body: JSON.stringify(video)
  });
  return res.json();
}
export async function adminDeleteVideo(id, adminPassword) {
  const res = await fetch(`/api/videos/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': adminPassword }
  });
  return res.json();
}
export async function adminCreateCategory(cat, adminPassword) {
  const res = await fetch(`/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
    body: JSON.stringify(cat)
  });
  return res.json();
}
