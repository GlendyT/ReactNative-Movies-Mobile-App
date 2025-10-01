// // Test script para debuggear problemas de TMDB API
// import {
//     createRequestToken,
//     createSessionId,
//     fetchFavoriteMovies,
//     fetchFavoriteTVShows,
//     fetchProfile,
//     validateTokenWithLogin
// } from '@/services/api';

// export const testTMDBAuth = async (username: string, password: string) => {
//   console.log('🧪 Testing TMDB Authentication Flow...');
  
//   try {
//     // Paso 1
//     console.log('Step 1: Creating request token...');
//     const tokenData = await createRequestToken();
//     console.log('✅ Request token created:', tokenData.request_token);
    
//     // Paso 2
//     console.log('Step 2: Validating token with login...');
//     const validatedTokenData = await validateTokenWithLogin(username, password, tokenData.request_token);
//     console.log('✅ Token validated:', validatedTokenData.success);
    
//     // Paso 3
//     console.log('Step 3: Creating session ID...');
//     const sessionData = await createSessionId(validatedTokenData.request_token);
//     console.log('✅ Session created:', sessionData.session_id);
    
//     // Test profile
//     console.log('Step 4: Testing profile fetch...');
//     const profile = await fetchProfile(sessionData.session_id);
//     console.log('✅ Profile fetched:', profile);
    
//     // Test favorite movies
//     console.log('Step 5: Testing favorite movies fetch...');
//     try {
//       const movies = await fetchFavoriteMovies(sessionData.session_id);
//       console.log('✅ Favorite movies:', movies?.length || 0, 'movies');
//     } catch (error) {
//       console.log('❌ Error fetching favorite movies:', error);
//     }
    
//     // Test favorite TV shows
//     console.log('Step 6: Testing favorite TV shows fetch...');
//     try {
//       const tvShows = await fetchFavoriteTVShows(sessionData.session_id);
//       console.log('✅ Favorite TV shows:', tvShows?.length || 0, 'shows');
//     } catch (error) {
//       console.log('❌ Error fetching favorite TV shows:', error);
//     }
    
//     return {
//       success: true,
//       sessionId: sessionData.session_id,
//       profile
//     };
    
//   } catch (error: any) {
//     console.log('❌ Authentication test failed:', error.message);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// export const testSessionId = async (sessionId: string) => {
//   console.log('🧪 Testing existing session ID:', sessionId);
  
//   try {
//     const profile = await fetchProfile(sessionId);
//     console.log('✅ Session is valid, profile:', profile);
//     return { valid: true, profile };
//   } catch (error: any) {
//     console.log('❌ Session is invalid:', error.message);
//     return { valid: false, error: error.message };
//   }
// };

// // Función para ejecutar desde DevTools o console
// export const runTests = () => {
//   console.log('Para probar la autenticación, ejecuta:');
//   console.log('testTMDBAuth("tu_usuario", "tu_contraseña")');
//   console.log('Para probar un sessionId existente:');
//   console.log('testSessionId("tu_session_id")');
// };