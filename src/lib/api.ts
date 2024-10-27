export class API {
  public static uploadImage = async (file: File) => {
    const workerAPI = "https://wokerd1-blue-math-ewq.1790414525klz.workers.dev"
    const token = localStorage.getItem('authToken')

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${workerAPI}/api/upload_image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    console.log(data)
    return data.url;
  }
}

export default API
