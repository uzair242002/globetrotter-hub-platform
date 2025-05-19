
import React, { useState } from "react";
import { users } from "@/services/mockData";
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

export const UserManagement = () => {
  const [userList, setUserList] = useState<User[]>(users);
  const { toast } = useToast();

  const toggleUserStatus = (userId: string) => {
    setUserList(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );

    const user = userList.find(user => user.id === userId);
    const action = user?.isBlocked ? "unblocked" : "blocked";
    
    toast({
      title: `User ${action}`,
      description: `${user?.name} has been ${action}.`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
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
                  <TableCell>{user.id}</TableCell>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
