import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const SimulationStep: React.FC = () => {
  const { setStep } = useWizardStore();
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Mock simulation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock simulation results
    const results = {
      success: true,
      agents: [
        {
          name: 'Finance Agent',
          response: 'Successfully fetched MRR data: $42,300 (up 12% from last week)',
          thought_process: [
            'Connected to Stripe API',
            'Retrieved subscription data for past 7 days',
            'Calculated MRR growth rate',
            'Formatted data for report'
          ],
          execution_time: 1.2
        },
        {
          name: 'Writer Agent',
          response: 'Drafted professional investor update with key metrics and growth story',
          thought_process: [
            'Analyzed financial data patterns',
            'Applied professional tone guidelines',
            'Structured update with clear narrative',
            'Added contextual insights'
          ],
          execution_time: 2.1
        },
        {
          name: 'Comms Agent',
          response: 'Prepared message for Slack delivery and email distribution',
          thought_process: [
            'Formatted message for Slack webhook',
            'Prepared email template',
            'Scheduled for optimal delivery time',
            'Set up confirmation tracking'
          ],
          execution_time: 0.8
        }
      ]
    };

    setSimulationResults(results);
    setIsRunning(false);
    setHasRun(true);
  };

  const handleDeploy = () => {
    setStep('deployment');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Your Guild
          </h1>
          <p className="text-lg text-gray-600">
            Run a simulation to see how your digital workers will perform
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2 text-blue-600" />
              Simulation Lab
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasRun ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">
                  Ready to test your Guild with sample data? This will show you exactly how your agents will work together.
                </p>
                <Button
                  onClick={runSimulation}
                  isLoading={isRunning}
                  size="lg"
                >
                  {isRunning ? 'Running Simulation...' : 'Start Simulation'}
                  <Play className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center text-green-600 mb-4">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Simulation Completed Successfully</span>
                </div>

                {simulationResults?.agents.map((agent: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <span className="text-sm text-gray-500">{agent.execution_time}s</span>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <p className="text-green-800">{agent.response}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Thought Process:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {agent.thought_process.map((thought: string, thoughtIndex: number) => (
                            <li key={thoughtIndex} className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              {thought}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Simulation Summary</h4>
                  <p className="text-blue-800 text-sm">
                    All agents performed successfully. Your Guild is ready for deployment. 
                    Total execution time: {simulationResults?.agents.reduce((total: number, agent: any) => total + agent.execution_time, 0).toFixed(1)}s
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {hasRun && (
          <div className="flex justify-center">
            <Button onClick={handleDeploy} size="lg">
              Deploy Live Guild
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};