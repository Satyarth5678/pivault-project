const BASE_URL = `${import.meta.env.VITE_API_URL}/api`; // for dev

export const loginUser = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    return res.json();
};

// 🔥 GET DASHBOARD DATA
export const getDashboard = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/system`);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to load dashboard");
    }

    return { data };
};
export const getStorage = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};