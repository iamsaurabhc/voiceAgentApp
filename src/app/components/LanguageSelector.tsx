interface LanguageOption {
  id: string;
  label: string;
  agentId: string;
}

interface LanguageSelectorProps {
  onSelect: (option: LanguageOption) => void;
}

const languageOptions: LanguageOption[] = [
  {
    id: 'en',
    label: 'English',
    agentId: 'CIwRmtN53lZzgHsoqYic' // Your English agent ID
  },
  {
    id: 'hi',
    label: 'हिंदी',
    agentId: 'nA2I3D0RMhNZKrQca1rr' // Replace with your Hindi agent ID
  }
];

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-8 text-center bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
        Choose your preferred language
        <br />
        अपनी पसंदीदा भाषा चुनें
      </h2>
      <div className="flex flex-col gap-4">
        {languageOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-400/80 to-teal-400/80 hover:from-blue-500 hover:to-teal-500 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
} 