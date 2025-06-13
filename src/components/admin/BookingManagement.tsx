
import React, { useState } from "react";
import { bookings, Booking, getTravelPackageById } from "@/services/mockData";
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

export const BookingManagement = () => {
  const [bookingList, setBookingList] = useState<Booking[]>(bookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredBookings = statusFilter === "all"
    ? bookingList
    : bookingList.filter(booking => booking.status === statusFilter);

  const updateBookingStatus = (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    setBookingList(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );

    toast({
      title: "Booking status updated",
      description: `The booking has been ${newStatus}.`,
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  // Calculate total revenue
  const totalRevenue = filteredBookings.reduce((sum, booking) => {
    const travelPackage = getTravelPackageById(booking.packageId);
    return sum + (travelPackage ? travelPackage.price * booking.people : 0);
  }, 0);

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
                  const travelPackage = getTravelPackageById(booking.packageId);
                  const totalAmount = travelPackage ? travelPackage.price * booking.people : 0;
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>
                        {travelPackage ? travelPackage.destination : "Unknown Package"}
                      </TableCell>
                      <TableCell>{booking.travelDate}</TableCell>
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
