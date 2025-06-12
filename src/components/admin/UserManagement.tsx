
import React, { useState, useEffect } from "react";
import { User } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const UserManagement = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          throw error;
        }

        if (profiles) {
          const formattedUsers: User[] = profiles.map((profile) => ({
            id: profile.id,
            name: profile.name || 'Unknown',
            email: profile.email || '',
            role: profile.role as "admin" | "user",
            isBlocked: profile.is_blocked || false
          }));
          setUserList(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Failed to load users",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const toggleUserStatus = async (userId: string) => {
    const user = userList.find(user => user.id === userId);
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !user.isBlocked })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUserList(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );

      const action = user.isBlocked ? "unblocked" : "blocked";
      
      toast({
        title: `User ${action}`,
        description: `${user.name} has been ${action}.`,
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Failed to update user status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    const user = userList.find(user => user.id === userId);
    if (!user) return;
    
    try {
      // First delete the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      // Remove user from local state
      setUserList(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: `${user.name} has been removed from the system.`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userList.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.isBlocked
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm">
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                        <Switch
                          checked={!user.isBlocked}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                          disabled={user.role === "admin"}
                        />
                        
                        {user.role !== "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="ml-2">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteUser(user.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
