import React from 'react';
import { CheckCircle, Edit3, RotateCcw, ArrowRight } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

export const BlueprintStep: React.FC = () => {
  const { blueprint, setStep } = useWizardStore();

  if (!blueprint) {
    return null;
  }

  const handleApprove = () => {
    setStep('credentials');
  };

  const handleEdit = () => {
    setStep('intent');
  };

  const handleStartOver = () => {
    setStep('welcome');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your AI-Generated Blueprint
          </h1>
          <p className="text-lg text-gray-600">
            Review the intelligent structure our Wizard created for your goal
          </p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Goal Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Your Input:</p>
                <p className="text-gray-900 font-medium">"{blueprint.user_input}"</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">AI Interpretation:</p>
                <p className="text-gray-900">{blueprint.interpretation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Guild Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {blueprint.suggested_structure.guild_name}
                </h3>
                <p className="text-gray-600">{blueprint.suggested_structure.guild_purpose}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Digital Workers ({blueprint.suggested_structure.agents.length})
                  </h4>
                  <div className="space-y-3">
                    {blueprint.suggested_structure.agents.map((agent, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">{agent.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
                        <p className="text-sm text-gray-700">{agent.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {agent.tools_needed.map((tool, toolIndex) => (
                            <span
                              key={toolIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Automation Flows ({blueprint.suggested_structure.workflows.length})
                  </h4>
                  <div className="space-y-3">
                    {blueprint.suggested_structure.workflows.map((workflow, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">{workflow.name}</h5>
                        <p className="text-sm text-gray-700 mb-2">{workflow.description}</p>
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Trigger: {workflow.trigger_type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={handleStartOver}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Goal
            </Button>
            <Button onClick={handleApprove} size="lg">
              Approve Blueprint
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};