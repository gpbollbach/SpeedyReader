import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { db } from "./db";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Offline support for mutations
  if (url === '/api/tests' && method === 'POST') {
    const testData = data as any;
    const id = Math.random().toString(36).substr(2, 9);
    await db.tests.add({ ...testData, id });
  } else if (url === '/api/students' && method === 'POST') {
    const studentData = data as any;
    const id = Math.random().toString(36).substr(2, 9);
    await db.students.add({ ...studentData, id });
  }

  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.warn("Offline: API request failed, but data was saved locally if applicable.", error);
    // Return a fake successful response for local-first UX if it's a POST
    if (method === 'POST') {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    throw error;
  }
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache to IndexedDB
      if (queryKey[0] === '/api/students') {
        await db.students.clear();
        await db.students.bulkAdd(data);
      } else if (queryKey[0] === '/api/tests') {
        await db.tests.clear();
        await db.tests.bulkAdd(data);
      }
      
      return data;
    } catch (error) {
      console.warn("Offline: Fetch failed, using local data", error);
      if (queryKey[0] === '/api/students') {
        return await db.students.toArray() as any;
      } else if (queryKey[0] === '/api/tests') {
        return await db.tests.toArray() as any;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
