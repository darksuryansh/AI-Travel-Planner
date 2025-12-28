import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import ItineraryBoard from './ItineraryBoard';
import { mockItineraryData } from '../services/mockApi';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ItineraryBoard
        itinerary={mockItineraryData}
        onReset={() => navigate('/dashboard')}
      />
    </motion.div>
  );
}
