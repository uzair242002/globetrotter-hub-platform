
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  role: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !currentStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
        toast({
          title: "Error",
          description: "Failed to update user status",
          variant: "destructive",
        });
        return;
      }

      await fetchUsers();
      toast({
        title: "User status updated",
        description: `User has been ${!currentStatus ? 'blocked' : 'unblocked'}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteUser = async (userId: string, userRole: string) => {
    if (userRole === 'admin') {
      toast({
        title: "Cannot delete admin",
        description: "Admin users cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
        return;
      }

      await fetchUsers();
      toast({
        title: "User deleted",
        description: "User has been successfully deleted",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-gray-600">ID: {user.id}</p>
              <div className="flex justify-between items-center mt-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <Badge variant={user.is_blocked ? 'destructive' : 'default'}>
                  {user.is_blocked ? 'Blocked' : 'Active'}
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Block User</span>
                  <Switch
                    checked={user.is_blocked}
                    onCheckedChange={() => toggleUserStatus(user.id, user.is_blocked)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(user.id, user.role)}
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}
    </div>
  );
};
