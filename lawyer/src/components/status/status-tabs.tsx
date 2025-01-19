import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Accepted from "./accepted";
import Issues from "./issues";
import Pending from "./pending";

const tabItems = [
    "Pending",
    "Accepted",
    "Issues",
];

const StatusTabs = () => {
    return (
        <Card className="font-dm-sans">
            <CardContent className="pt-4">
                <Tabs defaultValue="Pending" className="w-full">
                    <TabsList className="h-auto bg-[#F9FAFB] rounded-lg p-2 shadow-md"> {/* Added background and padding to TabsList */}
                        <div className="relative flex gap-6 overflow-x-auto scrollbar-none">
                            {tabItems.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={cn(
                                        "relative h-12 flex items-center justify-center rounded-lg px-6 py-2", // Padding and border-radius
                                        "data-[state=active]:bg-[#5C59E8] data-[state=active]:text-white", // Active background color and text color
                                        "transition-all duration-300 ease-in-out",
                                        "hover:bg-[#F1F1FF] hover:text-[#5C59E8] hover:shadow-md", // Hover effects
                                        "border border-transparent", // Ensures no border unless active
                                        "focus:outline-none focus:ring-2 focus:ring-[#5C59E8]" // Focus effects
                                    )}
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </div>
                    </TabsList>
                    <TabsContent value="Pending">
                        <Pending />
                    </TabsContent>
                    <TabsContent value="Accepted">
                        <Accepted />
                    </TabsContent>
                    <TabsContent value="Issues">
                        <Issues />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default StatusTabs;
