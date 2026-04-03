export const loginUser = async (username, password) => {
    const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    return res.json();
};

export const getDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/system`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();   // 🔥 DEBUG SAFE

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON:", text);
      throw new Error("Server returned invalid response");
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to load dashboard");
    }

    return data;

  } catch (err) {
    console.error("Dashboard Error:", err);
    throw err;
  }
};
export const getStorage = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/dashboard/status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
};
