import * as React from 'react'
import { useEffect, useState } from 'react'
import CustomSidebar from './CustomSidebar'

interface User {
    name: string
    email: string
    avatarUrl: string
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null) // Use state to manage user data

    async function fetchUser() {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const user_id = userData ? userData.id : null;
            const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
            const accessToken = userToken ? userToken.accessToken : null;

            if (!user_id || !accessToken) {
                console.error("User ID or Access Token is missing");
                return;
            }

            const response = await fetch(`http://localhost:5000/v1/users/${user_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem("organizationID", JSON.stringify(data._id));

            // Update the user state
            setUser({
                name: data.name,
                email: data.email,
                avatarUrl: data.avatarUrl || "https://github.com/shadcn.png" // Default avatar if missing
            });

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Pass user data to CustomSidebar */}
            <CustomSidebar user={user} />
            <main className="flex-1 p-4 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">Welcome to Lawyer Side</h1>
                <div>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout
