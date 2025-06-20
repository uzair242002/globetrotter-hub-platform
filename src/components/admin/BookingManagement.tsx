
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  package_id: string;
  travel_date: string;
  people: number;
  status: string;
  created_at: string;
}

export const BookingManagement = () => {
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    
    // Set up real-time subscription for bookings
    const channel = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Real-time booking update:', payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings.",
          variant: "destructive",
        });
        return;
      }

      setBookingList(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = statusFilter === "all"
    ? bookingList
    : bookingList.filter(booking => booking.status === statusFilter);

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        toast({
          title: "Error",
          description: "Failed to update booking status.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setBookingList(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      toast({
        title: "Booking status updated",
        description: `The booking has been ${newStatus}.`,
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

  // Calculate total revenue
  const totalRevenue = filteredBookings.reduce((sum, booking) => {
    const travelPackage = getTravelPackageById(booking.package_id);
    return sum + (travelPackage ? travelPackage.price * booking.people : 0);
  }, 0);

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Bookings</h2>
          <p className="text-lg font-semibold text-green-600 mt-2">
            Total Revenue: ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by status:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>People</TableHead>
                <TableHead className="text-right">Booking Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const travelPackage = getTravelPackageById(booking.package_id);
                  const totalAmount = travelPackage ? travelPackage.price * booking.people : 0;
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id.slice(0, 8)}...</TableCell>
                      <TableCell>{booking.user_name}</TableCell>
                      <TableCell>
                        {travelPackage ? travelPackage.destination : "Unknown Package"}
                      </TableCell>
                      <TableCell>{new Date(booking.travel_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{booking.people}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-lg text-green-600 bg-green-50 px-3 py-1 rounded-md">
                          ₹{totalAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColors[booking.status as keyof typeof statusColors]
                          } font-medium`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "completed")}
                              >
                                Complete
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {(booking.status === "completed" || booking.status === "cancelled") && (
                            <span className="text-sm text-gray-500 italic">No actions available</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
