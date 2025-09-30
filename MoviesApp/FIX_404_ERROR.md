# Solución al Error 404 de TMDB API

## Problema Identificado

**Error:** `Failed to fetch favorite TV shows: 404 - {"success":false,"status_code":34,"status_message":"The resource you requested could not be found."}`

## Causa del Problema

El endpoint para obtener favoritos de TV shows estaba mal construido. Cuando usas `session_id` con TMDB API, el formato correcto debe incluir el `account_id`:

### ❌ Endpoint Incorrecto (que causaba el error 404):
```
/account/favorite/tv?session_id=xyz&language=en-US&page=1
```

### ✅ Endpoint Correcto:
```
/account/{account_id}/favorite/tv?session_id=xyz&language=en-US&page=1
```

## Cambios Realizados

### 1. Actualización del AuthContext
- Agregado `accountId` al contexto de autenticación
- El `accountId` se obtiene del objeto `user.id` cuando se hace login
- Se almacena y restaura desde AsyncStorage

### 2. Funciones de API Corregidas
Las siguientes funciones fueron actualizadas para usar el formato correcto:

- `fetchFavoriteMovies(sessionId, accountId)`
- `fetchFavoriteTVShows(sessionId, accountId)`
- `fetchLists(sessionId, accountId)`
- `fetchWatchList(sessionId, accountId)`

### 3. Componentes Actualizados
Todos los componentes que usan estas funciones fueron actualizados:

- `app/(tabs)/profile.tsx`
- `app/favoritemovies/index.tsx`
- `app/favoritetvshows/index.tsx`
- `app/lists/index.tsx`

## Cómo Funciona Ahora

1. **Login:** Cuando el usuario se autentica, el `accountId` se extrae de `userData.id`
2. **Storage:** El `accountId` se almacena junto con `sessionId` y `user` data
3. **API Calls:** Todas las llamadas a endpoints que requieren autenticación usan tanto `sessionId` como `accountId`
4. **Fallback:** Si no hay `accountId` disponible, las funciones obtienen los detalles de la cuenta automáticamente

## Debugging Mejorado

Se agregaron logs detallados para facilitar el debugging:

```javascript
console.log('Fetching TV shows from:', endpoint);
console.log('Headers:', TMDB_CONFIG.headers);
console.log('Response status:', response.status);
```

## Próximos Pasos

Si aún hay problemas:

1. Verificar que el `sessionId` es válido
2. Verificar que el `accountId` es correcto
3. Revisar que las credenciales de TMDB son correctas
4. Verificar que la API key tiene los permisos necesarios

## Endpoints Corregidos

```javascript
// Películas favoritas
GET /account/{account_id}/favorite/movies?session_id={session_id}

// Series favoritas  
GET /account/{account_id}/favorite/tv?session_id={session_id}

// Listas del usuario
GET /account/{account_id}/lists?session_id={session_id}

// Watchlist
GET /account/{account_id}/watchlist/movies?session_id={session_id}
```

Este cambio debería resolver completamente el error 404 que estabas experimentando.