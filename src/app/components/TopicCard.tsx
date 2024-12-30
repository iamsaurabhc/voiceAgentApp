'use client';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    summary: string;
    messages: Array<{ text: string; sender: 'user' | 'agent' }>;
    isExpanded: boolean;
  };
  onToggleExpand: (id: string) => void;
}

export function TopicCard({ topic, onToggleExpand }: TopicCardProps) {
  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        onClick={() => onToggleExpand(topic.id)}
        className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{topic.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{topic.summary}</p>
      </button>
      
      {topic.isExpanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          {topic.messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg mb-2 ${
                message.sender === 'user'
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 