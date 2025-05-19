
import { User } from "@/context/AuthContext";

export interface TravelPackage {
  id: string;
  destination: string;
  duration: number;
  price: number;
  inclusions: string[];
  description: string;
  images: string[];
  isActive: boolean;
}

export interface Booking {
  id: string;
  packageId: string;
  userId: string;
  userName: string;
  travelDate: string;
  people: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

// Mock travel packages
export const travelPackages: TravelPackage[] = [
  {
    id: "1",
    destination: "Bali, Indonesia",
    duration: 7,
    price: 1299,
    inclusions: ["Hotel", "Breakfast", "Airport Transfer", "Guided Tours"],
    description: "Experience the beautiful beaches, vibrant culture, and lush landscapes of Bali. This package includes stays at premium resorts, traditional Balinese dining experiences, and guided tours to ancient temples.",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800"
    ],
    isActive: true
  },
  {
    id: "2",
    destination: "Paris, France",
    duration: 5,
    price: 1599,
    inclusions: ["Hotel", "Breakfast", "Museum Passes", "Seine River Cruise"],
    description: "Discover the magic of Paris with this comprehensive package. Enjoy luxury accommodations in the heart of the city, skip-the-line passes to major attractions including the Louvre and Eiffel Tower, and a romantic Seine River dinner cruise.",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1541778480-81d3cd7ef10b?auto=format&fit=crop&w=800"
    ],
    isActive: true
  },
  {
    id: "3",
    destination: "Tokyo, Japan",
    duration: 8,
    price: 2100,
    inclusions: ["Hotel", "Breakfast", "Tokyo Metro Pass", "Mt. Fuji Tour"],
    description: "Immerse yourself in the fascinating blend of traditional culture and futuristic innovation that is Tokyo. This package includes accommodations in the vibrant Shinjuku district, guided tours to historic temples and modern attractions, and a day trip to majestic Mt. Fuji.",
    images: [
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800"
    ],
    isActive: true
  },
  {
    id: "4",
    destination: "New York City, USA",
    duration: 4,
    price: 1350,
    inclusions: ["Hotel", "City Pass", "Airport Transfer", "Broadway Show"],
    description: "Experience the energy and excitement of the Big Apple. This package includes a centrally located hotel, tickets to a Broadway show, a hop-on-hop-off bus tour, and admission to top attractions like the Empire State Building and the Statue of Liberty.",
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=800"
    ],
    isActive: true
  },
  {
    id: "5",
    destination: "Santorini, Greece",
    duration: 6,
    price: 1890,
    inclusions: ["Hotel", "Breakfast & Dinner", "Airport Transfer", "Sunset Cruise"],
    description: "Relax in the stunning beauty of Santorini with this premium package. Stay in a cliffside hotel with panoramic views of the Aegean Sea, enjoy local cuisine at authentic Greek tavernas, and experience a magical sunset cruise around the caldera.",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800"
    ],
    isActive: false
  }
];

// Mock bookings
export const bookings: Booking[] = [
  {
    id: "1",
    packageId: "1",
    userId: "2",
    userName: "Regular User",
    travelDate: "2024-06-15",
    people: 2,
    status: "confirmed",
    createdAt: "2024-05-01T14:32:45Z"
  },
  {
    id: "2",
    packageId: "3",
    userId: "2",
    userName: "Regular User",
    travelDate: "2024-07-10",
    people: 1,
    status: "pending",
    createdAt: "2024-05-10T08:12:33Z"
  },
  {
    id: "3",
    packageId: "2",
    userId: "3",
    userName: "Another User",
    travelDate: "2024-06-22",
    people: 3,
    status: "pending",
    createdAt: "2024-05-12T11:45:22Z"
  }
];

// Mock users (extended from AuthContext)
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@travel.com",
    role: "admin",
    isBlocked: false
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@travel.com",
    role: "user",
    isBlocked: false
  },
  {
    id: "3",
    name: "Another User",
    email: "another@travel.com",
    role: "user",
    isBlocked: false
  }
];

// Helper functions
export const getUserBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

export const getTravelPackageById = (id: string): TravelPackage | undefined => {
  return travelPackages.find(pkg => pkg.id === id);
};

export const getActivePackages = (): TravelPackage[] => {
  return travelPackages.filter(pkg => pkg.isActive);
};
