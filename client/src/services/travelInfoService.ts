// Mock Travel Information Service
// Simulates travel routes, FAQs, and destination history

export interface TransportOption {
  type: 'flight' | 'train' | 'bus' | 'car';
  name: string;
  duration: string;
  price: string;
  frequency: string;
  pros: string[];
  cons: string[];
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: 'visa' | 'currency' | 'language' | 'safety' | 'customs' | 'general';
}

export interface DestinationHistory {
  title: string;
  era?: string;
  description: string;
  highlights: string[];
}

export interface TravelInfo {
  destination: string;
  howToReach: TransportOption[];
  faqs: FAQ[];
  history: DestinationHistory[];
  quickFacts: {
    population: string;
    language: string[];
    currency: string;
    timezone: string;
    bestTimeToVisit: string;
    visaRequired: boolean;
  };
  culturalTips: string[];
  emergencyContacts: {
    police: string;
    ambulance: string;
    embassy: string;
  };
}

// Mock data for popular destinations
const mockTravelInfo: Record<string, TravelInfo> = {
  'Tokyo, Japan': {
    destination: 'Tokyo, Japan',
    howToReach: [
      {
        type: 'flight',
        name: 'International Flight',
        duration: '12-14 hours (from NYC)',
        price: '$600 - $1,500',
        frequency: 'Daily flights',
        pros: ['Fastest option', 'Multiple airlines', 'Direct flights available'],
        cons: ['Can be expensive', 'Jet lag'],
        icon: '✈️',
      },
      {
        type: 'train',
        name: 'Shinkansen (Bullet Train)',
        duration: '2.5 hours (from Osaka)',
        price: '¥13,000 - ¥15,000',
        frequency: 'Every 10-20 minutes',
        pros: ['Incredibly fast', 'Punctual', 'Scenic', 'Comfortable'],
        cons: ['Expensive', 'Only from other Japanese cities'],
        icon: '🚄',
      },
      {
        type: 'bus',
        name: 'Highway Bus',
        duration: '8-9 hours (from Osaka)',
        price: '¥3,000 - ¥6,000',
        frequency: 'Multiple daily',
        pros: ['Budget-friendly', 'Night buses available', 'Direct routes'],
        cons: ['Long journey', 'Less comfortable'],
        icon: '🚌',
      },
    ],
    faqs: [
      {
        question: 'Do I need a visa to visit Japan?',
        answer: 'Citizens of many countries including the US, UK, Canada, and Australia can visit Japan for up to 90 days without a visa for tourism purposes. Check with your local Japanese embassy for specific requirements.',
        category: 'visa',
      },
      {
        question: 'What currency is used in Tokyo?',
        answer: 'The Japanese Yen (¥/JPY) is the official currency. Cash is still widely used, though credit cards are increasingly accepted in major establishments. ATMs at 7-Eleven stores accept foreign cards.',
        category: 'currency',
      },
      {
        question: 'Is English widely spoken in Tokyo?',
        answer: 'English is not widely spoken, especially outside tourist areas. However, many signs in train stations and major attractions have English translations. Download a translation app and learn basic Japanese phrases.',
        category: 'language',
      },
      {
        question: 'Is Tokyo safe for tourists?',
        answer: 'Tokyo is one of the safest major cities in the world. Violent crime is extremely rare. However, be aware of pickpockets in crowded areas and avoid unlicensed taxis.',
        category: 'safety',
      },
      {
        question: 'What should I know about Japanese customs and etiquette?',
        answer: 'Remove shoes when entering homes and some restaurants. Bow when greeting. Don\'t tip (it\'s considered rude). Be quiet on public transportation. Dispose of trash properly (bins are rare on streets).',
        category: 'customs',
      },
      {
        question: 'What\'s the best way to get around Tokyo?',
        answer: 'The Tokyo Metro and JR train system is efficient and extensive. Get a Suica or Pasmo card for easy payment. Taxis are available but expensive. Walking is great in most neighborhoods.',
        category: 'general',
      },
    ],
    history: [
      {
        title: 'Ancient Origins',
        era: 'Pre-1600s',
        description: 'Tokyo, originally called Edo, was a small fishing village until it became the seat of the Tokugawa shogunate in 1603.',
        highlights: [
          'Named Edo meaning "estuary"',
          'Strategic location at the mouth of the Sumida River',
          'Grew from small village to major city under Tokugawa rule',
        ],
      },
      {
        title: 'The Edo Period',
        era: '1603-1868',
        description: 'Under the Tokugawa shogunate, Edo became the de facto capital of Japan and grew into one of the largest cities in the world by the 18th century.',
        highlights: [
          'Population exceeded 1 million by 1720',
          'Development of unique urban culture',
          'Isolation policy (sakoku) shaped the city',
          'Birth of kabuki theater and ukiyo-e art',
        ],
      },
      {
        title: 'Modern Tokyo',
        era: '1868-Present',
        description: 'Renamed Tokyo ("Eastern Capital") in 1868 when Emperor Meiji moved the capital from Kyoto. The city was rebuilt after the 1923 earthquake and WWII bombings.',
        highlights: [
          'Became imperial capital in 1868',
          'Rebuilt after Great Kanto Earthquake (1923)',
          'Recovered from WWII devastation',
          'Hosted 1964 and 2020 Olympics',
          'Now a global financial and cultural center',
        ],
      },
    ],
    quickFacts: {
      population: '14 million (37 million metro area)',
      language: ['Japanese', 'Limited English in tourist areas'],
      currency: 'Japanese Yen (¥)',
      timezone: 'JST (UTC+9)',
      bestTimeToVisit: 'March-May (Spring) or September-November (Fall)',
      visaRequired: false,
    },
    culturalTips: [
      'Remove shoes when entering homes and some traditional venues',
      'Bow when greeting; deeper bow shows more respect',
      'Tipping is not customary and can be considered rude',
      'Use both hands when giving or receiving items',
      'Slurp your noodles - it\'s a compliment to the chef',
      'Be quiet on public transportation',
      'Queue patiently and don\'t push',
      'Tattoos may restrict entry to hot springs and public baths',
    ],
    emergencyContacts: {
      police: '110',
      ambulance: '119',
      embassy: '+81-3-3224-5000 (US Embassy)',
    },
  },
};

