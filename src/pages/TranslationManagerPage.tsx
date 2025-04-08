
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage, Language } from '@/lib/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Upload, Plus, Search, Save, X, Check, Edit, FileDown, FileUp } from 'lucide-react';

interface TranslationItem {
  key: string;
  en: string;
  fr: string;
}

export default function TranslationManagerPage() {
  const { t, addTranslation, updateTranslation, getAllTranslations } = useLanguage();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<TranslationItem[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTranslation, setNewTranslation] = useState<TranslationItem>({ key: '', en: '', fr: '' });
  const [editingTranslation, setEditingTranslation] = useState<TranslationItem>({ key: '', en: '', fr: '' });
  
  // Load translations when component mounts
  useEffect(() => {
    const allTranslations = getAllTranslations();
    const translationArray: TranslationItem[] = [];
    
    // Convert the translations object to array format
    Object.keys(allTranslations.en).forEach(key => {
      translationArray.push({
        key,
        en: allTranslations.en[key] || '',
        fr: allTranslations.fr[key] || ''
      });
    });
    
    setTranslations(translationArray);
    setFilteredTranslations(translationArray);
  }, [getAllTranslations]);
  
  // Filter translations when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTranslations(translations);
      return;
    }
    
    const filtered = translations.filter(
      item => 
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.fr.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredTranslations(filtered);
  }, [searchTerm, translations]);
  
  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.en || !newTranslation.fr) {
      toast({
        title: t('Please fill in all fields'),
        variant: "destructive"
      });
      return;
    }
    
    const exists = translations.some(t => t.key === newTranslation.key);
    if (exists) {
      toast({
        title: t('Translation key already exists'),
        variant: "destructive"
      });
      return;
    }
    
    // Add the translation to the context
    addTranslation('en', newTranslation.key, newTranslation.en);
    addTranslation('fr', newTranslation.key, newTranslation.fr);
    
    // Update local state
    const updatedTranslations = [...translations, newTranslation];
    setTranslations(updatedTranslations);
    setFilteredTranslations(updatedTranslations);
    
    // Reset form and close dialog
    setNewTranslation({ key: '', en: '', fr: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: t('Translation added'),
      description: `${newTranslation.key}`,
    });
  };
  
  const handleEditTranslation = () => {
    if (!editingTranslation.key || !editingTranslation.en || !editingTranslation.fr) {
      toast({
        title: t('Please fill in all fields'),
        variant: "destructive"
      });
      return;
    }
    
    // Update the translation in the context
    updateTranslation('en', editingTranslation.key, editingTranslation.en);
    updateTranslation('fr', editingTranslation.key, editingTranslation.fr);
    
    // Update local state
    const updatedTranslations = translations.map(item => 
      item.key === editingTranslation.key ? editingTranslation : item
    );
    setTranslations(updatedTranslations);
    setFilteredTranslations(updatedTranslations);
    
    // Close dialog
    setIsEditDialogOpen(false);
    
    toast({
      title: t('Translation updated'),
      description: `${editingTranslation.key}`,
    });
  };
  
  const handleEditClick = (item: TranslationItem) => {
    setEditingTranslation({ ...item });
    setIsEditDialogOpen(true);
  };
  
  const exportTranslations = () => {
    const allTranslations = getAllTranslations();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allTranslations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "translations.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {t('Translation Manager')}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('Translation Manager')}</CardTitle>
          <CardDescription>
            {t('Manage application translations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('Filter translations')}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={exportTranslations}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('Export Translations')}
                </Button>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('Add Translation')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('Add Translation')}</DialogTitle>
                      <DialogDescription>
                        {t('Add a new translation key and its values')}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="key">{t('Key')}</Label>
                        <Input 
                          id="key" 
                          value={newTranslation.key}
                          onChange={(e) => setNewTranslation({...newTranslation, key: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="en">{t('English')}</Label>
                        <Textarea
                          id="en"
                          value={newTranslation.en}
                          onChange={(e) => setNewTranslation({...newTranslation, en: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="fr">{t('French')}</Label>
                        <Textarea
                          id="fr"
                          value={newTranslation.fr}
                          onChange={(e) => setNewTranslation({...newTranslation, fr: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        {t('Cancel')}
                      </Button>
                      <Button onClick={handleAddTranslation}>
                        {t('Add')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">{t('Key')}</TableHead>
                    <TableHead className="w-[30%]">{t('English')}</TableHead>
                    <TableHead className="w-[30%]">{t('French')}</TableHead>
                    <TableHead className="w-[15%] text-right">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTranslations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <p className="mb-2 text-lg">{t('No results found')}</p>
                          <p className="text-sm">{t('Try a different search term or clear filters')}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTranslations.map((item) => (
                      <TableRow key={item.key}>
                        <TableCell className="font-medium">{item.key}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.en}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.fr}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">{t('Edit')}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Edit Translation Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Edit Translation')}</DialogTitle>
                <DialogDescription>
                  {t('Edit the translation values for this key')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-key">{t('Key')}</Label>
                  <Input 
                    id="edit-key" 
                    value={editingTranslation.key}
                    readOnly
                    disabled
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-en">{t('English')}</Label>
                  <Textarea
                    id="edit-en"
                    value={editingTranslation.en}
                    onChange={(e) => setEditingTranslation({...editingTranslation, en: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-fr">{t('French')}</Label>
                  <Textarea
                    id="edit-fr"
                    value={editingTranslation.fr}
                    onChange={(e) => setEditingTranslation({...editingTranslation, fr: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('Cancel')}
                </Button>
                <Button onClick={handleEditTranslation}>
                  {t('Save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
