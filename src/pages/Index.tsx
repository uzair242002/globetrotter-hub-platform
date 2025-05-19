
import React, { useEffect } from "react";
import { AuthForms } from "@/components/AuthForms";
import { createInitialUsers } from "@/services/initialSetup";

const Index = () => {
  // Run the initial setup once when the app loads
  useEffect(() => {
    createInitialUsers();
  }, []);

  return (
    <AuthForms />
  );
};

export default Index;
