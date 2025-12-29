import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface HeroSectionProps {
  onGenerate: (input: any) => void;
}

export default function HeroSection({ onGenerate }: HeroSectionProps) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState('moderate');
  const [interests, setInterests] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Simulated voice recognition
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info('🎤 Voice input activated');
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        setDestination('Tokyo, Japan');
        setDuration(5);
        setBudget('moderate');
        setInterests(['food', 'culture', 'temples']);
        setIsListening(false);
        toast.success('Voice captured!');
      }, 2000);
    }
  };

  const handleGenerate = () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    const finalData = {
      destination: destination.trim(),
      duration: duration,
      budget: budget,
      interests: interests,
      travelStyle: 'moderate',
      accommodation: 'hotel'
    };
    
    console.log('📤 Sending data to API:', finalData);
    onGenerate(finalData);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-pink-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full border border-blue-500/20 mb-6"
          >
            {/* <Sparkles className="size-4 text-amber-500" /> */}
            <span className="text-sm text-slate-600 dark:text-slate-300">AI-Powered Travel Planning</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6">
            <span className="block bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Where to next?
            </span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="block text-3xl sm:text-4xl lg:text-5xl mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Let AI craft your perfect Journey
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
             Type freely. Our AI understands your travel dreams and creates personalized itineraries in seconds.
          </motion.p>
        </motion.div>

        {/* Magic Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-20" />
          
          <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/10">
            
            {/* Destination Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Where do you want to go?
              </label>
              <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <MapPin className="size-5 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. A Manali trip from delhi in 20000 INR"
                  className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Duration Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                How many days? ({duration} days)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Budget Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Budget
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['economy', 'moderate', 'luxury'].map((budgetOption) => (
                  <button
                    key={budgetOption}
                    onClick={() => setBudget(budgetOption)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      budget === budgetOption
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {budgetOption.charAt(0).toUpperCase() + budgetOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Interests (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {['culture', 'food', 'adventure', 'nature', 'shopping', 'nightlife', 'history'].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => {
                      if (interests.includes(interest)) {
                        setInterests(interests.filter(i => i !== interest));
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      interests.includes(interest)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Button
                onClick={handleGenerate}
                disabled={!destination.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all disabled:opacity-90"
                size="lg"
              >
                Generate Itinerary
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-600 dark:text-slate-400"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span>Powered by Google Gemini</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-blue-500" />
            <span>Live Data Grounding</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
