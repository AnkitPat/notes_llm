export async function uploadDocument(file: File, email: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:8000/upload?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}
