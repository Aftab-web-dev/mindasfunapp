import Cookies from 'js-cookie'

import { decrypt, encrypt } from './encrypt';

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as any
const USER_KEY = process.env.NEXT_PUBLIC_USER_KEY as any;

type Tuser = {
  id: number,
  userStatus: number,
  employeeId: number,
  branchId: number,
  corpId: number,
  userAccountTypeId: number,
  employeeCode: string,
  allaccess: number,
  employeeName: string,
  userName: string
}

export const getToken = async () => {
  try {
    let encryptedToken

    if (typeof window !== "undefined") {
      encryptedToken = localStorage.getItem(TOKEN_KEY);
    } else {
      const { cookies } = await import("next/headers");

      const cookiesData = await cookies()

      encryptedToken = cookiesData.get(TOKEN_KEY)?.value;
    }

    if (encryptedToken) {
      return decrypt(encryptedToken);
    }

    return null;
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    const encryptedToken = encrypt(token);

    localStorage.setItem(TOKEN_KEY, encryptedToken);
    Cookies.set(TOKEN_KEY, encryptedToken)
  } catch {
    // Handle storage error silently
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Handle storage error silently
  }
};

export const getUser = (): Tuser | null => {
  try {
    const encryptedUser = localStorage.getItem(USER_KEY);

    if (encryptedUser) {
      const decryptedUser = decrypt(encryptedUser);
      const decryptedUserJson: Tuser = JSON.parse(decryptedUser);

      return decryptedUserJson;
    }

    return null;
  } catch {
    return null;
  }
};

export const setUser = (user: any): void => {
  try {
    const encryptedUser = encrypt(JSON.stringify(user));

    localStorage.setItem(USER_KEY, encryptedUser);
  } catch {
    // Handle storage error silently
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Handle storage error silently
  }
};

export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};
