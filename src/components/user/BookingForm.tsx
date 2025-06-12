
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TravelPackage, bookings } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  travelPackage: TravelPackage;
  onClose: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  travelPackage,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [travelDate, setTravelDate] = useState("");
  const [people, setPeople] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Create a new booking
      const newBooking = {
        id: String(bookings.length + 1),
        packageId: travelPackage.id,
        userId: currentUser?.id || "",
        userName: currentUser?.name || "",
        travelDate,
        people,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };
      
      // Add to bookings (in a real app, this would be an API call)
      bookings.push(newBooking);
      
      toast({
        title: "Booking Request Submitted",
        description: "Your booking is now pending approval from the admin.",
      });
      
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  // Calculate minimum valid date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Book Package: {travelPackage.destination}</h2>
        <Button variant="ghost" onClick={onClose} size="sm">
          &times;
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="package">Package</Label>
          <Input
            id="package"
            value={travelPackage.destination}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price per person</Label>
          <Input
            id="price"
            value={`₹${travelPackage.price}`}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Travel Date</Label>
          <Input
            id="date"
            type="date"
            min={minDate}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="people">Number of People</Label>
          <Input
            id="people"
            type="number"
            min={1}
            max={10}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total">Total Cost</Label>
          <Input
            id="total"
            value={`₹${travelPackage.price * people}`}
            disabled
          />
        </div>
        
        <div className="pt-4 flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
};
