
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TranscriptChat } from '@/components/evaluation/TranscriptChat';
import { DragDropFormBuilder } from '@/components/evaluation/DragDropFormBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder } from '@/components/evaluation/FormBuilder';

export default function EvaluationsPage() {
  // Mock messages data
  const messages = [
    {
      id: 1,
      speaker: 'agent' as const,
      text: 'Hello, thank you for calling our customer service. How may I help you today?',
      timestamp: '14:32',
    },
    {
      id: 2,
      speaker: 'customer' as const,
      text: 'Hi, I have a question about my recent bill. There seems to be a charge I don\'t recognize.',
      timestamp: '14:33',
    },
    {
      id: 3,
      speaker: 'agent' as const,
      text: 'I\'d be happy to look into that for you. Could you please verify your account information first?',
      timestamp: '14:33',
    },
    {
      id: 4,
      speaker: 'customer' as const,
      text: 'Sure, my account number is 12345 and my name is John Doe.',
      timestamp: '14:34',
    },
    {
      id: 5,
      speaker: 'agent' as const,
      text: 'Thank you, Mr. Doe. I can see the charge you\'re referring to. This is for the additional service you requested last month.',
      timestamp: '14:35',
    },
  ];

  const [builderType, setBuilderType] = useState<'basic' | 'dnd'>('dnd');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">Evaluation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Transcript</CardTitle>
            <CardDescription>Review the agent-customer interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptChat messages={messages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Assessment</CardTitle>
            <CardDescription>Evaluate the conversation based on criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
              <TabsList className="mb-4">
                <TabsTrigger value="form">Evaluation Form</TabsTrigger>
                <TabsTrigger value="builder">Form Builder</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="form">
                <FormBuilder />
              </TabsContent>
              <TabsContent value="builder">
                <Tabs defaultValue="dnd" onValueChange={(value) => setBuilderType(value as 'basic' | 'dnd')}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Builder</TabsTrigger>
                    <TabsTrigger value="dnd">Drag & Drop Builder</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic">
                    <FormBuilder />
                  </TabsContent>
                  <TabsContent value="dnd">
                    <DragDropFormBuilder />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="results">
                <div className="p-4 text-center text-muted-foreground">
                  Results will be displayed after submission
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
