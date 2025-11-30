import { useState } from 'react';
import { motion } from 'motion/react';
import HeroSection from './HeroSection';
import CommandCenter from './CommandCenter';
import LoadingOverlay from './LoadingOverlay';
import { apiService } from '../services/api';
import { toast } from 'sonner';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerateItinerary = async (input: any) => {
    setLoading(true);
    try {
      // Build request params - ensure correct types for validation
      const duration = parseInt(input.duration) || 7;
      
      // Normalize budget to backend expected values
      let budget = 'moderate';
      if (input.budget) {
        const budgetNum = parseFloat(input.budget);
        if (!isNaN(budgetNum)) {
          // Convert dollar amount to budget tier
          if (budgetNum < 1500) budget = 'economy';
          else if (budgetNum > 4000) budget = 'luxury';
          else budget = 'moderate';
        } else if (['economy', 'moderate', 'luxury'].includes(input.budget.toLowerCase())) {
          budget = input.budget.toLowerCase();
        }
      }

      const params = {
        destination: input.destination || 'Paris, France',
        duration: duration,
        budget: budget,
        interests: Array.isArray(input.interests) ? input.interests : [],
        travelStyle: 'moderate',
        accommodation: 'hotel',
        startDate: null
      };

      console.log('🚀 Generating itinerary with params:', params);
      const response = await apiService.generateItinerary(params);
      
      if (response.cached) {
        toast.success('✨ Retrieved itinerary from cache!');
      } else {
        toast.success('✨ Itinerary generated successfully!');
      }
      
      setItinerary(response.data);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate itinerary';
      toast.error(errorMessage);
      console.error('Itinerary generation error:', error);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('Response data:', error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {loading && <LoadingOverlay />}
      
      {!itinerary ? (
        <HeroSection onGenerate={handleGenerateItinerary} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-screen"
        >
          <CommandCenter itinerary={itinerary} onReset={() => setItinerary(null)} />
        </motion.div>
      )}
    </div>
  );
}