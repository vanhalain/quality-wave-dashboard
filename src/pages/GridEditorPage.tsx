
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormBuilder } from '@/components/evaluation/FormBuilder';
import { DragDropFormBuilder } from '@/components/evaluation/DragDropFormBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGridStore } from '@/lib/evaluation-grids';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchGridById } from '@/services/gridService';
import { useLanguage } from '@/lib/language-context';

export default function GridEditorPage() {
  const { gridId } = useParams();
  const navigate = useNavigate();
  const { getGrid, updateGrid } = useGridStore();
  const { toast } = useToast();
  const [builderType, setBuilderType] = useState<'basic' | 'dnd'>('dnd');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const isViewMode = searchParams.get('view') === 'true';
  const { t } = useLanguage();
  
  // Récupérer la grille si on est en mode édition
  const localGrid = gridId ? getGrid(parseInt(gridId)) : undefined;
  const [gridData, setGridData] = useState(localGrid);
  
  // États pour l'édition du nom et de la description
  const [gridName, setGridName] = useState(gridData?.name || '');
  const [gridDescription, setGridDescription] = useState(gridData?.description || '');

  useEffect(() => {
    const loadGridData = async () => {
      if (!gridId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Essaie d'abord de charger depuis le store local
        let grid = getGrid(parseInt(gridId));
        
        // Si la grille n'est pas trouvée localement, essaie de la récupérer depuis Supabase
        if (!grid) {
          const supabaseGrid = await fetchGridById(parseInt(gridId));
          if (supabaseGrid) {
            // Convertir le format Supabase en format local si nécessaire
            grid = {
              id: supabaseGrid.id,
              name: supabaseGrid.name,
              description: supabaseGrid.description || '',
              questions: [], // Map questions from sections if needed
              createdAt: supabaseGrid.created_at,
              updatedAt: supabaseGrid.updated_at
            };
          }
        }
        
        if (grid) {
          setGridData(grid);
          setGridName(grid.name);
          setGridDescription(grid.description || '');
        } else {
          // Si aucune grille n'est trouvée, affichez un message d'erreur
          toast({
            variant: "destructive",
            title: t('Error'),
            description: t('The requested grid does not exist'),
          });
          navigate('/grids');
        }
      } catch (error) {
        console.error("Error loading grid:", error);
        toast({
          variant: "destructive",
          title: t('Error'),
          description: t('Failed to load the grid'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGridData();
  }, [gridId, getGrid, navigate, toast, t]);

  // Si on est en mode de chargement, afficher un indicateur
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>{t('Loading')}...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdateGridInfo = () => {
    if (!gridData || !gridId) return;
    
    if (!gridName.trim()) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Grid name cannot be empty'),
      });
      return;
    }
    
    updateGrid(parseInt(gridId), {
      name: gridName,
      description: gridDescription
    });
    
    toast({
      title: t('Grid updated'),
      description: t('Grid information has been updated successfully')
    });
    
    setIsEditingInfo(false);
  };

  const handleSaveAndReturn = () => {
    if (!gridData || !gridId) return;
    
    updateGrid(parseInt(gridId), { 
      updatedAt: new Date().toISOString() 
    });
    
    toast({
      title: t('Grid saved'),
      description: t('Grid has been saved successfully')
    });
    
    navigate('/grids');
  };

  return (
    <DashboardLayout>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/grids')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {isViewMode 
            ? `${t('Viewing')}: ${gridData?.name}` 
            : `${t('Editing')}: ${gridData?.name}`}
        </h1>
        
        {!isViewMode && (
          <Button className="ml-auto" onClick={handleSaveAndReturn}>
            <Save className="h-4 w-4 mr-2" />
            {t('Save')}
          </Button>
        )}
      </div>
      
      {gridData && !isViewMode && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              {isEditingInfo ? (
                <div className="flex-1">
                  <Input
                    value={gridName}
                    onChange={(e) => setGridName(e.target.value)}
                    placeholder={t('Grid name')}
                    className="font-semibold text-lg mb-2"
                  />
                  <Textarea
                    value={gridDescription}
                    onChange={(e) => setGridDescription(e.target.value)}
                    placeholder={t('Grid description')}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              ) : (
                <div>
                  <CardTitle>{gridData.name}</CardTitle>
                  <CardDescription>{gridData.description}</CardDescription>
                </div>
              )}
              <div>
                {isEditingInfo ? (
                  <Button onClick={handleUpdateGridInfo}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('Save')}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditingInfo(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('Rename')}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('Grid Editor')}</CardTitle>
          <CardDescription>
            {t('Modify questions and settings of your evaluation grid')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dnd" onValueChange={(value) => setBuilderType(value as 'basic' | 'dnd')}>
            <TabsList className="mb-4">
              <TabsTrigger value="basic">{t('Basic Editor')}</TabsTrigger>
              <TabsTrigger value="dnd">{t('Drag & Drop Editor')}</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <FormBuilder 
                selectedGridId={gridData?.id} 
                readOnly={isViewMode}
                onSaveCallback={handleSaveAndReturn}
              />
            </TabsContent>
            <TabsContent value="dnd">
              <DragDropFormBuilder />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
