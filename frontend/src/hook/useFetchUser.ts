import { useState, useEffect } from "react";

interface UserToken {
    accessToken: string;
}

interface UserData {
    id: string;
}

interface UserResponse {
    _id: string;
    [key: string]: any; // Add additional properties if needed
}

export const useFetchUser = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);

                const userData: UserData = JSON.parse(
                    localStorage.getItem("userData") || "{}"
                );
                const user_id = userData?.id || null;

                const userToken: UserToken = JSON.parse(
                    localStorage.getItem("usertoken") || "{}"
                );
                const accessToken = userToken?.accessToken || null;

                if (!user_id || !accessToken) {
                    throw new Error("User ID or Access Token is missing");
                }

                const response = await fetch(
                    `https://asc-cuhd.onrender.com/v1/users/${user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user data: ${response.statusText}`
                    );
                }

                const data: UserResponse = await response.json();
                setUser(data);

                localStorage.setItem(
                    "organizationID",
                    JSON.stringify(data._id)
                );
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, error, loading };
};
