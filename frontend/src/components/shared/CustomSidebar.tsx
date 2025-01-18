import { useState } from 'react'
import { User, LogOut, Settings, FileText, BarChart2, Users, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
}

interface CustomSidebarProps {
    user: UserProfile;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ user }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <SidebarProvider>
            <Sidebar className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                <SidebarHeader className="flex flex-row justify-between items-center p-4">
                    {!isCollapsed && (
                        <span className="font-bold text-3xl">Agreed</span>
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
                                {!isCollapsed && "Proposer"}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''}`}>
                                <BarChart2 className="h-4 w-4 mr-2" />
                                {!isCollapsed && "Status"}
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton className={`${isCollapsed ? 'justify-center' : ''}`}>
                                <Users className="h-4 w-4 mr-2" />
                                {!isCollapsed && "Customer"}
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center w-full p-4 hover:bg-gray-100 transition-colors">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <div className="ml-3 overflow-hidden flex-grow">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
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

