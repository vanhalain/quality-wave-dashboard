
import React from 'react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: string;
}

interface TranscriptChatProps {
  messages: Message[];
}

export function TranscriptChat({ messages }: TranscriptChatProps) {
  return (
    <div className="flex flex-col space-y-4 max-h-[600px] overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className={cn(
          "flex",
          message.speaker === 'agent' ? "justify-start" : "justify-end"
        )}>
          <div className={cn(
            "max-w-[80%] p-3 rounded-lg",
            message.speaker === 'agent' 
              ? "bg-blue-100 text-blue-900 rounded-tr-lg rounded-br-lg rounded-bl-lg" 
              : "bg-green-100 text-green-900 rounded-tl-lg rounded-bl-lg rounded-br-lg"
          )}>
            <div className="font-semibold text-xs mb-1">
              {message.speaker === 'agent' ? 'Agent' : 'Client'} • {message.timestamp}
            </div>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
