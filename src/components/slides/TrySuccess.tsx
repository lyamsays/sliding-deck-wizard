import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Sparkles, 
  Download, 
  Heart,
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrySuccessProps {
  slideCount: number;
  onSave: () => void;
  user: any;
}

const TrySuccess: React.FC<TrySuccessProps> = ({ slideCount, onSave, user }) => {
  if (user) return null; // Don't show if already logged in

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-800">
          🎉 Amazing! Your presentation is ready!
        </CardTitle>
        <p className="text-green-700">
          You just created {slideCount} professional slides in seconds. Want to save them?
        </p>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* Value proposition */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Save unlimited presentations</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Access from anywhere</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Share with your team</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onSave}
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Save My Presentation (Free!)
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/create">
              Create Another
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Export alternative */}
        <div className="pt-4 border-t border-green-200">
          <p className="text-sm text-green-600 mb-3">
            Or download now without signing up:
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PowerPoint
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Images
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-xs text-green-600">
          <Badge variant="secondary" className="mr-2">✓ No credit card</Badge>
          <Badge variant="secondary" className="mr-2">✓ Free forever plan</Badge>
          <Badge variant="secondary">✓ 30-second signup</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrySuccess;