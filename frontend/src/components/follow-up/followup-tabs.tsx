import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Priority from "./priority";
import Upcoming from "./upcoming";

const tabItems = ["Upcoming", "Priority"];

const FollowupTabs = () => {
    return (
        <Card>
            <CardContent className="pt-4">
                <Tabs defaultValue="Upcoming" className="w-full">
                    {/* TabsList with background, padding, and rounded corners */}
                    <TabsList className="bg-[#F9FAFB] p-7 rounded-lg shadow-md">
                        <div className="relative flex gap-6 overflow-x-auto scrollbar-none">
                            {tabItems.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={cn(
                                        "relative h-12 flex items-center justify-center rounded-lg px-6 py-2", // Rounded and padded for a polished look
                                        "data-[state=active]:bg-[#5C59E8] data-[state=active]:text-white", // Active tab background and text color
                                        "transition-all duration-300 ease-in-out", // Smooth transitions
                                        "hover:bg-[#E6E8FF] hover:text-[#5C59E8]", // Hover effects
                                        "font-medium text-gray-600 border border-transparent", // Default styles
                                        "focus:outline-none focus:ring-2 focus:ring-[#5C59E8]" // Focus state
                                    )}
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </div>
                    </TabsList>

                    {/* Tab content */}
                    <TabsContent value="Upcoming">
                        <Upcoming />
                    </TabsContent>
                    <TabsContent value="Priority">
                        <Priority />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default FollowupTabs;
