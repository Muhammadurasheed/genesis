import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const DeploymentStep: React.FC = () => {
  const { blueprint, reset } = useWizardStore();
  const [deploymentStatus, setDeploymentStatus] = useState('deploying');
  const [guildId, setGuildId] = useState<string>('');

  useEffect(() => {
    // Mock deployment process
    const deploymentSteps = [
      { step: 'Creating Guild structure', delay: 1000 },
      { step: 'Initializing agents', delay: 1500 },
      { step: 'Setting up workflows', delay: 1200 },
      { step: 'Configuring voice & memory', delay: 800 },
      { step: 'Running final validation', delay: 1000 },
      { step: 'Guild deployed successfully', delay: 500 }
    ];

    let currentStep = 0;
    const runDeployment = () => {
      if (currentStep < deploymentSteps.length) {
        setTimeout(() => {
          currentStep++;
          if (currentStep === deploymentSteps.length) {
            setDeploymentStatus('completed');
            setGuildId('guild-' + Math.random().toString(36).substr(2, 9));
          } else {
            runDeployment();
          }
        }, deploymentSteps[currentStep].delay);
      }
    };

    runDeployment();
  }, []);

  const handleGoToDashboard = () => {
    reset();
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const handleCreateAnother = () => {
    reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {deploymentStatus === 'deploying' ? 'Deploying Your Guild...' : 'Guild Deployed Successfully!'}
          </h1>
          <p className="text-lg text-gray-600">
            {deploymentStatus === 'deploying' 
              ? 'Setting up your digital workers and workflows'
              : 'Your AI-native workspace is ready for action'
            }
          </p>
        </div>

        {deploymentStatus === 'deploying' ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-gray-600">
                Creating your Guild infrastructure and initializing agents...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  {blueprint?.suggested_structure.guild_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Active Agents</h4>
                    <ul className="space-y-2">
                      {blueprint?.suggested_structure.agents.map((agent, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          <span>{agent.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Live Workflows</h4>
                    <ul className="space-y-2">
                      {blueprint?.suggested_structure.workflows.map((workflow, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          <span>{workflow.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Guild ID:</strong> {guildId}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Your agents are now active and ready to execute workflows. They can be accessed via voice commands and will maintain memory of all interactions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🗣️</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Voice Interaction</h4>
                    <p className="text-sm text-gray-600">
                      Talk to your agents naturally using voice commands
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Memory & Learning</h4>
                    <p className="text-sm text-gray-600">
                      Agents remember interactions and improve over time
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Autonomous Execution</h4>
                    <p className="text-sm text-gray-600">
                      Workflows run automatically based on triggers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleCreateAnother}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Another Guild
              </Button>
              <Button onClick={handleGoToDashboard} size="lg">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};