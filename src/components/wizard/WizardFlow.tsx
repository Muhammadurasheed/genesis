import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { WelcomeStep } from './steps/WelcomeStep';
import { IntentStep } from './steps/IntentStep';
import { BlueprintStep } from './steps/BlueprintStep';
import { CredentialsStep } from './steps/CredentialsStep';
import { SimulationStep } from './steps/SimulationStep';
import { DeploymentStep } from './steps/DeploymentStep';

export const WizardFlow: React.FC = () => {
  const { step } = useWizardStore();

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeStep />;
      case 'intent':
        return <IntentStep />;
      case 'blueprint':
        return <BlueprintStep />;
      case 'credentials':
        return <CredentialsStep />;
      case 'simulation':
        return <SimulationStep />;
      case 'deployment':
        return <DeploymentStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {renderStep()}
    </div>
  );
};