export const travelInfoService = {
  /**
   * Get comprehensive travel information for a destination
   */
  async getTravelInfo(destination: string): Promise<TravelInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data if available, otherwise return generic data
    if (mockTravelInfo[destination]) {
      return mockTravelInfo[destination];
    }
    
    // Generic fallback data
    return {
      destination,
      howToReach: [
        {
          type: 'flight',
          name: 'International Flight',
          duration: 'Varies by origin',
          price: 'Check flight comparison sites',
          frequency: 'Check airline schedules',
          pros: ['Fastest option', 'Multiple airlines available'],
          cons: ['Can be expensive', 'Airport transfers needed'],
          icon: '✈️',
        },
      ],
      faqs: [
        {
          question: 'Do I need a visa?',
          answer: 'Check with the embassy or consulate of your destination country for specific visa requirements based on your nationality.',
          category: 'visa',
        },
        {
          question: 'What is the local currency?',
          answer: 'Check online resources for currency information and current exchange rates.',
          category: 'currency',
        },
      ],
      history: [
        {
          title: 'Destination History',
          description: 'This destination has a rich cultural heritage. Research online for detailed historical information.',
          highlights: ['Unique local culture', 'Historical landmarks', 'Cultural traditions'],
        },
      ],
      quickFacts: {
        population: 'Check online resources',
        language: ['Local language'],
        currency: 'Local currency',
        timezone: 'Check timezone databases',
        bestTimeToVisit: 'Varies by climate and events',
        visaRequired: true,
      },
      culturalTips: [
        'Research local customs before traveling',
        'Learn basic phrases in the local language',
        'Respect local traditions and dress codes',
        'Be aware of local laws and regulations',
      ],
      emergencyContacts: {
        police: 'Check local emergency numbers',
        ambulance: 'Check local emergency numbers',
        embassy: 'Contact your embassy before traveling',
      },
    };
  },

  /**
   * Get only FAQs for quick reference
   */
  async getFAQs(destination: string): Promise<FAQ[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const info = await this.getTravelInfo(destination);
    return info.faqs;
  },

  /**
   * Get only transportation options
   */
  async getTransportOptions(destination: string): Promise<TransportOption[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const info = await this.getTravelInfo(destination);
    return info.howToReach;
  },
};
