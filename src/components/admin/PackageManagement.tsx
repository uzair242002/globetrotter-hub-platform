
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PackageForm } from "./PackageForm";
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

export const PackageManagement = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Admin fetched packages:", data);
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePackageStatus = async (id: number) => {
    try {
      const packageToUpdate = packages.find(pkg => pkg.id === id);
      if (!packageToUpdate) return;

      const { error } = await supabase
        .from('travel_packages')
        .update({ is_active: !packageToUpdate.is_active })
        .eq('id', id);

      if (error) throw error;

      setPackages(prevPackages =>
        prevPackages.map(pkg =>
          pkg.id === id ? { ...pkg, is_active: !pkg.is_active } : pkg
        )
      );
      
      toast({
        title: "Package status updated",
        description: "The package status has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating package status:', error);
      toast({
        title: "Error",
        description: "Failed to update package status",
        variant: "destructive",
      });
    }
  };

  const handleAddPackage = async (newPackage: Omit<TravelPackage, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .insert([{
          destination: newPackage.destination,
          duration: newPackage.duration,
          price: newPackage.price,
          description: newPackage.description,
          images: newPackage.images,
          inclusions: newPackage.inclusions,
          is_active: newPackage.is_active
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Added new package:", data);
      await fetchPackages(); // Refresh the list
      setShowAddForm(false);
      
      toast({
        title: "Package added",
        description: "New travel package has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding package:', error);
      toast({
        title: "Error",
        description: "Failed to add package",
        variant: "destructive",
      });
    }
  };

  const handleEditPackage = async (updatedPackage: TravelPackage) => {
    try {
      const { error } = await supabase
        .from('travel_packages')
        .update({
          destination: updatedPackage.destination,
          duration: updatedPackage.duration,
          price: updatedPackage.price,
          description: updatedPackage.description,
          images: updatedPackage.images,
          inclusions: updatedPackage.inclusions,
          is_active: updatedPackage.is_active
        })
        .eq('id', updatedPackage.id);

      if (error) throw error;

      await fetchPackages(); // Refresh the list
      setEditingPackage(null);
      
      toast({
        title: "Package updated",
        description: "The travel package has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async (id: number) => {
    try {
      const { error } = await supabase
        .from('travel_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
      
      toast({
        title: "Package deleted",
        description: "The travel package has been removed from the system.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading packages...</div>;
  }

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
                  src={pkg.images[0] || '/placeholder.svg'}
                  alt={pkg.destination}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold">{pkg.destination}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-600">{pkg.duration} days</p>
                <p className="text-lg font-bold">₹{pkg.price}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Active Status</span>
                  <Switch
                    checked={pkg.is_active}
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

      {packages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No packages found. Add your first package to get started!</p>
        </div>
      )}
    </div>
  );
};
