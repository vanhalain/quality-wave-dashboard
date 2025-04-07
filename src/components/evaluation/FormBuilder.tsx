import { useState } from 'react';
import { PlusCircle, Trash2, Edit, Grid as GridIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { QuestionType, Question, useGridStore } from '@/lib/evaluation-grids';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FormBuilderProps {
  selectedGridId?: number | null;
  readOnly?: boolean;
  onSubmit?: () => void;
}

export function FormBuilder({ selectedGridId: propSelectedGridId, readOnly = false, onSubmit }: FormBuilderProps = {}) {
  const { gridId } = useParams();
  const navigate = useNavigate();
  
  const initialSelectedGridId = propSelectedGridId || (gridId ? parseInt(gridId) : null) || null;
  
  const { grids, addGrid, addQuestionToGrid, updateQuestion, deleteQuestion } = useGridStore();
  const { toast } = useToast();
  
  const [gridName, setGridName] = useState('');
  const [gridDescription, setGridDescription] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('text');
  const [options, setOptions] = useState<{ label: string; value: number; id?: number }[]>([
    { label: '', value: 0 }
  ]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(10);
  const [required, setRequired] = useState(true);
  const [selectedGridId, setSelectedGridId] = useState<number | null>(initialSelectedGridId);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ratingMax, setRatingMax] = useState<number>(5);

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

    const newGrid = {
      name: gridName,
      description: gridDescription,
      questions: []
    };
    
    addGrid(newGrid);

    toast({
      title: "Grille créée",
      description: "La grille d'évaluation a été créée avec succès"
    });

    setGridName('');
    setGridDescription('');
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
    setIsEditDialogOpen(false);
  };

  const handleEditQuestion = (questionId: number) => {
    if (!selectedGridId) return;
    
    const selectedGrid = grids.find(grid => grid.id === selectedGridId);
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
    setIsEditDialogOpen(true);
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
      updateQuestion(selectedGridId, editingQuestionId, questionData);
      
      toast({
        title: "Question mise à jour",
        description: "La question a été modifiée avec succès"
      });
    } else {
      addQuestionToGrid(selectedGridId, questionData);
      
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée à la grille"
      });
    }

    resetQuestionForm();
  };

  const handleDeleteQuestion = (gridId: number, questionId: number) => {
    deleteQuestion(gridId, questionId);
    toast({
      title: "Question supprimée",
      description: "La question a été supprimée de la grille"
    });
  };

  const handleGoToGrids = () => {
    navigate('/grids');
  };

  const selectedGrid = grids.find(grid => grid.id === selectedGridId);

  const renderStars = (count: number, selectedCount: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star 
        key={i}
        className={`h-5 w-5 ${i < selectedCount ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (readOnly && selectedGrid) {
    return (
      <div className="space-y-4">
        {selectedGrid.questions.map((question) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-2">
            <label className="font-medium">
              {question.text} {question.required && <span className="text-red-500">*</span>}
            </label>
            
            {question.type === 'text' && (
              <Textarea placeholder="Votre réponse" />
            )}
            
            {question.type === 'select' && question.options && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map(option => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {question.type === 'radio' && question.options && (
              <RadioGroup>
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id.toString()} id={`radio-${option.id}`} />
                    <Label htmlFor={`radio-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {question.type === 'checkbox' && question.options && (
              <div className="space-y-2">
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox id={`checkbox-${option.id}`} />
                    <Label htmlFor={`checkbox-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'slider' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{question.minValue}</span>
                  <span>{question.maxValue}</span>
                </div>
                <Slider 
                  defaultValue={[Math.floor((question.minValue! + question.maxValue!) / 2)]} 
                  min={question.minValue} 
                  max={question.maxValue} 
                  step={1}
                />
                <div className="text-center text-sm">
                  Valeur: {Math.floor((question.minValue! + question.maxValue!) / 2)}
                </div>
              </div>
            )}
            
            {question.type === 'toggle' && (
              <div className="flex items-center space-x-2">
                <Switch id={`toggle-${question.id}`} />
                <Label htmlFor={`toggle-${question.id}`}>Oui/Non</Label>
              </div>
            )}
            
            {question.type === 'rating' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  {renderStars(question.maxValue || 5, 0)}
                </div>
                <div className="text-sm text-gray-500">
                  Cliquez sur une étoile pour noter
                </div>
              </div>
            )}
          </div>
        ))}
        
        {onSubmit && (
          <div className="flex justify-end">
            <Button onClick={onSubmit}>
              Soumettre l'évaluation
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <GridIcon className="h-5 w-5 mr-2" />
          {selectedGrid ? selectedGrid.name : 'Sélectionner une grille'}
        </h2>
        <Button variant="outline" size="sm" onClick={handleGoToGrids}>
          Gérer les grilles
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
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
            <Button onClick={handleCreateGrid}>Créer la grille</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter une question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gridSelect">Sélectionner une grille</Label>
              <Select value={selectedGridId?.toString()} onValueChange={(value) => setSelectedGridId(Number(value))}>
                <SelectTrigger>
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
            
            <Button onClick={handleSaveQuestion}>{isEditMode ? "Mettre à jour" : "Ajouter"} la question</Button>
          </CardContent>
        </Card>
      </div>

      {selectedGrid && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu: {selectedGrid.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {selectedGrid.questions.map((question) => (
                <AccordionItem key={question.id} value={`question-${question.id}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex justify-between w-full pr-4">
                      <span>{question.text}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {question.type}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {question.type === 'text' && (
                        <Input placeholder="Votre réponse" />
                      )}
                      
                      {question.type === 'select' && question.options && (
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map(option => (
                              <SelectItem key={option.id} value={option.id.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {question.type === 'radio' && question.options && (
                        <RadioGroup>
                          {question.options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id.toString()} id={`radio-${option.id}`} />
                              <Label htmlFor={`radio-${option.id}`}>{option.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      {question.type === 'checkbox' && question.options && (
                        <div className="space-y-2">
                          {question.options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Checkbox id={`checkbox-${option.id}`} />
                              <Label htmlFor={`checkbox-${option.id}`}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'slider' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{question.minValue}</span>
                            <span>{question.maxValue}</span>
                          </div>
                          <Slider 
                            defaultValue={[Math.floor((question.minValue! + question.maxValue!) / 2)]} 
                            min={question.minValue} 
                            max={question.maxValue} 
                            step={1}
                          />
                          <div className="text-center text-sm">
                            Valeur: {Math.floor((question.minValue! + question.maxValue!) / 2)}
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'toggle' && (
                        <div className="flex items-center space-x-2">
                          <Switch id="toggle-preview" />
                          <Label htmlFor="toggle-preview">Oui/Non</Label>
                        </div>
                      )}
                      
                      {question.type === 'rating' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(question.maxValue || 5, 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Cliquez sur une étoile pour noter
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditQuestion(question.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteQuestion(selectedGrid.id, question.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {selectedGrid.questions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Aucune question dans cette grille. Ajoutez des questions pour construire votre formulaire.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la question</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editQuestionText">Question</Label>
              <Input 
                id="editQuestionText" 
                value={questionText} 
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Texte de la question" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editQuestionType">Type de question</Label>
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
                  <Label htmlFor="editMinValue">Valeur minimale</Label>
                  <Input 
                    id="editMinValue"
                    type="number"
                    value={minValue} 
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="editMaxValue">Valeur maximale</Label>
                  <Input 
                    id="editMaxValue"
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
                  <Label htmlFor="editRatingMax">Nombre d'étoiles</Label>
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
                id="editRequired" 
                checked={required} 
                onCheckedChange={(checked) => setRequired(!!checked)} 
              />
              <Label htmlFor="editRequired">Question obligatoire</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetQuestionForm}>Annuler</Button>
            <Button onClick={handleSaveQuestion}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
