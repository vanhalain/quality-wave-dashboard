
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/auth';
import { BadgeCheck, Edit, Trash, UserPlus } from 'lucide-react';
import { UserEditDialog } from '@/components/users/UserEditDialog';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@acquality.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-04-01T09:30:00Z',
  },
  {
    id: 2,
    name: 'Quality Controller',
    email: 'quality@acquality.com',
    role: 'quality_controller',
    status: 'active',
    lastLogin: '2025-04-01T08:15:00Z',
  },
  {
    id: 3,
    name: 'Team Manager',
    email: 'manager@acquality.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-03-31T16:45:00Z',
  },
  {
    id: 4,
    name: 'Inactive User',
    email: 'inactive@acquality.com',
    role: 'quality_controller',
    status: 'inactive',
    lastLogin: '2025-03-15T11:20:00Z',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [dialogMode, setDialogMode] = useState<'edit' | 'add'>('add');
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'quality_controller':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'quality_controller':
        return 'Quality Controller';
      case 'manager':
        return 'Manager';
      default:
        return role;
    }
  };

  const handleAddUser = () => {
    setCurrentUser(undefined);
    setDialogMode('add');
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (currentUser) {
      setUsers(users.filter(user => user.id !== currentUser.id));
      toast({
        title: "User deleted",
        description: `${currentUser.name} has been removed from the system.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveUser = (userData: any) => {
    if (dialogMode === 'add') {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        lastLogin: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      toast({
        title: "User added",
        description: `${userData.name} has been added to the system.`,
      });
    } else {
      setUsers(users.map(user => user.id === userData.id ? userData : user));
      toast({
        title: "User updated",
        description: `${userData.name}'s information has been updated.`,
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">Users</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="qa-card">
        <div className="overflow-x-auto">
          <table className="qa-table">
            <thead>
              <tr>
                <th className="rounded-tl-md">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td>
                    {user.status === 'active' ? (
                      <div className="flex items-center">
                        <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td>
                    <span className="text-gray-500">{formatDate(user.lastLogin)}</span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserEditDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
        mode={dialogMode}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentUser?.name}'s account and remove all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
