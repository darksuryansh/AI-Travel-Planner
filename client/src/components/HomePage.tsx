import { useState } from 'react';
import { motion } from 'motion/react';
import HeroSection from './HeroSection';
import ItineraryBoard from './ItineraryBoard';
import LoadingOverlay from './LoadingOverlay';
import { generateItinerary, getItineraryById } from '../services/itineraryService';
import { toast } from 'sonner';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerateItinerary = async (input: any) => {
    setLoading(true);
    toast.info('🤖 AI is crafting your perfect itinerary... This may take up to 2 minutes.');
    
    try {
      console.log('🚀 Starting itinerary generation...');
      const result = await generateItinerary(input);
      console.log('✅ Generation complete:', result);
      
      // If saved to Firebase, fetch it by ID to ensure consistency
      if (result.saved && result.itineraryId) {
        console.log('📥 Fetching saved itinerary from Firebase:', result.itineraryId);
        toast.info('📥 Loading your saved itinerary...');
        const savedItinerary = await getItineraryById(result.itineraryId);
        setItinerary(savedItinerary);
        toast.success('🎉 Itinerary generated and saved!');
      } else {
        // Not logged in - just show the generated data
        setItinerary(result.itinerary);
        toast.success('🎉 Itinerary generated! Login to save it.');
      }
    } catch (error: any) {
      console.error('❌ Generation failed:', error);
      toast.error(error.message || 'Failed to generate itinerary');
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
        >
          <ItineraryBoard itinerary={itinerary} onReset={() => setItinerary(null)} />
        </motion.div>
      )}
    </div>
  );
}
