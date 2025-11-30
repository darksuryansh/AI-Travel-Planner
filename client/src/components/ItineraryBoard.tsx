import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, Save, Share2, Download, Edit3, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';
import ActivityCard from './ActivityCard';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ItineraryBoardProps {
  itinerary: any;
  onReset: () => void;
}

export default function ItineraryBoard({ itinerary, onReset }: ItineraryBoardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleSave = () => {
    toast.success('Itinerary saved to your trips!');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  const handleDownload = () => {
    toast.success('Downloading itinerary as PDF...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onReset}
            className="mb-4 group"
          >
            <ChevronLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Start New Trip
          </Button>

          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-full border border-amber-500/20 mb-4"
                >
                  <Sparkles className="size-3 text-amber-500" />
                  <span className="text-xs text-amber-600 dark:text-amber-400">AI Generated</span>
                </motion.div>

                <h1 className="text-4xl mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {itinerary.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {itinerary.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">{itinerary.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm text-indigo-700 dark:text-indigo-300">{itinerary.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <DollarSign className="size-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-700 dark:text-amber-300">${itinerary.estimatedCost}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                >
                  <Save className="size-4 mr-2" />
                  Save Trip
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 lg:flex-none"
                >
                  <Share2 className="size-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 lg:flex-none"
                >
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="relative">
          {/* Desktop: Horizontal Scroll */}
          <div className="hidden lg:block overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {itinerary.days.map((day: any, dayIndex: number) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                  className="w-96 flex-shrink-0"
                >
                  {/* Day Column */}
                  <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-lg">Day {day.day}</h3>
                          <p className="text-blue-100 text-sm">{day.theme}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <Edit3 className="size-4 text-white" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                      {day.activities.map((activity: any, activityIndex: number) => (
                        <motion.div
                          key={activityIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: dayIndex * 0.1 + activityIndex * 0.05 }}
                        >
                          <ActivityCard activity={activity} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Stack */}
          <div className="lg:hidden space-y-6">
            {itinerary.days.map((day: any, dayIndex: number) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
              >
                {/* Day Header */}
                <button
                  onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                  className="w-full backdrop-blur-xl bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-xl mb-1">Day {day.day}</h3>
                      <p className="text-blue-100">{day.theme}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/80 text-sm">{day.activities.length} activities</span>
                      <motion.div
                        animate={{ rotate: selectedDay === day.day ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronLeft className="size-5 text-white rotate-[-90deg]" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                {/* Activities (Expandable) */}
                <motion.div
                  initial={false}
                  animate={{
                    height: selectedDay === day.day ? 'auto' : 0,
                    opacity: selectedDay === day.day ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3">
                    {day.activities.map((activity: any, activityIndex: number) => (
                      <ActivityCard key={activityIndex} activity={activity} />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
