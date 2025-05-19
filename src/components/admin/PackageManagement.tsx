
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { travelPackages, TravelPackage } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { PackageForm } from "./PackageForm";

export const PackageManagement = () => {
  const [packages, setPackages] = useState<TravelPackage[]>(travelPackages);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const { toast } = useToast();

  const togglePackageStatus = (id: string) => {
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
      )
    );
    
    toast({
      title: "Package status updated",
      description: "The package status has been successfully updated.",
    });
  };

  const handleAddPackage = (newPackage: TravelPackage) => {
    setPackages(prevPackages => [
      ...prevPackages,
      { ...newPackage, id: String(prevPackages.length + 1) }
    ]);
    setShowAddForm(false);
    toast({
      title: "Package added",
      description: "New travel package has been successfully added.",
    });
  };

  const handleEditPackage = (updatedPackage: TravelPackage) => {
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      )
    );
    setEditingPackage(null);
    toast({
      title: "Package updated",
      description: "The travel package has been successfully updated.",
    });
  };

  const handleDeletePackage = (id: string) => {
    setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
    toast({
      title: "Package deleted",
      description: "The travel package has been removed from the system.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Travel Packages</h2>
        <Button onClick={() => setShowAddForm(true)}>Add New Package</Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <PackageForm
              onSubmit={handleAddPackage}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {editingPackage && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">Edit Package</h3>
            <PackageForm
              initialData={editingPackage}
              onSubmit={handleEditPackage}
              onCancel={() => setEditingPackage(null)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-4">
              <div className="aspect-video w-full relative overflow-hidden rounded-md mb-3">
                <img
                  src={pkg.images[0]}
                  alt={pkg.destination}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold">{pkg.destination}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-600">{pkg.duration} days</p>
                <p className="text-lg font-bold">${pkg.price}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Active Status</span>
                  <Switch
                    checked={pkg.isActive}
                    onCheckedChange={() => togglePackageStatus(pkg.id)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPackage(pkg)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
