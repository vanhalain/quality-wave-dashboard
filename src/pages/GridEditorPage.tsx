
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormBuilder } from '@/components/evaluation/FormBuilder';
import { DragDropFormBuilder } from '@/components/evaluation/DragDropFormBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate } from 'react-router-dom';
import { useGridStore } from '@/lib/evaluation-grids';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function GridEditorPage() {
  const { gridId } = useParams();
  const navigate = useNavigate();
  const { getGrid } = useGridStore();
  const { toast } = useToast();
  const [builderType, setBuilderType] = useState<'basic' | 'dnd'>('dnd');
  
  // Récupérer la grille si on est en mode édition
  const grid = gridId ? getGrid(parseInt(gridId)) : undefined;

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
