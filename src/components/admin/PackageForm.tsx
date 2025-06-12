
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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

interface PackageFormProps {
  initialData?: TravelPackage;
  onSubmit: (data: TravelPackage | Omit<TravelPackage, 'id'>) => void;
  onCancel: () => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<TravelPackage, 'id'> & { id?: number }>({
    destination: initialData?.destination || "",
    duration: initialData?.duration || 1,
    price: initialData?.price || 0,
    description: initialData?.description || "",
    images: initialData?.images || [],
    inclusions: initialData?.inclusions || [],
    is_active: initialData?.is_active ?? true,
    ...(initialData?.id && { id: initialData.id })
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value,
    }));
  };

  const handleInclusionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inclusionsArray = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, inclusions: inclusionsArray }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const imagesArray = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, images: imagesArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      onSubmit(formData as TravelPackage);
    } else {
      const { id, ...dataWithoutId } = formData;
      onSubmit(dataWithoutId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="City, Country"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="active">Active Status</Label>
          <div className="flex items-center">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
            <Label htmlFor="active" className="ml-2">
              {formData.is_active ? "Active" : "Inactive"}
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the travel package"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inclusions">Inclusions (comma separated)</Label>
        <Textarea
          id="inclusions"
          value={formData.inclusions.join(", ")}
          onChange={handleInclusionsChange}
          placeholder="Hotel, Meals, Transfers, etc."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (comma separated)</Label>
        <Textarea
          id="images"
          value={formData.images.join(", ")}
          onChange={handleImagesChange}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Package" : "Add Package"}
        </Button>
      </div>
    </form>
  );
};
