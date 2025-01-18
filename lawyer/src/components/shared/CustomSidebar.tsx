import { useState } from 'react'
import { User, LogOut, Settings, BarChart2, ChevronLeft, ChevronRight, Users, FileText, UserRoundCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';

interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
}

interface CustomSidebarProps {
    user: UserProfile | null;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ user }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    if (!user) {
        return <div>Loading...</div>; // Handle the case where user is null
    }

    return (
        <SidebarProvider>
            <Sidebar className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                <SidebarHeader className="flex flex-row justify-between items-center p-4">
                    {!isCollapsed && (
                        <img src='/Agreed Wordmark.svg' alt="logo" className='w-32' />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                {!isCollapsed && "Proposed"}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to="/status">
                                <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''}`}>
                                    <BarChart2 className="h-4 w-4 mr-2" />
                                    {!isCollapsed && "Status"}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>


                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center w-full p-4 hover:bg-gray-100 transition-colors">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={'/Agreed Logo.svg'} alt={user?.name} />
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <div className="ml-3 overflow-hidden flex-grow">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </SidebarProvider>
    )
}

export default CustomSidebar

