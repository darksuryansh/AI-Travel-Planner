// Mock API Service Layer - Simulates Backend Responses

export const mockItineraryData = {
  id: '1',
  title: 'Tokyo Culinary & Cultural Adventure',
  description: 'Experience the perfect blend of traditional Japanese culture and modern city life with a focus on authentic cuisine and historic temples.',
  destination: 'Tokyo, Japan',
  duration: 5,
  estimatedCost: 2800,
  days: [
    {
      day: 1,
      theme: 'Arrival & Shibuya Exploration',
      activities: [
        {
          time: '10:00 AM',
          title: 'Meiji Shrine Visit',
          description: 'Start your journey with a peaceful walk through this historic Shinto shrine surrounded by forest.',
          location: 'Yoyogi Park, Shibuya',
          category: 'culture',
          estimatedCost: 0,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800'
        },
        {
          time: '12:30 PM',
          title: 'Authentic Ramen Lunch',
          description: 'Try the famous Ichiran ramen in a unique solo dining booth experience.',
          location: 'Shibuya Station',
          category: 'food',
          estimatedCost: 15,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'
        },
        {
          time: '3:00 PM',
          title: 'Shibuya Crossing',
          description: 'Witness the world\'s busiest pedestrian crossing from the Starbucks viewing point.',
          location: 'Shibuya District',
          category: 'sightseeing',
          estimatedCost: 5,
          rating: 4.9
        },
        {
          time: '7:00 PM',
          title: 'Izakaya Dinner Experience',
          description: 'Enjoy traditional Japanese pub food and sake in the vibrant nightlife district.',
          location: 'Shibuya Yokocho',
          category: 'food',
          estimatedCost: 40,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
        }
      ]
    },
    {
      day: 2,
      theme: 'Traditional Asakusa & Sumo',
      activities: [
        {
          time: '9:00 AM',
          title: 'Senso-ji Temple',
          description: 'Visit Tokyo\'s oldest temple and explore Nakamise shopping street.',
          location: 'Asakusa',
          category: 'culture',
          estimatedCost: 0,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
        },
        {
          time: '11:30 AM',
          title: 'Traditional Tea Ceremony',
          description: 'Participate in an authentic Japanese tea ceremony with kimono experience.',
          location: 'Asakusa Culture Center',
          category: 'culture',
          estimatedCost: 50,
          rating: 4.8
        },
        {
          time: '1:30 PM',
          title: 'Sushi Making Class',
          description: 'Learn to make authentic sushi from a master chef.',
          location: 'Tsukiji Outer Market',
          category: 'food',
          estimatedCost: 120,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'
        },
        {
          time: '6:00 PM',
          title: 'Sumo Wrestling Tournament',
          description: 'Watch professional sumo wrestlers compete in this traditional Japanese sport.',
          location: 'Ryogoku Kokugikan',
          category: 'culture',
          estimatedCost: 80,
          rating: 4.7
        }
      ]
    },
    {
      day: 3,
      theme: 'Modern Tokyo - Harajuku & Roppongi',
      activities: [
        {
          time: '10:00 AM',
          title: 'Harajuku Fashion District',
          description: 'Explore the colorful streets filled with unique fashion boutiques and trendy cafes.',
          location: 'Harajuku, Shibuya',
          category: 'shopping',
          estimatedCost: 100,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800'
        },
        {
          time: '1:00 PM',
          title: 'Kawaii Monster Cafe',
          description: 'Experience a surreal dining experience in this pop-art themed restaurant.',
          location: 'Harajuku',
          category: 'food',
          estimatedCost: 35,
          rating: 4.5
        },
        {
          time: '3:30 PM',
          title: 'teamLab Borderless',
          description: 'Immerse yourself in digital art installations at this cutting-edge museum.',
          location: 'Azabudai Hills',
          category: 'culture',
          estimatedCost: 30,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800'
        },
        {
          time: '8:00 PM',
          title: 'Roppongi Hills Night View',
          description: 'Enjoy panoramic night views of Tokyo from the observation deck.',
          location: 'Roppongi',
          category: 'sightseeing',
          estimatedCost: 20,
          rating: 4.8
        }
      ]
    },
    {
      day: 4,
      theme: 'Day Trip to Mount Fuji',
      activities: [
        {
          time: '7:00 AM',
          title: 'Bullet Train to Kawaguchiko',
          description: 'Take the shinkansen and enjoy views of the countryside.',
          location: 'Tokyo Station',
          category: 'adventure',
          estimatedCost: 60,
          rating: 4.9
        },
        {
          time: '10:00 AM',
          title: 'Lake Kawaguchi Cruise',
          description: 'Enjoy stunning views of Mount Fuji from the lake.',
          location: 'Lake Kawaguchi',
          category: 'adventure',
          estimatedCost: 25,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800'
        },
        {
          time: '1:00 PM',
          title: 'Traditional Japanese Lunch',
          description: 'Savor local delicacies with Mount Fuji views.',
          location: 'Kawaguchiko',
          category: 'food',
          estimatedCost: 30,
          rating: 4.7
        },
        {
          time: '3:00 PM',
          title: 'Chureito Pagoda',
          description: 'Climb the iconic pagoda for the perfect postcard photo of Mount Fuji.',
          location: 'Fujiyoshida',
          category: 'sightseeing',
          estimatedCost: 5,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800'
        }
      ]
    },
    {
      day: 5,
      theme: 'Farewell & Shopping',
      activities: [
        {
          time: '9:00 AM',
          title: 'Tsukiji Outer Market',
          description: 'Final culinary adventure at Tokyo\'s famous fish market.',
          location: 'Tsukiji',
          category: 'food',
          estimatedCost: 40,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800'
        },
        {
          time: '11:30 AM',
          title: 'Ginza Shopping District',
          description: 'Browse luxury boutiques and department stores for souvenirs.',
          location: 'Ginza',
          category: 'shopping',
          estimatedCost: 150,
          rating: 4.7
        },
        {
          time: '2:00 PM',
          title: 'Relaxation at Oedo Onsen',
          description: 'Unwind in traditional hot springs before departure.',
          location: 'Odaiba',
          category: 'relaxation',
          estimatedCost: 45,
          rating: 4.6
        },
        {
          time: '6:00 PM',
          title: 'Farewell Dinner at Gonpachi',
          description: 'Final meal at the restaurant that inspired Kill Bill.',
          location: 'Nishi-Azabu',
          category: 'food',
          estimatedCost: 60,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
        }
      ]
    }
  ]
};

