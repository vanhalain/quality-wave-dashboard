
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
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

export function FormBuilder() {
  const { grids, addGrid, addQuestionToGrid, deleteQuestion } = useGridStore();
  const { toast } = useToast();
  
  const [gridName, setGridName] = useState('');
  const [gridDescription, setGridDescription] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('text');
  const [options, setOptions] = useState<{ label: string; value: number }[]>([
    { label: '', value: 0 }
  ]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(10);
  const [required, setRequired] = useState(true);
  const [selectedGridId, setSelectedGridId] = useState<number | null>(grids[0]?.id || null);

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
  };

  const handleAddQuestion = () => {
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

    const newQuestion: Omit<Question, 'id'> = {
      text: questionText,
      type: questionType,
      required,
      ...(questionOptions && { options: questionOptions.map((opt, idx) => ({ ...opt, id: idx + 1 })) }),
      ...(questionType === 'slider' && { minValue, maxValue })
    };

    addQuestionToGrid(selectedGridId, newQuestion);
    
    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée à la grille"
    });

    setQuestionText('');
    setOptions([{ label: '', value: 0 }]);
  };

  const handleDeleteQuestion = (gridId: number, questionId: number) => {
    deleteQuestion(gridId, questionId);
    toast({
      title: "Question supprimée",
      description: "La question a été supprimée de la grille"
    });
  };

  const selectedGrid = grids.find(grid => grid.id === selectedGridId);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Création de grille */}
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

        {/* Création de question */}
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="required" 
                checked={required} 
                onCheckedChange={(checked) => setRequired(!!checked)} 
              />
              <Label htmlFor="required">Question obligatoire</Label>
            </div>
            
            <Button onClick={handleAddQuestion}>Ajouter la question</Button>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu de la grille */}
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
                      {/* Aperçu du champ selon son type */}
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
                                {option.label} ({option.value})
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
                              <Label htmlFor={`radio-${option.id}`}>{option.label} ({option.value})</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      {question.type === 'checkbox' && question.options && (
                        <div className="space-y-2">
                          {question.options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Checkbox id={`checkbox-${option.id}`} />
                              <Label htmlFor={`checkbox-${option.id}`}>{option.label} ({option.value})</Label>
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
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteQuestion(selectedGrid.id, question.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer la question
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
    </div>
  );
}
