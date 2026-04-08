import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  profession: string;
  tone: string;
  autoGenerateImages: boolean;
  selectedTheme: string;
  framework?: string;
  recentPurposes: string[];
  contentSuggestions: string[];
}

const DEFAULT_PREFERENCES: UserPreferences = {
  profession: 'Consultant',
  tone: 'Professional',
  autoGenerateImages: true,
  selectedTheme: 'pristine',
  framework: 'None',
  recentPurposes: [],
  contentSuggestions: []
};

export const useSmartDefaults = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first (works for all users)
      const localPrefs = localStorage.getItem('userPreferences');
      if (localPrefs) {
        const parsedPrefs = JSON.parse(localPrefs);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPrefs });
      }

      // If user is logged in, also try to load from database
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const dbPrefs: Partial<UserPreferences> = {
            profession: profile.profession || 'Consultant'
          };
          
          // Merge database preferences with local preferences
          setPreferences(prev => ({ ...prev, ...dbPrefs }));
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      // Always save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));

      // If user is logged in, also save profession to database
      if (user && updates.profession) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            profession: updates.profession,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const addRecentPurpose = (purpose: string) => {
    if (purpose.trim() && !preferences.recentPurposes.includes(purpose)) {
      const newPurposes = [purpose, ...preferences.recentPurposes.slice(0, 4)]; // Keep last 5
      updatePreferences({ recentPurposes: newPurposes });
    }
  };

  const getSmartSuggestions = (profession: string, purpose: string): string[] => {
    const suggestions: Record<string, Record<string, string[]>> = {
      Consultant: {
        'Client presentation': [
          'Executive summary of current market analysis',
          'Strategy recommendations with implementation roadmap',
          'Performance metrics and KPI dashboard review'
        ],
        'Team update': [
          'Project milestone status and upcoming deliverables',
          'Resource allocation and capacity planning',
          'Risk assessment and mitigation strategies'
        ],
        'Board meeting': [
          'Quarterly performance review and market insights',
          'Strategic initiatives and investment recommendations',
          'Competitive analysis and market positioning'
        ]
      },
      Educator: {
        'Lecture': [
          'Introduction to core concepts with real-world examples',
          'Case study analysis and discussion points',
          'Summary of key takeaways and assignments'
        ],
        'Research presentation': [
          'Literature review and research methodology',
          'Data analysis and findings presentation',
          'Conclusions and future research directions'
        ],
        'Conference talk': [
          'Abstract and research objectives overview',
          'Methodology and experimental results',
          'Impact and practical applications'
        ]
      },
      Executive: {
        'Board meeting': [
          'Quarterly financial performance and key metrics',
          'Strategic initiatives and market opportunities',
          'Operational updates and resource allocation'
        ],
        'Investor presentation': [
          'Company overview and market position',
          'Financial highlights and growth trajectory',
          'Investment thesis and value proposition'
        ],
        'All-hands meeting': [
          'Company vision and strategic direction',
          'Team achievements and recognition',
          'Upcoming initiatives and team goals'
        ]
      },
      Student: {
        'Class presentation': [
          'Project overview and research question',
          'Methodology and data collection process',
          'Analysis, findings, and conclusions'
        ],
        'Thesis defense': [
          'Research problem and literature review',
          'Methodology and experimental design',
          'Results, discussion, and future work'
        ],
        'Group project': [
          'Team roles and project timeline',
          'Research findings and analysis',
          'Recommendations and next steps'
        ]
      }
    };

    const professionSuggestions = suggestions[profession] || {};
    const purposeSuggestions = professionSuggestions[purpose] || [];
    
    // If no specific match, provide general suggestions based on profession
    if (purposeSuggestions.length === 0) {
      const allSuggestions = Object.values(professionSuggestions).flat();
      return allSuggestions.slice(0, 3);
    }
    
    return purposeSuggestions;
  };

  const getPurposeSuggestions = (profession: string): string[] => {
    const suggestions: Record<string, string[]> = {
      Consultant: ['Client presentation', 'Team update', 'Board meeting', 'Strategy workshop', 'Project review'],
      Educator: ['Lecture', 'Research presentation', 'Conference talk', 'Workshop', 'Seminar'],
      Executive: ['Board meeting', 'Investor presentation', 'All-hands meeting', 'Strategy session', 'Quarterly review'],
      Student: ['Class presentation', 'Thesis defense', 'Group project', 'Research proposal', 'Assignment presentation'],
      Other: ['Business presentation', 'Project update', 'Team meeting', 'Sales pitch', 'Training session']
    };

    const professionSuggestions = suggestions[profession] || suggestions.Other;
    const combined = [...new Set([...preferences.recentPurposes, ...professionSuggestions])];
    return combined.slice(0, 8);
  };

  const getFrameworkSuggestions = (profession: string, purpose: string): string[] => {
    if (profession !== 'Consultant') return [];

    const frameworkMap: Record<string, string[]> = {
      'Client presentation': ['SWOT', 'Porter', 'BCG'],
      'Strategy workshop': ['Porter', 'ValueChain', 'PESTEL'],
      'Board meeting': ['BalancedScorecard', 'SWOT', 'BCG'],
      'Project review': ['ValueChain', 'SWOT'],
      'Team update': ['None']
    };

    return frameworkMap[purpose] || ['SWOT', 'Porter', 'BCG'];
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    addRecentPurpose,
    getSmartSuggestions,
    getPurposeSuggestions,
    getFrameworkSuggestions
  };
};