export const mockTrips = [
  {
    id: '1',
    title: 'Tokyo Culinary Adventure',
    destination: 'Tokyo, Japan',
    duration: '5 days',
    dates: 'Mar 15-20, 2024',
    status: 'Upcoming',
    gradient: 'from-pink-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
  },
  {
    id: '2',
    title: 'Italian Wine & History Tour',
    destination: 'Tuscany, Italy',
    duration: '7 days',
    dates: 'Apr 5-12, 2024',
    status: 'Planning',
    gradient: 'from-amber-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800'
  },
  {
    id: '3',
    title: 'Bali Wellness Retreat',
    destination: 'Ubud, Bali',
    duration: '10 days',
    dates: 'May 1-11, 2024',
    status: 'Saved',
    gradient: 'from-green-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  },
  {
    id: '4',
    title: 'New York City Explorer',
    destination: 'New York, USA',
    duration: '4 days',
    dates: 'Jan 10-14, 2024',
    status: 'Completed',
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'
  },
  {
    id: '5',
    title: 'Santorini Sunset Paradise',
    destination: 'Santorini, Greece',
    duration: '6 days',
    dates: 'Jun 20-26, 2024',
    status: 'Planning',
    gradient: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'
  },
  {
    id: '6',
    title: 'Moroccan Adventure',
    destination: 'Marrakech, Morocco',
    duration: '8 days',
    dates: 'Sep 5-13, 2024',
    status: 'Saved',
    gradient: 'from-orange-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800'
  }
];

// Mock API Service Functions
export const mockApiService = {
  async parseIntent(rawInput: string) {
    // Simulates Gemini API parsing natural language into structured data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      destination: 'Tokyo, Japan',
      duration: '5',
      budget: '3000',
      interests: ['sushi', 'temples', 'culture']
    };
  },

  async generateItinerary(input: any) {
    // Simulates Gemini API generating full itinerary
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return mockItineraryData;
  },

  async saveItinerary(itinerary: any) {
    // Simulates saving to Firestore
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { id: Date.now().toString(), ...itinerary };
  },

  async getUserTrips() {
    // Simulates fetching from Firestore
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockTrips;
  },

  async watchPrices(tripId: string) {
    // Simulates Kafka producer for price watching
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true, message: 'Price watch activated' };
  }
};

// Mock Redis Cache (would be on backend)
class MockRedisCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  async get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  async set(key: string, data: any, ttlSeconds: number = 604800) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  async delete(key: string) {
    this.cache.delete(key);
  }
}

export const mockRedis = new MockRedisCache();
