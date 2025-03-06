import { cookies } from "next/headers";
import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const createClient = async (cookieStorePromise: ReturnType<typeof cookies>) => {
    const cookieStore = await cookieStorePromise;
    return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
    cookies: {
    get(name: string) {
    return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
    try {
    cookieStore.set({ name, value, ...options });
    } catch (error) {}
    },
    remove(name: string, options: CookieOptions) {
    try {
    cookieStore.set({ name, value: "", ...options });
    } catch (error) {}
    },
    },
    }
    );
    };
