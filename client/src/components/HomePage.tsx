import { useState } from 'react';
import { motion } from 'motion/react';
import HeroSection from './HeroSection';
import CommandCenter from './CommandCenter';
import LoadingOverlay from './LoadingOverlay';
import { mockApiService } from '../services/mockApi';
import { toast } from 'sonner';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerateItinerary = async (input: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      const result = await mockApiService.generateItinerary(input);
      setItinerary(result);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate itinerary');
      console.error(error);
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