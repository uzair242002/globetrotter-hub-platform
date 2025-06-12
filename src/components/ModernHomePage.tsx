
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users, Calendar, Plane, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserDashboard } from "@/components/user/UserDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedPackage {
  id: string;
  destination: string;
  duration: number;
  price: number;
  images: string[];
}

export const ModernHomePage = () => {
  const { currentUser, logout } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);
  const [featuredPackages, setFeaturedPackages] = useState<FeaturedPackage[]>([]);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('id, destination, duration, price, images')
        .eq('is_active', true)
        .limit(3);

      if (error) {
        console.error('Error fetching featured packages:', error);
        return;
      }

      const packages: FeaturedPackage[] = (data || []).map(pkg => ({
        id: pkg.id.toString(),
        destination: pkg.destination,
        duration: pkg.duration,
        price: pkg.price,
        images: pkg.images || []
      }));

      setFeaturedPackages(packages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (showDashboard) {
    if (currentUser?.role === 'admin') {
      return <AdminDashboard />;
    } else {
      return <UserDashboard />;
    }
  }

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Explore Destinations",
      description: "Discover amazing places around the world with our curated travel packages"
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: "Easy Booking",
      description: "Book your dream vacation in just a few clicks with our simple booking system"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Group Travel",
      description: "Perfect for families, friends, and corporate groups with flexible pricing"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Premium Experience",
      description: "Enjoy handpicked accommodations and exclusive experiences"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "4.8", label: "Average Rating" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TravelPro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <>
                  <span className="text-gray-600">Welcome, {currentUser.name}</span>
                  <Button
                    onClick={() => setShowDashboard(true)}
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    {currentUser.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                  </Button>
                </>
              )}
              <Button
                onClick={logout}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Plane className="w-4 h-4 mr-2" />
              Welcome to Your Travel Journey
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Explore the World
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover breathtaking destinations, create unforgettable memories, and embark on adventures 
              that will last a lifetime with our premium travel packages.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
              onClick={() => setShowDashboard(true)}
            >
              {currentUser?.role === 'admin' ? 'Manage Packages' : 'Browse Packages'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      {featuredPackages.length > 0 && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Featured Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our most popular travel packages and start planning your next adventure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video w-full relative">
                    <img
                      src={pkg.images[0] || "/placeholder.svg"}
                      alt={pkg.destination}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-gray-900 hover:bg-gray-100">
                        {pkg.duration} days
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{pkg.destination}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">₹{pkg.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDashboard(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make travel planning effortless with our comprehensive services and 
              commitment to creating extraordinary experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered their perfect getaway with us.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-8 py-3 text-lg"
            onClick={() => setShowDashboard(true)}
          >
            {currentUser?.role === 'admin' ? 'Manage System' : 'Start Exploring'}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold">TravelPro</h3>
              </div>
              <p className="text-gray-400">
                Your trusted partner for unforgettable travel experiences around the globe.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Destinations</li>
                <li className="hover:text-white cursor-pointer transition-colors">Packages</li>
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p className="hover:text-white transition-colors">📧 info@travelpro.com</p>
                <p className="hover:text-white transition-colors">📞 +91 (555) 123-4567</p>
                <p className="hover:text-white transition-colors">📍 123 Travel Street, Mumbai</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
