import { useState } from 'react'
import { User, LogOut, Settings, FileText, BarChart2, Users, ChevronLeft, ChevronRight, UserRoundCheck, Rss } from 'lucide-react'
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
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface UserProfile {
    name: string;
    email: string;
    role: string;
}

interface CustomSidebarProps {
    user: Record<string, string> | null;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ user }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation(); // Get the current location

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const navigate = useNavigate()

    const getActiveClass = (path: string) => {
        return location.pathname === path ? 'bg-gary-500 text-black font-extrabold' : ''; // Active class for highlighting
    };

    return (
        <SidebarProvider>
            <Sidebar className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-52'}`}>
                <SidebarHeader className="flex flex-row justify-between items-center p-4">
                    {!isCollapsed && (
                        <img src='/Agreed Wordmark.svg' alt="logo" className='w-32' />
                    )}
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                    </Button>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem className={`${getActiveClass('/proposed')} p-3 rounded-lg `}>
                            <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''} flex items-center space-x-2  rounded-md`}>
                                {!isCollapsed && "Proposed"}
                                <FileText className="h-4  ml-5" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem className={`${getActiveClass('/status')} p-3 rounded-lg `}>
                            <Link to="/status">
                                <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''} flex items-center space-x-2  rounded-md`}>
                                    {!isCollapsed && "Status"}
                                    <BarChart2 className="h-4  ml-9" />
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem className={`${getActiveClass('/customers')} p-3 rounded-lg `}>
                            <Link to="/customers">
                                <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''} flex items-center space-x-2  rounded-md`}>
                                    {!isCollapsed && "Customer"}
                                    <Users className="h-4  ml-4" />
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>


                        <SidebarMenuItem className={`${getActiveClass('/follow-up')} p-3 rounded-lg `}>
                            <Link to="/follow-up">
                                <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''} flex items-center space-x-2  rounded-md`}>
                                    {!isCollapsed && "Follow Up"}
                                    <UserRoundCheck className="h-4  ml-5" />
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem className={`${getActiveClass('/lawyers')} p-3 rounded-lg `}>
                            <Link to="/lawyers">
                                <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''} flex items-center space-x-2  rounded-md`}>
                                    {!isCollapsed && "Lawyer"}
                                    <UserRoundCheck className="h-4  ml-8" />
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
                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/login")}>
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

export default CustomSidebar;
