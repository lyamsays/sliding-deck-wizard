import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Zap, 
  FileText, 
  Upload, 
  Brain,
  ArrowRight,
  Play,
  Clock
} from 'lucide-react';

const QuickStart = () => {
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);

  const creationMethods = [
    {
      id: 'ai-prompt',
      icon: Brain,
      title: 'Start with AI',
      description: 'Describe your presentation and let AI create it',
      time: '30 seconds',
      example: 'Create a presentation about renewable energy trends...',
      color: 'from-blue-500 to-blue-600',
      route: '/create?method=ai'
    },
    {
      id: 'template',
      icon: Sparkles,
      title: 'Choose Template',
      description: 'Pick from professional consulting & academic templates',
      time: '1 minute',
      example: 'Strategy consulting, Research presentation, Board deck...',
      color: 'from-purple-500 to-purple-600',
      route: '/themes'
    },
    {
      id: 'file-upload',
      icon: Upload,
      title: 'Upload Content',
      description: 'Transform your existing documents into slides',
      time: '2 minutes',
      example: 'Word docs, PDFs, research papers...',
      color: 'from-green-500 to-green-600',
      route: '/create?method=upload'
    }
  ];

  const examples = [
    {
      title: 'Q3 Marketing Strategy',
      author: 'Marketing Team',
      slides: 12,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      category: 'Business'
    },
    {
      title: 'Climate Change Research',
      author: 'Dr. Sarah Chen',
      slides: 18,
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=300&fit=crop',
      category: 'Academic'
    },
    {
      title: 'Product Launch Deck',
      author: 'Product Team',
      slides: 15,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      category: 'Startup'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Get Started in Seconds
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How would you like to
            <span className="text-primary"> start creating?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your preferred method and watch your ideas transform into professional presentations
          </p>
        </div>

        {/* Creation Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {creationMethods.map((method) => (
            <Card 
              key={method.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                hoveredMethod === method.id ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'
              }`}
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{method.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.time}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3 mb-6 text-sm italic text-muted-foreground">
                  "{method.example}"
                </div>

                <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  <Link to={method.route}>
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Examples Showcase */}
        <div className="bg-card rounded-2xl p-8 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">See what others have created</h3>
            <p className="text-muted-foreground">Real presentations made with Sliding.io</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {examples.map((example, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
                  <img 
                    src={example.image} 
                    alt={example.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black">
                        {example.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{example.title}</h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>by {example.author}</span>
                    <span>{example.slides} slides</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              View More Examples
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: '2M+', label: 'Presentations Created' },
            { value: '30s', label: 'Average Creation Time' },
            { value: '50K+', label: 'Professional Users' },
            { value: '99%', label: 'User Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStart;