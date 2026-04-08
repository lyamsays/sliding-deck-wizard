import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const TryBeforeSignup = () => {
  const benefits = [
    { icon: Zap, text: "Create unlimited presentations" },
    { icon: Clock, text: "Save hours of work" },
    { icon: Users, text: "Built for educators" },
    { icon: CheckCircle, text: "No credit card required" }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Try it now - no signup needed!
          </h3>
          <p className="text-blue-700">
            Create your first presentation instantly. See the magic yourself.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-blue-700">
              <benefit.icon className="h-4 w-4" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✓ Free plan
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ✓ 30-second signup
          </Badge>
        </div>
        
        <Separator className="my-4" />
        
        <p className="text-xs text-blue-600">
          Start creating immediately. Save your work when you're ready.
        </p>
      </CardContent>
    </Card>
  );
};

export default TryBeforeSignup;