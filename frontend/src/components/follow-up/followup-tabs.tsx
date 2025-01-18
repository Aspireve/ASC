import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Priority from "./priority";
import Upcoming from "./upcoming";

const tabItems = [
    "Upcoming",
    "Priority",
];

const FollowupTabs = () => {
    return (
        <Card>
            <CardContent className="pt-4">
                <Tabs defaultValue="Upcoming" className="w-full">
                    <TabsList className="h-auto bg-transparent border-b rounded-none">
                        <div className="relative flex gap-4 overflow-x-auto scrollbar-none">
                            {tabItems.map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={cn(
                                        "relative h-10 rounded-none border-b-2 border-transparent",
                                        "data-[state=active]:border-b-[#5C59E8] data-[state=active]:shadow-none",
                                        "transition-all duration-300",
                                        "px-4 font-medium"
                                    )}
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </div>
                    </TabsList>
                    <TabsContent value="Upcoming">
                        <Upcoming />
                    </TabsContent>
                    <TabsContent value="Priority">
                        <Priority />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default FollowupTabs