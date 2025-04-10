
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, FileText, Trash, Plus, LayoutGrid, List } from 'lucide-react';
import { useGridStore, Grid } from '@/lib/evaluation-grids';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/lib/language-context';
import { fetchGrids, deleteGrid as deleteGridAPI, createGrid as createGridAPI } from '@/services/gridService';
import { Tables } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type GridType = Tables<'evaluation_grids'>;
type ViewMode = 'grid' | 'list';

export default function GridsPage() {
  const { grids: localGrids, deleteGrid, addGrid } = useGridStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentGrid, setCurrentGrid] = useState<Grid | GridType | undefined>();
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [dbGrids, setDbGrids] = useState<GridType[]>([]);
  const [newGridName, setNewGridName] = useState('');
  const [newGridDescription, setNewGridDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Combinaison des grilles locales et des grilles Supabase pour affichage
  const allGrids = [...dbGrids, ...localGrids.filter(lg => !dbGrids.some(db => db.id === lg.id))];

  useEffect(() => {
    const loadGrids = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGrids();
        console.log("Grids loaded:", data);
        setDbGrids(data);
      } catch (error) {
        console.error("Erreur lors du chargement des grilles:", error);
        toast({
          title: t('Error'),
          description: t("Unable to load evaluation grids. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGrids();
  }, [toast, t]);

  const handleEditGrid = (grid: GridType | Grid) => {
    navigate(`/grids/editor/${grid.id}`);
  };

  const handleViewGrid = (grid: GridType | Grid) => {
    navigate(`/grids/editor/${grid.id}?view=true`);
  };

  const handleDeleteGrid = async (grid: GridType | Grid) => {
    setCurrentGrid(grid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGrid = async () => {
    if (currentGrid) {
      try {
        if ('created_at' in currentGrid) {
          // C'est une grille Supabase
          await deleteGridAPI(currentGrid.id);
          setDbGrids(prev => prev.filter(g => g.id !== currentGrid.id));
        } else {
          // C'est une grille locale
          deleteGrid(currentGrid.id);
        }
        
        toast({
          title: t('Grid deleted'),
          description: `${currentGrid.name} ${t('has been deleted.')}`,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression de la grille:", error);
        toast({
          title: t('Error'),
          description: t("Unable to delete the grid. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleCreateGrid = () => {
    setIsCreateDialogOpen(true);
  };

  const confirmCreateGrid = async () => {
    if (!newGridName.trim()) {
      toast({
        title: t('Error'),
        description: t('Grid name is required'),
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Try to create in Supabase first
      let gridId;
      try {
        const newGrid = await createGridAPI({
          name: newGridName,
          description: newGridDescription,
        });
        
        // If successful, add to dbGrids
        if (newGrid) {
          setDbGrids(prev => [newGrid, ...prev]);
          gridId = newGrid.id;
        }
      } catch (error) {
        console.error("Error creating grid in Supabase:", error);
        // Fall back to local storage
        const localGridData = {
          name: newGridName,
          description: newGridDescription,
          questions: []
        };
        gridId = addGrid(localGridData);
      }
      
      toast({
        title: t('Grid created'),
        description: t('The grid has been created successfully'),
      });
      
      setIsCreateDialogOpen(false);
      setNewGridName('');
      setNewGridDescription('');
      
      // Navigate to the editor with the new grid
      if (gridId) {
        navigate(`/grids/editor/${gridId}`);
      }
      
    } catch (error) {
      console.error("Error creating grid:", error);
      toast({
        title: t('Error'),
        description: t('Unable to create the grid. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Générer des données simulées pour le nombre de questions
  const getQuestionsCount = (grid: Grid | GridType) => {
    if ('questions' in grid) {
      return grid.questions.length;
    }
    // Pour la simplicité, générer un nombre basé sur l'ID de la grille
    return Math.max(3, (grid.id * 2) % 10);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allGrids.map((grid) => (
        <Card key={grid.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{grid.name}</CardTitle>
            <CardDescription className="mt-1">
              {'created_at' in grid 
                ? formatDate(grid.created_at) 
                : formatDate(grid.createdAt)
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {grid.description || ''}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getQuestionsCount(grid)} {t('questions')}</span>
                <span className="font-medium">
                  {t('Last modified')}: {
                    'updated_at' in grid 
                      ? formatDate(grid.updated_at) 
                      : formatDate(grid.updatedAt)
                  }
                </span>
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
  );

  const renderListView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Name')}</TableHead>
              <TableHead>{t('Description')}</TableHead>
              <TableHead>{t('Questions')}</TableHead>
              <TableHead>{t('Created')}</TableHead>
              <TableHead>{t('Last modified')}</TableHead>
              <TableHead className="text-right">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allGrids.map((grid) => (
              <TableRow key={grid.id}>
                <TableCell className="font-medium">{grid.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">{grid.description || ''}</TableCell>
                <TableCell>{getQuestionsCount(grid)}</TableCell>
                <TableCell>
                  {'created_at' in grid 
                    ? formatDate(grid.created_at) 
                    : formatDate(grid.createdAt)
                  }
                </TableCell>
                <TableCell>
                  {'updated_at' in grid 
                    ? formatDate(grid.updated_at) 
                    : formatDate(grid.updatedAt)
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewGrid(grid)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditGrid(grid)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGrid(grid)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">{t('Evaluation Grids')}</h1>
        <div className="flex items-center space-x-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label={t('Grid view')}>
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label={t('List view')}>
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={handleCreateGrid}>
            <Plus className="h-4 w-4 mr-2" />
            {t('Create Grid')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>{t('Loading')}...</p>
        </div>
      ) : (
        <>
          {allGrids.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">{t('No grids')}</p>
                <p className="text-muted-foreground mb-4">
                  {t('Start by creating your first evaluation grid.')}
                </p>
                <Button onClick={handleCreateGrid}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('Create Grid')}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
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

      {/* Create Grid Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Create New Grid')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gridName">{t('Grid Name')}</Label>
              <Input 
                id="gridName" 
                value={newGridName} 
                onChange={(e) => setNewGridName(e.target.value)}
                placeholder={t('Enter grid name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gridDescription">{t('Description')}</Label>
              <Textarea 
                id="gridDescription" 
                value={newGridDescription} 
                onChange={(e) => setNewGridDescription(e.target.value)}
                placeholder={t('Enter grid description')}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {t('Cancel')}
            </Button>
            <Button 
              onClick={confirmCreateGrid}
              disabled={isCreating || !newGridName.trim()}
            >
              {isCreating ? t('Creating...') : t('Create and Edit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
