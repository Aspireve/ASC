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
    const currentPath = window.location.pathname.replace(/^\//, '') || 'Home';

    async function fetchUser() {
        try {
            setUser({
                name: (localStorage.getItem("lawyerName") || "John Doe").replace(/"/g, ''),
                email: (localStorage.getItem("lawyerEmail") || "nath@gmaiul.com").replace(/"/g, ''),
                avatarUrl: "https://github.com/shadcn.png" // Default avatar if missing
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
                <h1 className="text-2xl font-bold mb-4">

                    {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}

                </h1>
                <div>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout
