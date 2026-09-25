const BASE_URL = 'http://localhost:3000/api/v1';

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

export async function getMovies() {
  const response = await fetch(`${BASE_URL}/movies`);
  const movies = await handleResponse(response);
  if (!Array.isArray(movies)) return [];

  const moviesWithPrizes = await Promise.all(
    movies.map(async (movie) => {
      if (Array.isArray(movie.prizes) && movie.prizes.length > 0) {
        return movie;
      }
      try {
        const prizesRes = await fetch(`${BASE_URL}/movies/${movie.id}/prizes`);
        const prizes = await handleResponse(prizesRes);
        return { ...movie, prizes: prizes || [] };
      } catch {
        return { ...movie, prizes: [] };
      }
    })
  );

  return moviesWithPrizes;
}

export async function getMovieById(id) {
  const response = await fetch(`${BASE_URL}/movies/${id}`);
  const movie = await handleResponse(response);
  if (!movie) return null;

  if (!Array.isArray(movie.prizes) || movie.prizes.length === 0) {
    try {
      const prizesRes = await fetch(`${BASE_URL}/movies/${id}/prizes`);
      const prizes = await handleResponse(prizesRes);
      movie.prizes = prizes || [];
    } catch {
      movie.prizes = [];
    }
  }

  return movie;
}

export async function createMovie(movieData) {
  const payload = { ...movieData };

  if (!payload.genre || !payload.director || !payload.youtubeTrailer) {
    const [genresRes, directorsRes] = await Promise.all([
      fetch(`${BASE_URL}/genres`),
      fetch(`${BASE_URL}/directors`),
    ]);

    const genres = await handleResponse(genresRes);
    const directors = await handleResponse(directorsRes);

    const trailerRes = await fetch(`${BASE_URL}/youtube-trailers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${payload.title} Trailer`,
        url: 'https://youtube.com',
        duration: payload.duration || 120,
        channel: 'Oficial',
      }),
    });

    const trailer = await handleResponse(trailerRes);

    payload.genre = payload.genre || { id: genres[0].id };
    payload.director = payload.director || { id: directors[0].id };
    payload.youtubeTrailer = payload.youtubeTrailer || { id: trailer.id };
  }

  const response = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function assignMovieToActor(actorId, movieId) {
  const response = await fetch(`${BASE_URL}/actors/${actorId}/movies/${movieId}`, {
    method: 'POST',
  });
  return handleResponse(response);
}

export async function assignPrizeToMovie(movieId, prizeId) {
  const response = await fetch(`${BASE_URL}/movies/${movieId}/prizes/${prizeId}`, {
    method: 'POST',
  });
  return handleResponse(response);
}
