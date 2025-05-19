
import { supabase } from "@/integrations/supabase/client";

export const createInitialUsers = async () => {
  console.log("Checking for initial users...");
  
  // Check if admin user exists by querying the auth API
  const { data, error: queryError } = await supabase.auth.signInWithPassword({
    email: 'admin@travel.com',
    password: 'password',
  });
  
  // If login successful, sign out immediately to prevent session conflicts
  if (data.user) {
    console.log("Admin user exists, signing out");
    await supabase.auth.signOut();
    return;
  }
  
  console.log("Admin user doesn't exist, creating default users");
  
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
  } finally {
    // Always sign out after creating users
    await supabase.auth.signOut();
  }
};
