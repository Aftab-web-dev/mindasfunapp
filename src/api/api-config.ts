import { create } from "axios";

import { baseUrl } from "@/utils/base-url";
import { clearAuthData, getToken } from "@/utils/authStorage";

const axiosConfig = create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
});

axiosConfig.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure POST requests always have a body so the server gets a valid Content-Length
    if (config.method === 'post' && !config.data) {
        config.data = {};
    }

    return config;
});

axiosConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.config?.skipAuthRedirect) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                clearAuthData();
                window.location.href = "/login";
            } else {
                const { redirect } = await import("next/navigation");

                redirect("/login");
            }
        }

        return Promise.reject(error);
    },
);

export default axiosConfig;
