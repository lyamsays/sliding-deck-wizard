
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PurposeStepProps {
  purpose: string;
  tone: string;
  setPurpose: (purpose: string) => void;
  setTone: (tone: string) => void;
}

const PurposeStep: React.FC<PurposeStepProps> = ({ purpose, tone, setPurpose, setTone }) => {
  const tones = [
    { id: 'Professional', label: 'Professional', description: 'Formal and business-focused' },
    { id: 'Academic', label: 'Academic', description: 'Scholarly and research-oriented' },
    { id: 'Persuasive', label: 'Persuasive', description: 'Compelling and convincing' },
    { id: 'Creative', label: 'Creative', description: 'Innovative and engaging' },
    { id: 'Minimalist', label: 'Minimalist', description: 'Clean and straightforward' }
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>What's your presentation about?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Quarterly business review, product launch strategy, market analysis findings..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="min-h-[100px] text-base"
          />
          <p className="text-sm text-gray-500 mt-2">
            Help us understand the context so we can tailor the content accordingly.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose your presentation tone</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={tone} onValueChange={setTone} className="space-y-3">
            {tones.map((toneOption) => (
              <div key={toneOption.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={toneOption.id} id={toneOption.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={toneOption.id} className="font-medium cursor-pointer">
                    {toneOption.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{toneOption.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurposeStep;
