
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageList } from "./PackageList";
import { BookingHistory } from "./BookingHistory";
import { useAuth } from "@/context/AuthContext";

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("packages");
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Travel Dashboard</h1>
        <p className="text-gray-600">Welcome, {currentUser?.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="packages">Travel Packages</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-4">
          <PackageList />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
