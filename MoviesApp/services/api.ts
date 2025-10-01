export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  ACCOUNT_ID: process.env.EXPO_PUBLIC_TMDB_ACCOUNT_ID,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchRequestToken = async () => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/authentication/token/new`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get request token: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchSeries = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch movie details");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchWatchList = async (sessionId?: string, accountId?: number) => {
  let endpoint;
  if (sessionId) {
    // Necesitamos obtener el account_id primero si no se proporciona
    if (!accountId) {
      const accountDetails = await fetchAccountDetails(sessionId);
      accountId = accountDetails.id;
    }
    endpoint = `${TMDB_CONFIG.BASE_URL}/account/${accountId}/watchlist/movies?session_id=${sessionId}&language=en-US&page=1&sort_by=created_at.asc`;
  } else {
    endpoint = `${TMDB_CONFIG.BASE_URL}/account/${TMDB_CONFIG.ACCOUNT_ID}/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch watchlist: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results;
};

export const fetchProfile = async (sessionId?: string): Promise<Profile> => {
  let endpoint;
  if (sessionId) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/account?session_id=${sessionId}`;
  } else {
    endpoint = `${TMDB_CONFIG.BASE_URL}/account?api_key=${TMDB_CONFIG.API_KEY}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchFavoriteMovies = async (sessionId?: string, accountId?: number) => {
  try {
    let endpoint;
    if (sessionId) {
      // Necesitamos obtener el account_id primero si no se proporciona
      if (!accountId) {
        const accountDetails = await fetchAccountDetails(sessionId);
        accountId = accountDetails.id;
      }
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${accountId}/favorite/movies?session_id=${sessionId}&language=en-US&page=1&sort_by=created_at.asc`;
    } else {
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${TMDB_CONFIG.ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`;
    }
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Movies error response:', errorText);
      throw new Error(`Failed to fetch favorite movies: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error in fetchFavoriteMovies:', error);
    throw error;
  }
};

export const fetchFavoriteTVShows = async (sessionId?: string, accountId?: number) => {
  try {
    let endpoint;
    if (sessionId) {
      // Necesitamos obtener el account_id primero si no se proporciona
      if (!accountId) {
        const accountDetails = await fetchAccountDetails(sessionId);
        accountId = accountDetails.id;
      }
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${accountId}/favorite/tv?session_id=${sessionId}&language=en-US&page=1&sort_by=created_at.asc`;
    } else {
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${TMDB_CONFIG.ACCOUNT_ID}/favorite/tv?language=en-US&page=1&sort_by=created_at.asc`;
    }
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(
        `Failed to fetch favorite TV shows: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error in fetchFavoriteTVShows:', error);
    throw error;
  }
};

export const fetchTVShowsDetails = async (tvId: string): Promise<TVshows> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/tv/${tvId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch TV show details");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchLists = async (sessionId?: string, accountId?: number) => {
  try {
    let endpoint;
    if (sessionId) {
      // Necesitamos obtener el account_id primero si no se proporciona
      if (!accountId) {
        const accountDetails = await fetchAccountDetails(sessionId);
        accountId = accountDetails.id;
      }
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${accountId}/lists?session_id=${sessionId}&language=en-US&page=1`;
    } else {
      endpoint = `${TMDB_CONFIG.BASE_URL}/account/${TMDB_CONFIG.ACCOUNT_ID}/lists?language=en-US&page=1`;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lists: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Obtiene los ítems (películas/series) de una lista específica por su ID
export const fetchListItems = async (listId: number | string) => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/list/${listId}?language=en-US`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch list items: ${response.statusText}`);
    }
    const data = await response.json();
    return { results: data.items || [] };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Paso 1: Crear un request token
export const createRequestToken = async () => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/authentication/token/new`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create request token: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Paso 2: Validar el request token con credenciales
export const validateTokenWithLogin = async (username: string, password: string, requestToken: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/authentication/token/validate_with_login`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        request_token: requestToken,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || `Failed to validate token: ${response.statusText}`);
  }

  return await response.json();
};

// Paso 3: Crear session ID con el token validado
export const createSessionId = async (requestToken: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/authentication/session/new`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_token: requestToken,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || `Failed to create session: ${response.statusText}`);
  }

  return await response.json();
};

// Función completa de sign in que ejecuta los 3 pasos
export const signInWithTMDB = async (username: string, password: string) => {
  try {
    // Paso 1: Crear request token
    const tokenData = await createRequestToken();
    const requestToken = tokenData.request_token;

    // Paso 2: Validar token con credenciales
    const validatedTokenData = await validateTokenWithLogin(username, password, requestToken);
    
    // Paso 3: Crear session ID
    const sessionData = await createSessionId(validatedTokenData.request_token);
    
    // Obtener detalles de la cuenta con el session ID
    const accountData = await fetchAccountDetails(sessionData.session_id);
    
    return {
      sessionId: sessionData.session_id,
      accountData,
      success: true
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Obtener detalles de la cuenta autenticada
export const fetchAccountDetails = async (sessionId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/account?session_id=${sessionId}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch account details: ${response.statusText}`);
  }

  return await response.json();
};

// Eliminar session (logout)
export const deleteSession = async (sessionId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/authentication/session`,
    {
      method: "DELETE",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.statusText}`);
  }

  return await response.json();
};

// Agregar/remover película de favoritos
export const toggleMovieFavorite = async (sessionId: string, movieId: number, favorite: boolean) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/account/favorite?session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        favorite: favorite,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle movie favorite: ${response.statusText}`);
  }

  return await response.json();
};

// Agregar/remover serie de favoritos
export const toggleTVShowFavorite = async (sessionId: string, tvId: number, favorite: boolean) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/account/favorite?session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "tv",
        media_id: tvId,
        favorite: favorite,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle TV show favorite: ${response.statusText}`);
  }

  return await response.json();
};

// Agregar/remover película de watchlist
export const toggleMovieWatchlist = async (sessionId: string, movieId: number, watchlist: boolean) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/account/watchlist?session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        watchlist: watchlist,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle movie watchlist: ${response.statusText}`);
  }

  return await response.json();
};

// Agregar/remover serie de watchlist
export const toggleTVShowWatchlist = async (sessionId: string, tvId: number, watchlist: boolean) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/account/watchlist?session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        ...TMDB_CONFIG.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "tv",
        media_id: tvId,
        watchlist: watchlist,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle TV show watchlist: ${response.statusText}`);
  }

  return await response.json();
};

