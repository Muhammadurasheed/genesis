import React from 'react';
import { Sparkles, Zap, Users, Workflow } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const WelcomeStep: React.FC = () => {
  const { setStep } = useWizardStore();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Blueprint',
      description: 'Describe your goal and watch our Wizard create intelligent blueprints'
    },
    {
      icon: Users,
      title: 'Digital Workers',
      description: 'Hire AI agents that work like real teammates with voice and memory'
    },
    {
      icon: Workflow,
      title: 'Smart Workflows',
      description: 'Automate complex business processes with visual, intelligent flows'
    },
    {
      icon: Zap,
      title: 'Instant Deployment',
      description: 'Test in simulation, then deploy live agents in minutes'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">G</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GenesisOS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The AI-native workspace where founders build elite, automated companies with digital workers, smart workflows, and voice-powered interaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-left" hover>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Ready to start building?</CardTitle>
            <p className="text-gray-600">Create your first Guild and transform your vision into autonomous digital execution.</p>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setStep('intent')}
            >
              Create Your First Guild
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};