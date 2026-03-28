import Cookies from 'js-cookie'

import { decrypt, encrypt } from './encrypt';

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as any
const USER_KEY = process.env.NEXT_PUBLIC_USER_KEY as any;

// In-memory cache to avoid repeated decrypt calls
let cachedToken: string | null = null;

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
    // Return cached token if available (avoids repeated decrypt)
    if (cachedToken) return cachedToken;

    let encryptedToken

    if (typeof window !== "undefined") {
      encryptedToken = localStorage.getItem(TOKEN_KEY);
    } else {
      const { cookies } = await import("next/headers");

      const cookiesData = await cookies()

      encryptedToken = cookiesData.get(TOKEN_KEY)?.value;
    }

    if (encryptedToken) {
      cachedToken = decrypt(encryptedToken);

      return cachedToken;
    }

    return null;
  } catch (error) {
    console.error('Failed to retrieve token:', error);

    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    cachedToken = token;
    const encryptedToken = encrypt(token);

    localStorage.setItem(TOKEN_KEY, encryptedToken);
    Cookies.set(TOKEN_KEY, encryptedToken, { secure: true, sameSite: 'strict' })
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const removeToken = (): void => {
  try {
    cachedToken = null;
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
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
  } catch (error) {
    console.error('Failed to retrieve user data:', error);

    return null;
  }
};

export const setUser = (user: any): void => {
  try {
    const encryptedUser = encrypt(JSON.stringify(user));

    localStorage.setItem(USER_KEY, encryptedUser);
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};
