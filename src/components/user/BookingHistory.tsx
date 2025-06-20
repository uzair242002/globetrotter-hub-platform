
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTravelPackageById } from "@/services/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  package_id: string;
  travel_date: string;
  people: number;
  status: string;
  created_at: string;
}

export const BookingHistory = () => {
  const { currentUser } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchUserBookings();
    }
  }, [currentUser]);

  const fetchUserBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load your bookings.",
          variant: "destructive",
        });
        return;
      }

      setUserBookings(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', currentUser?.id);

      if (error) {
        console.error('Error canceling booking:', error);
        toast({
          title: "Error",
          description: "Failed to cancel booking.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setUserBookings(userBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  if (loading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Booking History</h2>

      {userBookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <p className="text-gray-500">You don't have any bookings yet.</p>
          <p className="text-gray-500 mt-2">Explore our packages and book your next adventure!</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBookings.map((booking) => {
                  const travelPackage = getTravelPackageById(booking.package_id);
                  const totalCost = travelPackage ? travelPackage.price * booking.people : 0;
                  
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {travelPackage ? travelPackage.destination : "Unknown Package"}
                      </TableCell>
                      <TableCell>{new Date(booking.travel_date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.people}</TableCell>
                      <TableCell>₹{totalCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColors[booking.status as keyof typeof statusColors]
                          } font-medium`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.status === "pending" ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            {booking.status === "cancelled"
                              ? "Cancelled"
                              : booking.status === "completed"
                              ? "Completed"
                              : "Confirmed"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
