import { cookies } from "next/headers";

export const setAuthCookie = async () => {
  const cookieStore = await cookies();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  cookieStore.set("admin_auth", "authenticated", {
    expires: expirationDate,
    secure: true,
    httpOnly: true,
  });
};

export const checkAuthCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "authenticated";
};  