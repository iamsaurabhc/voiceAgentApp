"use client";

import { useConversation } from '@11labs/react';
import { useState, useCallback } from 'react';
import { TopicCard } from './TopicCard';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  text: string;
  sender: 'user' | 'agent';
};

type Topic = {
  id: string;
  title: string;
  summary: string;
  messages: Message[];
  isExpanded: boolean;
};

async function summarizeConversation(messages: Message[]): Promise<string> {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  
  const data = await response.json();
  return data.summary;
}

export default function VoiceAgent() {
  const [isListening, setIsListening] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to voice agent');
    },
    onMessage: async (message) => {
      console.log('Received message:', message);
      setTopics(prevTopics => {
        console.log('Previous topics:', prevTopics);
        const newTopics = [...prevTopics];
        if (newTopics.length === 0) {
          newTopics.push({
            id: uuidv4(),
            title: 'New Conversation',
            summary: '',
            messages: [],
            isExpanded: true
          });
        }
        
        const currentTopic = newTopics[newTopics.length - 1];
        currentTopic.messages.push({
          text: message.message,
          sender: message.source === 'ai' ? 'agent' : 'user'
        });

        if (currentTopic.messages.length % 3 === 0) {
          summarizeConversation(currentTopic.messages).then(summary => {
            setTopics(topics => {
              const updatedTopics = [...topics];
              updatedTopics[updatedTopics.length - 1].summary = summary;
              return updatedTopics;
            });
          });
        }

        return newTopics;
      });
    },
    onError: (error) => {
      console.error('Voice agent error:', error);
    }
  });

  const handleVoiceClick = useCallback(async () => {
    try {
      if (!isListening) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: '3K6vpejpeNrrPZjbiavL' // Replace with your actual agent ID
        });
        setIsListening(true);
      } else {
        await conversation.endSession();
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [isListening, conversation]);

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-center bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">Personal Growth Assistant</h1>
      </header>

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto p-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onToggleExpand={(id) => {
              setTopics(prevTopics =>
                prevTopics.map(t =>
                  t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
                )
              );
            }}
          />
        ))}
      </div>

      {/* Footer with Voice Button */}
      <footer className="p-4 border-t border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <button
          onClick={handleVoiceClick}
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 ${
            isListening 
              ? 'bg-gradient-to-r from-blue-400 via-teal-300 to-purple-500 animate-pulse'
              : 'bg-gradient-to-r from-blue-400/80 to-teal-400/80 hover:from-blue-500 hover:to-teal-500'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      </footer>
    </div>
  );
} 