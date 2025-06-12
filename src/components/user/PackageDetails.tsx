
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TravelPackage } from "@/services/mockData";

interface PackageDetailsProps {
  travelPackage: TravelPackage;
  onBook: () => void;
  onClose: () => void;
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({
  travelPackage,
  onBook,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">{travelPackage.destination}</h2>
        <Button variant="ghost" onClick={onClose} size="sm">
          &times;
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-md">
            <img
              src={travelPackage.images[0]}
              alt={travelPackage.destination}
              className="object-cover w-full h-full"
            />
          </div>
          
          {travelPackage.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {travelPackage.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={image}
                    alt={`${travelPackage.destination} ${index + 2}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Package Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">{travelPackage.duration} days</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium text-blue-600 text-xl">
                  ₹{travelPackage.price}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{travelPackage.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Inclusions</h3>
            <div className="flex flex-wrap gap-2">
              {travelPackage.inclusions.map((inclusion, index) => (
                <Badge key={index} variant="secondary">
                  {inclusion}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button onClick={onBook} className="w-full mt-4">
            Book This Package
          </Button>
        </div>
      </div>
    </div>
  );
};
