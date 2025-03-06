export const env = {
  NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || "",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}; 

// // 型チェック
// const requiredEnvs = [
//   "NEXT_PUBLIC_SUPABASE_URL",
//   "NEXT_PUBLIC_SUPABASE_ANON_KEY",
//   "SUPABASE_SERVICE_ROLE_KEY"
// ] as const;

// for (const key of requiredEnvs) {
//   if (!env[key]) {
//     throw new Error(`${key} is not defined in environment variables`);
//   }
// } 