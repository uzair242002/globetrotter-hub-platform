
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BookingForm } from "./BookingForm";
import { PackageDetails } from "./PackageDetails";
import { supabase } from "@/integrations/supabase/client";

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

export const PackageList = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState<number[]>([1, 30]);
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 200000]);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchPackages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('travel_packages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_packages'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchPackages(); // Refetch packages when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched packages:", data);
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = packages;
    console.log("Filtering packages with:", { 
      destinationFilter, 
      durationFilter, 
      priceFilter 
    });

    // Filter by destination
    if (destinationFilter) {
      result = result.filter(pkg =>
        pkg.destination.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    // Filter by duration
    result = result.filter(
      pkg => pkg.duration >= durationFilter[0] && pkg.duration <= durationFilter[1]
    );

    // Filter by price
    result = result.filter(
      pkg => pkg.price >= priceFilter[0] && pkg.price <= priceFilter[1]
    );

    console.log("Filtered results:", result);
    setFilteredPackages(result);
  }, [destinationFilter, durationFilter, priceFilter, packages]);

  const handleViewDetails = (pkg: TravelPackage) => {
    console.log("Viewing details for package:", pkg);
    setSelectedPackage(pkg);
    setShowBookingForm(false);
  };

  const handleBookNow = (pkg: TravelPackage) => {
    console.log("Booking package:", pkg);
    setSelectedPackage(pkg);
    setShowBookingForm(true);
  };

  const handleDurationChange = (value: number[]) => {
    console.log("Duration change:", value);
    setDurationFilter(value);
  };

  const handlePriceChange = (value: number[]) => {
    console.log("Price change:", value);
    setPriceFilter(value);
  };

  if (loading) {
    return <div className="text-center py-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Filter Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Search by location"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Duration (days): {durationFilter[0]} - {durationFilter[1]}</Label>
            <Slider
              value={durationFilter}
              min={1}
              max={30}
              step={1}
              onValueChange={handleDurationChange}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Price Range: ₹{priceFilter[0]} - ₹{priceFilter[1]}</Label>
            <Slider
              value={priceFilter}
              min={0}
              max={200000}
              step={5000}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>
        </div>
      </div>

      {selectedPackage && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          {showBookingForm ? (
            <BookingForm
              travelPackage={selectedPackage}
              onClose={() => setShowBookingForm(false)}
            />
          ) : (
            <PackageDetails
              travelPackage={selectedPackage}
              onBook={() => setShowBookingForm(true)}
              onClose={() => setSelectedPackage(null)}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No packages match your filters. Try adjusting your criteria.</p>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="aspect-video w-full relative">
                <img
                  src={pkg.images[0] || '/placeholder.svg'}
                  alt={pkg.destination}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{pkg.destination}</h3>
                <div className="flex justify-between items-center mt-2 mb-4">
                  <span className="text-gray-600">{pkg.duration} days</span>
                  <span className="text-xl font-bold text-blue-600">₹{pkg.price}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(pkg)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button onClick={() => handleBookNow(pkg)} className="flex-1">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
