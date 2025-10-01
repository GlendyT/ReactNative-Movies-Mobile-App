import { Account, Client, Databases, ID, Query } from "appwrite";

// Validate environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const ACCOUNT_COLLECTION_ID = process.env.EXPO_PUBLIC_ACCOUNT_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

if (!DATABASE_ID || !COLLECTION_ID || !ACCOUNT_COLLECTION_ID || !PROJECT_ID) {
  throw new Error("Missing Appwrite environment variables. Please check your .env file.");
}

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined
  }
};

export const saveUserCredentials = async (username: string, password: string, token: string, email?: string) => {
  try {
    await database.createDocument(DATABASE_ID, ACCOUNT_COLLECTION_ID, ID.unique(), {
      username,
      password,
      token,
      email: email || `${username}@example.com`, // Default email if not provided
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserCredentials = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, ACCOUNT_COLLECTION_ID, [
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const signIn = async ({ username, password }: SignInParams) => {
  try {
    console.log("Sign in attempt for username:", username);
    console.log("Using DATABASE_ID:", DATABASE_ID);
    console.log("Using ACCOUNT_COLLECTION_ID:", ACCOUNT_COLLECTION_ID);
    
    // First, validate credentials against our custom database
    const result = await database.listDocuments(DATABASE_ID, ACCOUNT_COLLECTION_ID, [
      Query.equal("username", username),
      Query.equal("password", password),
      Query.limit(1)
    ]);

    console.log("Query result:", result);

    if (result.documents.length === 0) {
      throw new Error("Invalid username or password");
    }

    const userDoc = result.documents[0];
    
    console.log("User found:", userDoc);
    
    // If you want to create an Appwrite session, you can use the stored email
    // For now, we'll just return the user document as a successful sign-in
    return {
      userId: userDoc.$id,
      username: userDoc.username,
      token: userDoc.token,
      success: true
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(error.message || error.toString());
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};
