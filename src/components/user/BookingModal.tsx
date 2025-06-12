
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TravelPackage {
  id: number;
  destination: string;
  duration: number;
  price: number;
  description: string;
  images: string[];
  inclusions: string[];
  is_active: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelPackage: TravelPackage;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  travelPackage,
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
      toast({
        title: "Booking Request Submitted! 🎉",
        description: "Your booking is now pending approval from the admin. We'll contact you soon!",
      });
      
      setIsSubmitting(false);
      onClose();
      
      // Reset form
      setTravelDate("");
      setPeople(1);
    }, 1000);
  };

  // Calculate minimum valid date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const totalCost = travelPackage.price * people;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Book Your Adventure
          </DialogTitle>
        </DialogHeader>
        
        {/* Package Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
          <div className="flex items-start gap-4">
            <img
              src={travelPackage.images?.[0] || '/placeholder.svg'}
              alt={travelPackage.destination}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {travelPackage.destination}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {travelPackage.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ₹{travelPackage.price} per person
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="traveler" className="text-sm font-medium">
                Traveler Name
              </Label>
              <Input
                id="traveler"
                value={currentUser?.name || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="people" className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Travelers
              </Label>
              <Input
                id="people"
                type="number"
                min={1}
                max={10}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                required
                className="text-center"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Travel Date
            </Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Please select your preferred departure date
            </p>
          </div>
          
          {/* Cost Breakdown */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-900">Cost Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span>Price per person:</span>
              <span>₹{travelPackage.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Number of travelers:</span>
              <span>{people}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Cost:</span>
              <span className="text-blue-600">₹{totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Inclusions Preview */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">What's Included</h4>
            <div className="flex flex-wrap gap-2">
              {travelPackage.inclusions?.slice(0, 4).map((inclusion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {inclusion}
                </span>
              ))}
              {travelPackage.inclusions?.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{travelPackage.inclusions.length - 4} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting this request, you agree to our terms and conditions. 
          An admin will review and confirm your booking within 24 hours.
        </p>
      </DialogContent>
    </Dialog>
  );
};
