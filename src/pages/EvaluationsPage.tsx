
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { TranscriptChat } from '@/components/evaluation/TranscriptChat';
import { FormBuilder } from '@/components/evaluation/FormBuilder';

// Sample transcript data
const sampleTranscript = [
  { id: 1, speaker: 'agent', text: 'Bonjour, bienvenue chez AcQuality. Comment puis-je vous aider aujourd\'hui ?', timestamp: '00:00:05' },
  { id: 2, speaker: 'customer', text: 'Bonjour, j\'ai un problème avec mon compte.', timestamp: '00:00:12' },
  { id: 3, speaker: 'agent', text: 'Je suis désolé pour ce désagrément. Pouvez-vous me donner plus de détails sur le problème que vous rencontrez ?', timestamp: '00:00:18' },
  { id: 4, speaker: 'customer', text: 'Je n\'arrive pas à me connecter. Le système me dit que mon mot de passe est incorrect, mais je suis sûr qu\'il est bon.', timestamp: '00:00:30' },
  { id: 5, speaker: 'agent', text: 'Je comprends. Ne vous inquiétez pas, nous allons résoudre ce problème ensemble. Avez-vous essayé de réinitialiser votre mot de passe ?', timestamp: '00:00:45' },
  { id: 6, speaker: 'customer', text: 'Non, je ne sais pas comment faire.', timestamp: '00:00:52' },
  { id: 7, speaker: 'agent', text: 'Je vais vous guider. Sur la page de connexion, il y a un lien "Mot de passe oublié". Cliquez dessus et suivez les instructions pour réinitialiser votre mot de passe.', timestamp: '00:01:05' },
  { id: 8, speaker: 'customer', text: 'D\'accord, je vais essayer ça. Merci pour votre aide.', timestamp: '00:01:20' },
  { id: 9, speaker: 'agent', text: 'Je vous en prie. Y a-t-il autre chose que je puisse faire pour vous aujourd\'hui ?', timestamp: '00:01:28' },
  { id: 10, speaker: 'customer', text: 'Non, c\'est tout. Merci et bonne journée.', timestamp: '00:01:35' },
  { id: 11, speaker: 'agent', text: 'Merci à vous également et bonne journée. N\'hésitez pas à nous contacter si vous avez d\'autres questions.', timestamp: '00:01:45' }
];

export default function EvaluationsPage() {
  const [activeTab, setActiveTab] = useState('transcript');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Évaluation</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="transcript">Transcription</TabsTrigger>
            <TabsTrigger value="evaluation">Formulaire d'évaluation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transcript" className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Conversation</h2>
              <TranscriptChat messages={sampleTranscript} />
            </div>
          </TabsContent>
          
          <TabsContent value="evaluation" className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Constructeur de Grille d'Évaluation</h2>
              <FormBuilder />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
