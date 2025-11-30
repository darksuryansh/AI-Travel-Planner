import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles, MapPin, Calendar, DollarSign, Heart, Wand2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface HeroSectionProps {
  onGenerate: (input: any) => void;
}

const interestChips = [
  { icon: '🍷', label: 'Wine & Dine', value: 'wine' },
  { icon: '⛰️', label: 'Hiking', value: 'hiking' },
  { icon: '🍣', label: 'Sushi', value: 'sushi' },
  { icon: '🏖️', label: 'Beach', value: 'beach' },
  { icon: '🎨', label: 'Art & Culture', value: 'art' },
  { icon: '🏛️', label: 'History', value: 'history' },
  { icon: '🎭', label: 'Entertainment', value: 'entertainment' },
  { icon: '🧘', label: 'Wellness', value: 'wellness' },
];

export default function HeroSection({ onGenerate }: HeroSectionProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showStructuredForm, setShowStructuredForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    budget: '',
    interests: [] as string[],
  });

  // Simulated voice recognition
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info('🎤 Voice input activated');
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        setInput('I want to visit Tokyo for 5 days with a budget of $3000, interested in sushi and temples');
        setIsListening(false);
        toast.success('Voice captured!');
      }, 2000);
    }
  };

  const handleMagicParse = async () => {
    if (!input.trim()) {
      toast.error('Please enter your travel plans');
      return;
    }

    const loadingToast = toast.loading('🤖 AI parsing your intent...');
    
    try {
      // Call real backend API
      const { apiService } = await import('../services/api');
      const response = await apiService.parseIntent(input);
      
      const parsed = {
        destination: response.data.destination,
        duration: response.data.duration.toString(),
        budget: response.data.budget,
        interests: response.data.interests,
      };

      setFormData(parsed);
      setSelectedInterests(parsed.interests);
      setShowStructuredForm(true);
      toast.dismiss(loadingToast);
      
      if (response.cached) {
        toast.success('✨ Intent parsed (cached)!');
      } else {
        toast.success('✨ Intent parsed successfully!');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to parse intent');
      console.error('Intent parsing error:', error);
    }
  };

  const handleGenerate = () => {
    // Validate required fields
    if (!input.trim() && !formData.destination) {
      toast.error('Please enter your travel plans or fill in the destination');
      return;
    }
    
    // Ensure we have at least destination and duration
    const destination = formData.destination || 'Paris, France';
    const duration = formData.duration || '7';
    const budget = formData.budget || 'moderate';
    
    const finalData = {
      destination,
      duration,
      budget,
      interests: selectedInterests.length > 0 ? selectedInterests : ['sightseeing'],
      rawInput: input,
    };
    
    console.log('📤 Sending to parent:', finalData);
    onGenerate(finalData);
  };

  const toggleInterest = (value: string) => {
    setSelectedInterests(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
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
            <Sparkles className="size-4 text-amber-500" />
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
              Let AI craft your perfect journey
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Speak naturally or type freely. Our AI understands your travel dreams and creates personalized itineraries in seconds.
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
            <div className="flex items-start gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoiceInput}
                className={`relative p-4 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Mic className="size-6 text-white" />
                </motion.div>
                {isListening && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-red-500/30"
                  />
                )}
              </motion.button>

              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me about your dream trip... (e.g., 'A week in Italy with amazing food and wine, budget around $2500')"
                  className="min-h-[120px] text-lg border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <Button
                onClick={handleMagicParse}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all"
                size="lg"
              >
                <Wand2 className="size-5 mr-2" />
                Magic Auto-Fill
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={!input.trim() && selectedInterests.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
                size="lg"
              >
                Generate Itinerary
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </div>

            {/* Interest Chips */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Heart className="size-4" />
                <span>Quick Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {interestChips.map((chip, index) => (
                  <motion.button
                    key={chip.value}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(chip.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedInterests.includes(chip.value)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-1">{chip.icon}</span>
                    {chip.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Structured Form (After Auto-Fill) */}
            <AnimatePresence>
              {showStructuredForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="size-4" />
                        Destination
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="size-4" />
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <DollarSign className="size-4" />
                        Budget ($)
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
