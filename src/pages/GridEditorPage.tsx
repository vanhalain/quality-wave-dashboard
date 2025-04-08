
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormBuilder } from '@/components/evaluation/FormBuilder';
import { DragDropFormBuilder } from '@/components/evaluation/DragDropFormBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate } from 'react-router-dom';
import { useGridStore } from '@/lib/evaluation-grids';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function GridEditorPage() {
  const { gridId } = useParams();
  const navigate = useNavigate();
  const { getGrid, updateGrid } = useGridStore();
  const { toast } = useToast();
  const [builderType, setBuilderType] = useState<'basic' | 'dnd'>('dnd');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  // Récupérer la grille si on est en mode édition
  const grid = gridId ? getGrid(parseInt(gridId)) : undefined;
  
  // États pour l'édition du nom et de la description
  const [gridName, setGridName] = useState(grid?.name || '');
  const [gridDescription, setGridDescription] = useState(grid?.description || '');

  // Si on demande une grille qui n'existe pas, on redirige vers la page des grilles
  if (gridId && !grid) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "La grille demandée n'existe pas",
    });
    navigate('/grids');
    return null;
  }

  const handleUpdateGridInfo = () => {
    if (!grid || !gridId) return;
    
    if (!gridName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la grille ne peut pas être vide",
      });
      return;
    }
    
    updateGrid(parseInt(gridId), {
      name: gridName,
      description: gridDescription
    });
    
    toast({
      title: "Grille mise à jour",
      description: "Les informations de la grille ont été mises à jour avec succès"
    });
    
    setIsEditingInfo(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/grids')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {grid ? `Édition: ${grid.name}` : 'Nouvelle grille'}
        </h1>
      </div>
      
      {grid && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              {isEditingInfo ? (
                <div className="flex-1">
                  <Input
                    value={gridName}
                    onChange={(e) => setGridName(e.target.value)}
                    placeholder="Nom de la grille"
                    className="font-semibold text-lg mb-2"
                  />
                  <Textarea
                    value={gridDescription}
                    onChange={(e) => setGridDescription(e.target.value)}
                    placeholder="Description de la grille"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              ) : (
                <div>
                  <CardTitle>{grid.name}</CardTitle>
                  <CardDescription>{grid.description}</CardDescription>
                </div>
              )}
              <div>
                {isEditingInfo ? (
                  <Button onClick={handleUpdateGridInfo}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditingInfo(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Renommer
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Éditeur de grille</CardTitle>
          <CardDescription>
            {grid 
              ? "Modifiez les questions et paramètres de votre grille d'évaluation"
              : "Créez une nouvelle grille d'évaluation en ajoutant des questions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dnd" onValueChange={(value) => setBuilderType(value as 'basic' | 'dnd')}>
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Éditeur simple</TabsTrigger>
              <TabsTrigger value="dnd">Éditeur glisser-déposer</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <FormBuilder selectedGridId={grid?.id} />
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
