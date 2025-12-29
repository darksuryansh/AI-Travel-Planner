import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ItineraryBoard from './ItineraryBoard';
import LoadingOverlay from './LoadingOverlay';
import { getItineraryById } from '../services/itineraryService';
import { toast } from 'sonner';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!id) {
        toast.error('No itinerary ID provided');
        navigate('/dashboard');
        return;
      }

      try {
        console.log('📥 Fetching itinerary with ID:', id);
        setLoading(true);
        const data = await getItineraryById(id);
        console.log('✅ Itinerary loaded:', data);
        setItinerary(data);
      } catch (error: any) {
        console.error('❌ Error loading itinerary:', error);
        toast.error(error.message || 'Failed to load itinerary');
        console.error('Error loading itinerary:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id, navigate]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!itinerary) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ItineraryBoard
        itinerary={itinerary}
        onReset={() => navigate('/dashboard')}
      />
    </motion.div>
  );
}
