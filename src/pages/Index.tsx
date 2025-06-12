
import React, { useEffect } from "react";
import { AuthForms } from "@/components/AuthForms";
import { ModernHomePage } from "@/components/ModernHomePage";
import { createInitialUsers } from "@/services/initialSetup";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  // Run the initial setup once when the app loads
  useEffect(() => {
    createInitialUsers();
  }, []);

  // If user is logged in, show the modern home page
  if (currentUser) {
    return <ModernHomePage />;
  }

  // If not logged in, show auth forms
  return <AuthForms />;
};

export default Index;
