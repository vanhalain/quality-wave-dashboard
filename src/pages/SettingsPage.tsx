
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth, User, UserRole } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/language-context';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user, changeUserRole } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: 'admin@acquality.com',
      role: 'admin',
      name: 'Admin User',
      status: 'active',
    },
    {
      id: 2,
      email: 'quality@acquality.com',
      role: 'quality_controller',
      name: 'Quality Controller',
      status: 'active',
    },
    {
      id: 3,
      email: 'manager@acquality.com',
      role: 'manager',
      name: 'Team Manager',
      status: 'active',
    },
  ]);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    if (user?.role !== 'admin') {
      toast({
        variant: "destructive",
        title: t('Permission Denied'),
        description: t('Only administrators can change user roles.'),
      });
      return;
    }

    const result = await changeUserRole(userId, newRole);
    if (result.success) {
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast({
        title: t('Role Updated'),
        description: t('User role has been updated successfully.'),
      });
    } else {
      toast({
        variant: "destructive",
        title: t('Update Failed'),
        description: result.message || t('Failed to update user role.'),
      });
    }
  };

  const isDisabled = user?.role !== 'admin';

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {t('Settings')}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('User Management')}</CardTitle>
          <CardDescription>
            {t('Manage user roles and permissions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">{t('Users')}</TabsTrigger>
              <TabsTrigger value="roles">{t('Roles')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Name')}</TableHead>
                    <TableHead>{t('Email')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                    <TableHead>{t('Role')}</TableHead>
                    <TableHead>{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'outline' : 'secondary'}>
                          {t(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          disabled={isDisabled}
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder={t('Select role')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t('admin')}</SelectItem>
                            <SelectItem value="quality_controller">{t('quality_controller')}</SelectItem>
                            <SelectItem value="manager">{t('manager')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" disabled={isDisabled}>
                          {t('Edit')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {isDisabled && (
                <p className="text-sm text-muted-foreground mt-4">
                  {t('Note: Only administrators can change user roles and edit users.')}
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="roles" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{t('admin')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t('Full access to all features including user management and system configuration.')}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{t('quality_controller')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t('Can create and manage evaluations, view records, and access quality reports.')}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{t('manager')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t('Can view evaluation results, create campaigns, and manage team performance.')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
