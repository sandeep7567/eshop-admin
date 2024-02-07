import { auth } from "@/auth";

export const useAuth = async () => {
  const user = await auth();
  const isAuth = user && user?.user ? true : false;
  const userInfo = user ? user?.user : undefined;
  const userId = user?.user?.id;

  return { isAuth, userInfo, userId }
};