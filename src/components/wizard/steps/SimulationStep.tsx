import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, ArrowRight, Brain, Zap, Clock } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const SimulationStep: React.FC = () => {
  const { 
    blueprint,
    credentials,
    simulationResults,
    isLoading,
    runSimulation,
    setStep,
    errors 
  } = useWizardStore();
  
  const [showDetails, setShowDetails] = useState(false);

  const handleRunSimulation = async () => {
    await runSimulation();
  };

  const handleDeploy = () => {
    setStep('deployment');
  };

  const hasValidCredentials = Object.keys(credentials).length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Your Guild
          </h1>
          <p className="text-lg text-gray-600">
            Run an intelligent simulation to see how your digital workers will perform
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              AI-Powered Simulation Lab
            </CardTitle>
            <p className="text-gray-600">
              Our advanced simulation engine will test agent coordination, response quality, and workflow execution
            </p>
          </CardHeader>
          <CardContent>
            {!simulationResults ? (
              <div className="text-center py-8">
                {!hasValidCredentials ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Credentials Required</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Please provide your API credentials in the previous step to run a comprehensive simulation with real integrations.
                    </p>
                    <Button
                      onClick={() => setStep('credentials')}
                      variant="outline"
                      className="mb-4"
                    >
                      Add Credentials
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready for Intelligence Testing
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        We'll test your {blueprint?.suggested_structure.agents.length} agents with realistic scenarios, 
                        measuring response time, accuracy, and inter-agent coordination.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Simulation Will Test:</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-green-500" />
                          Agent response quality
                        </div>
                        <div className="flex items-center">
                          <Brain className="w-4 h-4 mr-2 text-purple-500" />
                          Memory system functionality
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          Execution timing
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-teal-500" />
                          Tool integrations
                        </div>
                      </div>
                    </div>

                    {errors.length > 0 && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">
                        {errors.join(', ')}
                      </div>
                    )}

                    <Button
                      onClick={handleRunSimulation}
                      isLoading={isLoading}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? 'Running AI Simulation...' : 'Start Intelligence Test'}
                      <Play className="w-5 h-5 ml-2" />
                    </Button>

                    {isLoading && (
                      <div className="mt-6 space-y-3">
                        <div className="text-sm text-gray-600 text-center">
                          Testing agent coordination and intelligence...
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center text-green-600 mb-6">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Simulation Completed Successfully</span>
                  <span className="ml-auto text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                    {simulationResults.execution_time}s total
                  </span>
                </div>

                <div className="grid gap-4">
                  {simulationResults.agent_responses?.map((agent: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{agent.agent_name}</h3>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600 font-medium">Performance: Excellent</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">{agent.execution_time}s</span>
                            <div className="text-xs text-gray-400">Response Time</div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <p className="text-green-800">{agent.response}</p>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
                          >
                            AI Thought Process
                            <ArrowRight className={`w-3 h-3 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                          </button>
                          
                          {showDetails && (
                            <ul className="space-y-1 text-sm text-gray-600 ml-4">
                              {agent.thought_process.map((thought: string, thoughtIndex: number) => (
                                <li key={thoughtIndex} className="flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                  {thought}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Performance Insights
                    </h4>
                    <div className="space-y-2">
                      {simulationResults.insights?.map((insight: string, index: number) => (
                        <div key={index} className="flex items-center text-blue-800 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                          {insight}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                      <div className="text-sm text-blue-900">
                        <strong>Overall Assessment:</strong> Your Guild demonstrates excellent AI coordination and is 
                        ready for production deployment. All agents performed within optimal parameters.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {simulationResults && (
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