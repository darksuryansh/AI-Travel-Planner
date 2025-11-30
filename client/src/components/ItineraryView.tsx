import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import CommandCenter from './CommandCenter';
import { mockItineraryData } from '../services/mockApi';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col"
    >
      <CommandCenter
        itinerary={mockItineraryData}
        onReset={() => navigate('/dashboard')}
      />
    </motion.div>
  );
}