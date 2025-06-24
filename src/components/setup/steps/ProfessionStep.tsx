
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Users, TrendingUp, User } from 'lucide-react';

interface ProfessionStepProps {
  profession: string;
  setProfession: (profession: string) => void;
}

const ProfessionStep: React.FC<ProfessionStepProps> = ({ profession, setProfession }) => {
  const professions = [
    {
      id: 'Consultant',
      title: 'Management Consultant',
      description: 'Strategy, analysis, client presentations',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'Educator',
      title: 'Professor / Educator',
      description: 'Academic lectures, research presentations',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'Executive',
      title: 'Business Executive',
      description: 'Board meetings, stakeholder updates',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'Student',
      title: 'Student',
      description: 'Class presentations, project pitches',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'Other',
      title: 'Other Professional',
      description: 'General business presentations',
      icon: User,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {professions.map((prof) => (
        <Card
          key={prof.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            profession === prof.id 
              ? 'ring-2 ring-purple-500 shadow-lg' 
              : 'hover:shadow-md'
          }`}
          onClick={() => setProfession(prof.id)}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${prof.color} flex items-center justify-center`}>
              <prof.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{prof.title}</h3>
              <p className="text-sm text-gray-600">{prof.description}</p>
            </div>
            {profession === prof.id && (
              <div className="text-purple-600 font-medium">Selected ✓</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfessionStep;
