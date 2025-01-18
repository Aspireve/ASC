import * as React from 'react';
import CustomSidebar from './CustomSidebar';
import { useEffect, useState } from 'react';
import { useFetchUser } from '@/hook/useFetchUser';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useFetchUser();

    // Extract the part of the URL after the base URL
    const currentPath = window.location.pathname.replace(/^\//, '') || 'Home';

    // Add a state for controlling animation visibility
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100); // Delay for animation
    }, [currentPath]); // Trigger animation on path change

    return (
        <div className="flex h-screen">
            <CustomSidebar user={user} />
            <main className="flex-1 p-4 overflow-auto">
                <h1
                    className={`text-2xl font-bold mb-4 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                        }`}
                >
                    {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
                </h1>
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
