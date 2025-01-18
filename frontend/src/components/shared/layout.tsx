import * as React from 'react'
import CustomSidebar from './CustomSidebar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const user = {
        name: "John Doe",
        email: "john@example.com",
        avatarUrl: "https://github.com/shadcn.png", // Replace with actual avatar URL
    }
    return (
        <div className="flex h-screen">
            <CustomSidebar user={user} />
            <main className="flex-1 p-4 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">Welcome to Your App</h1>
                <div>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout