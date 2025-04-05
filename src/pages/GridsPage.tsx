
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, FileText, Trash } from 'lucide-react';
import { useGridStore, Grid } from '@/lib/evaluation-grids';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/lib/language-context';

export default function GridsPage() {
  const { grids, deleteGrid } = useGridStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGrid, setCurrentGrid] = useState<Grid | undefined>();
  const { language, t } = useLanguage();

  const handleEditGrid = (grid: Grid) => {
    navigate(`/grids/editor/${grid.id}`);
  };

  const handleViewGrid = (grid: Grid) => {
    // Rediriger vers l'éditeur en mode lecture seule au lieu de "/grids/{id}"
    navigate(`/grids/editor/${grid.id}?view=true`);
  };

  const handleDeleteGrid = (grid: Grid) => {
    setCurrentGrid(grid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGrid = () => {
    if (currentGrid) {
      deleteGrid(currentGrid.id);
      toast({
        title: t('Grid deleted'),
        description: `${currentGrid.name} ${t('has been deleted.')}`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateGrid = () => {
    navigate('/grids/editor');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">{t('Evaluation Grids')}</h1>
        <Button onClick={handleCreateGrid}>
          <FileText className="h-4 w-4 mr-2" />
          {t('Create Grid')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grids.map((grid) => (
          <Card key={grid.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{grid.name}</CardTitle>
              <CardDescription className="mt-1">{formatDate(grid.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {grid.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{grid.questions.length} {t('questions')}</span>
                  <span className="font-medium">{t('Last modified')}: {formatDate(grid.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
              <Button variant="ghost" size="sm" onClick={() => handleViewGrid(grid)}>
                <Eye className="h-4 w-4 mr-2" />
                {t('View')}
              </Button>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditGrid(grid)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteGrid(grid)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {grids.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('No grids')}</p>
            <p className="text-muted-foreground mb-4">
              {t('Start by creating your first evaluation grid.')}
            </p>
            <Button onClick={handleCreateGrid}>
              <FileText className="h-4 w-4 mr-2" />
              {t('Create Grid')}
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This action will permanently delete the grid')} "{currentGrid?.name}" {t('and all associated data.')}
              {t('This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGrid} className="bg-destructive text-destructive-foreground">
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
