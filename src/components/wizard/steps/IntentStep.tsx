import React, { useState } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const IntentStep: React.FC = () => {
  const { user_input, setUserInput, generateBlueprint, errors } = useWizardStore();
  const [localInput, setLocalInput] = useState(user_input);

  const examples = [
    "Send weekly investor updates with real growth metrics and polished tone",
    "Automate customer support with intelligent responses and escalation",
    "Manage my social media content calendar and posting schedule",
    "Track and analyze competitor pricing with automated alerts",
    "Handle job applications with screening and interview scheduling"
  ];

  const handleSubmit = async () => {
    setUserInput(localInput);
    await generateBlueprint();
  };

  const handleExampleClick = (example: string) => {
    setLocalInput(example);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            What would you like your Guild to achieve?
          </h1>
          <p className="text-lg text-gray-600">
            Describe your goal in plain English. Our AI Wizard will understand your intent and create the perfect blueprint.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Tell us your vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="I want to..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {errors.length > 0 && (
              <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {errors.join(', ')}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!localInput.trim()}
              className="mt-4 w-full"
              size="lg"
            >
              Generate Blueprint
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Need inspiration? Try these examples:</h3>
          <div className="grid gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <p className="text-gray-700">{example}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};