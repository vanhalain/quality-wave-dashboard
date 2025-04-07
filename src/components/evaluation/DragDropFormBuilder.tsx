
import { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grid, Question, QuestionType, useGridStore } from '@/lib/evaluation-grids';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, GripVertical, FileText, ListChecks, Check, X, Edit, Star, ToggleLeft } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

type SortableQuestionProps = {
  question: Question;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

// Helper pour générer les étoiles pour l'aperçu
const renderStars = (count: number, selectedCount: number) => {
  return Array.from({ length: count }).map((_, i) => (
    <Star 
      key={i}
      className={`h-4 w-4 ${i < selectedCount ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

// Composant pour chaque question avec drag and drop
const SortableQuestion = ({ question, onDelete, onEdit }: SortableQuestionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const renderPreview = () => {
    switch (question.type) {
      case 'text':
        return <Input disabled placeholder="Réponse texte" />;
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup className="flex flex-col gap-2">
            {question.options?.slice(0, 2).map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem disabled value={option.id.toString()} id={`radio-preview-${option.id}`} />
                <Label htmlFor={`radio-preview-${option.id}`}>{option.label}</Label>
              </div>
            ))}
            {question.options && question.options.length > 2 && <div className="text-xs text-muted-foreground">+ autres options</div>}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className="flex flex-col gap-2">
            {question.options?.slice(0, 2).map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox disabled id={`checkbox-preview-${option.id}`} />
                <Label htmlFor={`checkbox-preview-${option.id}`}>{option.label}</Label>
              </div>
            ))}
            {question.options && question.options.length > 2 && <div className="text-xs text-muted-foreground">+ autres options</div>}
          </div>
        );
      case 'slider':
        return (
          <div className="pt-5">
            <Slider disabled defaultValue={[5]} min={0} max={10} step={1} />
          </div>
        );
      case 'toggle':
        return (
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="toggle-preview" disabled />
            <Label htmlFor="toggle-preview">Oui/Non</Label>
          </div>
        );
      case 'rating':
        return (
          <div className="flex items-center space-x-1 pt-2">
            {renderStars(question.maxValue || 5, 3)}
          </div>
        );
    }
  };
  
  const getQuestionTypeIcon = () => {
    switch (question.type) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'select':
        return <ListChecks className="h-4 w-4" />;
      case 'radio':
        return <Check className="h-4 w-4" />;
      case 'checkbox':
        return <Check className="h-4 w-4" />;
      case 'slider':
        return <div className="h-4 w-4">──</div>;
      case 'toggle':
        return <ToggleLeft className="h-4 w-4" />;
      case 'rating':
        return <Star className="h-4 w-4" />;
    }
  };
  
  return (
    <Card ref={setNodeRef} style={style} className="mb-3">
      <CardHeader className="px-4 py-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <div {...attributes} {...listeners} className="cursor-grab mr-2">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-center">
            <span className="bg-muted rounded-md p-1 mr-2">
              {getQuestionTypeIcon()}
            </span>
            <CardTitle className="text-sm font-medium">
              {question.text}
            </CardTitle>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(question.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(question.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        {renderPreview()}
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between text-xs text-muted-foreground border-t">
        <div className="flex items-center">
          <span className="mr-2">{question.type}</span>
          {question.required && <span className="text-destructive">*obligatoire</span>}
        </div>
        {question.options && (
          <span>{question.options.length} option{question.options.length > 1 ? 's' : ''}</span>
        )}
      </CardFooter>
    </Card>
  );
};

export function DragDropFormBuilder() {
  const { grids, addGrid, updateGrid, addQuestionToGrid, deleteQuestion, updateQuestion } = useGridStore();
  const { toast } = useToast();
  
  const [selectedGridId, setSelectedGridId] = useState<number | null>(grids[0]?.id || null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showCreateGrid, setShowCreateGrid] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state for creating a new grid
  const [gridName, setGridName] = useState('');
  const [gridDescription, setGridDescription] = useState('');
  
  // Form state for creating/editing a question
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('text');
  const [options, setOptions] = useState<{ label: string; value: number; id?: number }[]>([
    { label: '', value: 0 }
  ]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(10);
  const [ratingMax, setRatingMax] = useState<number>(5);
  const [required, setRequired] = useState(true);
  
  // Configurez les capteurs pour les interactions de drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedGrid = grids.find(grid => grid.id === selectedGridId);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && selectedGridId) {
      const oldIndex = selectedGrid?.questions.findIndex(q => q.id === active.id);
      const newIndex = selectedGrid?.questions.findIndex(q => q.id === over.id);
      
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex >= 0 && newIndex >= 0) {
        const newQuestions = arrayMove(selectedGrid!.questions, oldIndex, newIndex);
        updateGrid(selectedGridId, { questions: newQuestions });
        
        toast({
          title: "Question réorganisée",
          description: "L'ordre des questions a été mis à jour avec succès."
        });
      }
    }
  };
  
  const handleAddOption = () => {
    setOptions([...options, { label: '', value: 0 }]);
  };

  const handleOptionChange = (index: number, field: 'label' | 'value', value: string | number) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      [field]: field === 'value' ? Number(value) : value 
    };
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreateGrid = () => {
    if (!gridName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la grille est requis",
      });
      return;
    }

    addGrid({
      name: gridName,
      description: gridDescription,
      questions: []
    });

    toast({
      title: "Grille créée",
      description: "La grille d'évaluation a été créée avec succès"
    });

    setGridName('');
    setGridDescription('');
    setShowCreateGrid(false);
  };

  const resetQuestionForm = () => {
    setQuestionText('');
    setQuestionType('text');
    setOptions([{ label: '', value: 0 }]);
    setMinValue(0);
    setMaxValue(10);
    setRatingMax(5);
    setRequired(true);
    setIsEditMode(false);
    setEditingQuestionId(null);
  };

  const handleEditQuestion = (questionId: number) => {
    if (!selectedGridId) return;
    
    const question = selectedGrid?.questions.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionText(question.text);
    setQuestionType(question.type);
    setRequired(question.required);
    
    if (['select', 'radio', 'checkbox'].includes(question.type) && question.options) {
      setOptions([...question.options]);
    } else if (question.type === 'rating' && question.maxValue) {
      setRatingMax(question.maxValue);
    } else {
      setOptions([{ label: '', value: 0 }]);
    }
    
    if (question.type === 'slider') {
      setMinValue(question.minValue || 0);
      setMaxValue(question.maxValue || 10);
    }
    
    setIsEditMode(true);
    setEditingQuestionId(questionId);
    setShowAddQuestion(true);
  };

  const handleSaveQuestion = () => {
    if (!selectedGridId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une grille",
      });
      return;
    }

    if (!questionText) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le texte de la question est requis",
      });
      return;
    }

    let questionOptions;
    if (['select', 'radio', 'checkbox'].includes(questionType)) {
      if (options.some(opt => !opt.label)) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Tous les libellés d'options doivent être remplis",
        });
        return;
      }
      questionOptions = options;
    }

    const questionData = {
      text: questionText,
      type: questionType,
      required,
      ...(questionOptions && { options: questionOptions.map((opt, idx) => ({ ...opt, id: opt.id || idx + 1 })) }),
      ...(questionType === 'slider' && { minValue, maxValue }),
      ...(questionType === 'rating' && { minValue: 0, maxValue: ratingMax }),
      ...(questionType === 'toggle' && { 
        options: [
          { id: 1, label: 'Non', value: 0 },
          { id: 2, label: 'Oui', value: 1 }
        ]
      })
    };

    if (isEditMode && editingQuestionId !== null) {
      // Mode édition - mettre à jour une question existante
      updateQuestion(selectedGridId, editingQuestionId, questionData);
      
      toast({
        title: "Question mise à jour",
        description: "La question a été modifiée avec succès"
      });
    } else {
      // Mode création - ajouter une nouvelle question
      addQuestionToGrid(selectedGridId, questionData);
      
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée à la grille"
      });
    }

    resetQuestionForm();
    setShowAddQuestion(false);
  };

  const handleDeleteButtonClick = (id: number) => {
    setQuestionToDelete(id);
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (questionToDelete !== null && selectedGridId) {
      deleteQuestion(selectedGridId, questionToDelete);
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée de la grille"
      });
      setDeleteAlertOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleCancelQuestionForm = () => {
    resetQuestionForm();
    setShowAddQuestion(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select 
            value={selectedGridId?.toString() || ""} 
            onValueChange={(value) => setSelectedGridId(Number(value))}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Sélectionner une grille" />
            </SelectTrigger>
            <SelectContent>
              {grids.map(grid => (
                <SelectItem key={grid.id} value={grid.id.toString()}>
                  {grid.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowCreateGrid(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle grille
          </Button>
          <Button onClick={() => {
            resetQuestionForm();
            setShowAddQuestion(true);
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une question
          </Button>
        </div>
      </div>
      
      {selectedGrid ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedGrid.name}
              {selectedGrid.description && (
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  {selectedGrid.description}
                </p>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={selectedGrid.questions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedGrid.questions.length > 0 ? (
                  selectedGrid.questions.map(question => (
                    <SortableQuestion 
                      key={question.id} 
                      question={question} 
                      onDelete={handleDeleteButtonClick}
                      onEdit={handleEditQuestion}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      Aucune question dans cette grille. Ajoutez des questions en utilisant le bouton ci-dessus.
                    </p>
                  </div>
                )}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">
              Sélectionnez une grille ou créez-en une nouvelle pour commencer.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Dialog pour la création de grille */}
      {showCreateGrid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Créer une nouvelle grille</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gridName">Nom de la grille</Label>
                <Input 
                  id="gridName" 
                  value={gridName} 
                  onChange={(e) => setGridName(e.target.value)}
                  placeholder="Entrez le nom de la grille" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gridDescription">Description</Label>
                <Textarea 
                  id="gridDescription" 
                  value={gridDescription} 
                  onChange={(e) => setGridDescription(e.target.value)}
                  placeholder="Description de la grille"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateGrid(false)}>Annuler</Button>
              <Button onClick={handleCreateGrid}>Créer la grille</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Dialog pour l'ajout/édition de question */}
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier la question" : "Ajouter une question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question</Label>
              <Input 
                id="questionText" 
                value={questionText} 
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Texte de la question" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionType">Type de question</Label>
              <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de question" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="select">Liste déroulante</SelectItem>
                  <SelectItem value="radio">Boutons radio</SelectItem>
                  <SelectItem value="checkbox">Cases à cocher</SelectItem>
                  <SelectItem value="slider">Curseur</SelectItem>
                  <SelectItem value="toggle">Interrupteur Oui/Non</SelectItem>
                  <SelectItem value="rating">Notation par étoiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {['select', 'radio', 'checkbox'].includes(questionType) && (
              <div className="space-y-3">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={option.label} 
                      onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                      placeholder="Libellé" 
                      className="flex-grow"
                    />
                    <Input 
                      type="number"
                      value={option.value} 
                      onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                      placeholder="Valeur" 
                      className="w-24"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      disabled={options.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddOption} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            )}
            
            {questionType === 'slider' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="minValue">Valeur minimale</Label>
                  <Input 
                    id="minValue"
                    type="number"
                    value={minValue} 
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxValue">Valeur maximale</Label>
                  <Input 
                    id="maxValue"
                    type="number"
                    value={maxValue} 
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            )}
            
            {questionType === 'rating' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ratingMax">Nombre d'étoiles</Label>
                  <Select 
                    value={ratingMax.toString()} 
                    onValueChange={(value) => setRatingMax(parseInt(value))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Nombre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-1 pt-2">
                  {renderStars(ratingMax, Math.ceil(ratingMax / 2))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="required" 
                checked={required} 
                onCheckedChange={(checked) => setRequired(!!checked)} 
              />
              <Label htmlFor="required">Question obligatoire</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelQuestionForm}>Annuler</Button>
            <Button onClick={handleSaveQuestion}>
              {isEditMode ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alert de confirmation de suppression */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette question ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La question sera définitivement supprimée de la grille.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
