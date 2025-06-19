import React, { useState } from 'react';
import { Key, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const CredentialsStep: React.FC = () => {
  const { blueprint, credentials, setCredentials, setStep } = useWizardStore();
  const [localCredentials, setLocalCredentials] = useState(credentials);
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({});

  // Mock required credentials based on blueprint
  const requiredCredentials = [
    {
      key: 'stripe_api_key',
      name: 'Stripe API Key',
      description: 'To fetch MRR and revenue data',
      placeholder: 'sk_test_...',
      instructions: [
        'Go to Stripe Dashboard → Developers → API Keys',
        'Copy your "Secret key" (starts with sk_)',
        'Use test key for development, live key for production'
      ]
    },
    {
      key: 'slack_webhook_url',
      name: 'Slack Webhook URL',
      description: 'To send notifications to your team channel',
      placeholder: 'https://hooks.slack.com/services/...',
      instructions: [
        'Go to your Slack workspace → Apps → Incoming Webhooks',
        'Click "Add to Slack" and choose your channel',
        'Copy the webhook URL provided'
      ]
    },
    {
      key: 'elevenlabs_voice_id',
      name: 'ElevenLabs Voice ID',
      description: 'For agent voice synthesis',
      placeholder: '21m00Tcm4TlvDq8ikWAM',
      instructions: [
        'Sign up at ElevenLabs.io',
        'Go to VoiceLab and choose a voice',
        'Copy the Voice ID from the voice settings'
      ]
    }
  ];

  const handleCredentialChange = (key: string, value: string) => {
    setLocalCredentials(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validateCredential = (key: string, value: string) => {
    // Mock validation logic
    let isValid = false;
    
    switch (key) {
      case 'stripe_api_key':
        isValid = value.startsWith('sk_') && value.length > 20;
        break;
      case 'slack_webhook_url':
        isValid = value.startsWith('https://hooks.slack.com/services/');
        break;
      case 'elevenlabs_voice_id':
        isValid = value.length > 10;
        break;
      default:
        isValid = value.length > 0;
    }

    setValidationStatus(prev => ({
      ...prev,
      [key]: isValid
    }));
  };

  const handleContinue = () => {
    setCredentials(localCredentials);
    setStep('simulation');
  };

  const allCredentialsValid = requiredCredentials.every(
    cred => localCredentials[cred.key] && validationStatus[cred.key]
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Tools
          </h1>
          <p className="text-lg text-gray-600">
            Provide API keys and credentials for the tools your Guild will use
          </p>
        </div>

        <div className="space-y-6">
          {requiredCredentials.map((credential) => (
            <Card key={credential.key}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 mr-2 text-blue-600" />
                    {credential.name}
                    {validationStatus[credential.key] && (
                      <CheckCircle2 className="w-5 h-5 ml-2 text-green-500" />
                    )}
                  </div>
                </CardTitle>
                <p className="text-gray-600">{credential.description}</p>
              </CardHeader>
              <CardContent>
                <Input
                  value={localCredentials[credential.key] || ''}
                  onChange={(e) => handleCredentialChange(credential.key, e.target.value)}
                  onBlur={(e) => validateCredential(credential.key, e.target.value)}
                  placeholder={credential.placeholder}
                  type="password"
                  className="mb-4"
                />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    Setup Instructions
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {credential.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!allCredentialsValid}
            size="lg"
          >
            Test in Simulation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {!allCredentialsValid && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Please provide all required credentials to continue
          </p>
        )}
      </div>
    </div>
  );
};