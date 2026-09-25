const BASE_URL = 'http://localhost:3000/api/v1/actors';

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

export async function getActors() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

export async function getActorById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function createActor(actorData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actorData),
  });
  return handleResponse(response);
}

export async function updateActor(id, actorData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actorData),
  });
  return handleResponse(response);
}

export async function deleteActor(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
