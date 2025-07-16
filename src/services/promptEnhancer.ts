export interface PromptContext {
  slideTitle: string;
  slideContent?: string[];
  presentationType?: 'business' | 'academic' | 'creative' | 'technical';
  industry?: string;
  audience?: 'executives' | 'students' | 'general' | 'technical';
}

export class PromptEnhancer {
  private static readonly STYLE_KEYWORDS = {
    business: [
      'professional', 'corporate', 'executive', 'boardroom', 'formal',
      'sophisticated', 'elegant', 'premium', 'high-end'
    ],
    academic: [
      'scholarly', 'educational', 'research', 'analytical', 'scientific',
      'institutional', 'academic', 'studious'
    ],
    creative: [
      'innovative', 'artistic', 'vibrant', 'dynamic', 'expressive',
      'imaginative', 'bold', 'contemporary'
    ],
    technical: [
      'precise', 'detailed', 'systematic', 'methodical', 'engineering',
      'technical', 'data-driven', 'analytical'
    ]
  };

  private static readonly QUALITY_MODIFIERS = [
    'ultra high resolution',
    '8K quality',
    'photorealistic',
    'professional photography',
    'studio lighting',
    'sharp focus',
    'detailed',
    'crisp'
  ];

  private static readonly PRESENTATION_STYLES = [
    'clean minimalist design',
    'modern corporate aesthetic',
    'professional color palette',
    'sophisticated layout',
    'business-appropriate',
    'presentation-ready',
    'slide-optimized'
  ];

  static enhancePrompt(basePrompt: string, context: PromptContext): string {
    const enhancedParts: string[] = [];

    // Start with the base prompt
    enhancedParts.push(basePrompt);

    // Add contextual styling based on presentation type
    if (context.presentationType) {
      const styleKeywords = this.STYLE_KEYWORDS[context.presentationType];
      const selectedStyles = this.selectRandomItems(styleKeywords, 2);
      enhancedParts.push(selectedStyles.join(', '));
    }

    // Add slide-specific context
    if (context.slideTitle) {
      enhancedParts.push(`Related to: ${context.slideTitle}`);
    }

    // Add content context for better relevance
    if (context.slideContent && context.slideContent.length > 0) {
      const contentSummary = context.slideContent
        .slice(0, 3) // Limit to first 3 bullet points
        .join(', ')
        .substring(0, 200); // Keep it concise
      enhancedParts.push(`Context: ${contentSummary}`);
    }

    // Add presentation-optimized styling
    const presentationStyles = this.selectRandomItems(this.PRESENTATION_STYLES, 2);
    enhancedParts.push(presentationStyles.join(', '));

    // Add quality modifiers
    const qualityMods = this.selectRandomItems(this.QUALITY_MODIFIERS, 2);
    enhancedParts.push(qualityMods.join(', '));

    // Add technical specifications for optimal presentation use
    enhancedParts.push(
      'aspect ratio 16:9',
      'no text overlays',
      'suitable for projection',
      'professional presentation image'
    );

    return enhancedParts.join('. ') + '.';
  }

  static generateContextualPrompt(context: PromptContext): string {
    const { slideTitle, slideContent, presentationType = 'business' } = context;

    // Base prompt generation based on slide title
    let basePrompt = this.generateBasePrompt(slideTitle);

    // Enhance with content context
    if (slideContent && slideContent.length > 0) {
      const themes = this.extractThemes(slideContent);
      if (themes.length > 0) {
        basePrompt += ` incorporating themes of ${themes.slice(0, 2).join(' and ')}`;
      }
    }

    return this.enhancePrompt(basePrompt, context);
  }

  private static generateBasePrompt(title: string): string {
    const titleLower = title.toLowerCase();
    
    // Industry-specific mappings
    const industryMappings = {
      'healthcare': 'medical professional environment with modern healthcare technology',
      'finance': 'sophisticated financial district with modern banking architecture',
      'technology': 'cutting-edge tech workspace with modern digital interfaces',
      'education': 'modern educational environment with learning resources',
      'marketing': 'creative marketing agency with vibrant branding elements',
      'sales': 'professional sales environment with growth indicators',
      'strategy': 'executive boardroom with strategic planning materials',
      'analytics': 'data visualization center with advanced analytics displays'
    };

    // Check for industry keywords
    for (const [industry, prompt] of Object.entries(industryMappings)) {
      if (titleLower.includes(industry)) {
        return `Professional image depicting ${prompt}`;
      }
    }

    // Concept-based mappings
    const conceptMappings = {
      'growth': 'upward trending visual with growth indicators',
      'innovation': 'cutting-edge technology and innovative solutions',
      'teamwork': 'collaborative professional environment',
      'success': 'achievement and success visualization',
      'challenge': 'problem-solving and solution-finding imagery',
      'future': 'forward-thinking and futuristic concepts',
      'data': 'professional data visualization and analytics',
      'process': 'streamlined workflow and process optimization'
    };

    for (const [concept, prompt] of Object.entries(conceptMappings)) {
      if (titleLower.includes(concept)) {
        return `Professional visualization showing ${prompt}`;
      }
    }

    // Default professional prompt
    return `Professional business image representing ${title}`;
  }

  private static extractThemes(content: string[]): string[] {
    const allText = content.join(' ').toLowerCase();
    const themes: string[] = [];

    const themeKeywords = {
      'efficiency': ['efficient', 'optimize', 'streamline', 'improve'],
      'collaboration': ['team', 'together', 'collaborate', 'partnership'],
      'innovation': ['new', 'innovative', 'creative', 'breakthrough'],
      'growth': ['grow', 'increase', 'expand', 'scale'],
      'quality': ['quality', 'excellence', 'superior', 'premium'],
      'technology': ['digital', 'tech', 'software', 'system'],
      'customer': ['customer', 'client', 'user', 'audience'],
      'leadership': ['lead', 'manage', 'direct', 'guide']
    };

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => allText.includes(keyword))) {
        themes.push(theme);
      }
    }

    return themes;
  }

  private static selectRandomItems<T>(items: T[], count: number): T[] {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Industry detection from slide content
  static detectIndustry(title: string, content?: string[]): string | undefined {
    const fullText = [title, ...(content || [])].join(' ').toLowerCase();
    
    const industries = {
      'healthcare': ['health', 'medical', 'patient', 'clinical', 'healthcare', 'hospital'],
      'finance': ['financial', 'bank', 'investment', 'revenue', 'profit', 'budget'],
      'technology': ['software', 'digital', 'platform', 'algorithm', 'code', 'app'],
      'education': ['learning', 'student', 'education', 'teaching', 'academic'],
      'retail': ['customer', 'sales', 'product', 'market', 'brand', 'consumer'],
      'manufacturing': ['production', 'manufacturing', 'supply', 'logistics', 'operations']
    };

    for (const [industry, keywords] of Object.entries(industries)) {
      const matches = keywords.filter(keyword => fullText.includes(keyword)).length;
      if (matches >= 2) {
        return industry;
      }
    }

    return undefined;
  }
}