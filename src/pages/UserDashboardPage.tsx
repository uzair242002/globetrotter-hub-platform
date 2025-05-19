
import React, { useEffect } from "react";
import { UserDashboard } from "@/components/user/UserDashboard";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";

const UserDashboardPage = () => {
  // This code will run once when the component mounts
  useEffect(() => {
    const createInitialUsers = async () => {
      // Check if admin user exists by querying the auth API
      const { data, error: queryError } = await supabase.auth.signInWithPassword({
        email: 'admin@travel.com',
        password: 'password',
      });
      
      if (queryError || !data.user) {
        try {
          // Create admin user
          const { data: adminData, error: adminError } = await supabase.auth.signUp({
            email: 'admin@travel.com',
            password: 'password',
            options: {
              data: {
                name: 'Admin User',
                role: 'admin'
              }
            }
          });
          
          if (adminError) console.error('Error creating admin user:', adminError);
          else console.log('Admin user created successfully');
          
          // Create regular user
          const { data: userData, error: userError } = await supabase.auth.signUp({
            email: 'user@travel.com',
            password: 'password',
            options: {
              data: {
                name: 'Regular User',
                role: 'user'
              }
            }
          });
          
          if (userError) console.error('Error creating regular user:', userError);
          else console.log('Regular user created successfully');
        } catch (error) {
          console.error('Error creating default users:', error);
        }
      }
      
      // Sign out after checking/creating users to avoid unwanted session
      await supabase.auth.signOut();
    };

    createInitialUsers();
  }, []);

  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboard />
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
