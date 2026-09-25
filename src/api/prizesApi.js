const BASE_URL = 'http://localhost:3000/api/v1/prizes';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (Array.isArray(errorJson.message)) {
        errorDetail = errorJson.message.join(', ');
      } else if (errorJson.message) {
        errorDetail = errorJson.message;
      }
    } catch {
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export async function createPrize(prizeData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prizeData),
  });
  return handleResponse(response);
}
