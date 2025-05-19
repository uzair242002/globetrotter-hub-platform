
import { supabase } from "@/integrations/supabase/client";

export const createInitialUsers = async () => {
  console.log("Checking for initial users...");
  
  try {
    // Check if admin user exists by querying profiles table
    const { data: adminProfile, error: adminProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .maybeSingle();
    
    if (adminProfileError) {
      console.error("Error checking for admin profiles:", adminProfileError);
      return;
    }
    
    // If admin profile exists, return early
    if (adminProfile) {
      console.log("Admin user exists, no need to create default users");
      return;
    }
    
    console.log("Admin user doesn't exist, creating default users");
    
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
    
    if (adminError) {
      console.error('Error creating admin user:', adminError);
    } else {
      console.log('Admin user created successfully');
    }
    
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
    
    if (userError) {
      console.error('Error creating regular user:', userError);
    } else {
      console.log('Regular user created successfully');
    }
    
    // If we successfully created users, we need to create profiles manually
    // since we might be bypassing the trigger due to email confirmation settings
    if (adminData?.user) {
      const { error: adminProfileCreateError } = await supabase
        .from('profiles')
        .insert({
          id: adminData.user.id,
          name: 'Admin User',
          role: 'admin',
          email: 'admin@travel.com'
        });
      
      if (adminProfileCreateError) {
        console.error('Error creating admin profile:', adminProfileCreateError);
      }
    }
    
    if (userData?.user) {
      const { error: userProfileCreateError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          name: 'Regular User',
          role: 'user',
          email: 'user@travel.com'
        });
      
      if (userProfileCreateError) {
        console.error('Error creating user profile:', userProfileCreateError);
      }
    }
    
  } catch (error) {
    console.error('Error creating default users:', error);
  } finally {
    // Always sign out after creating users to avoid any session conflicts
    await supabase.auth.signOut();
  }
};
