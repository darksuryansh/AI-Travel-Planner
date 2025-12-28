import { motion } from 'motion/react';
import { Clock, MapPin, DollarSign, Tag, ChevronRight, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ActivityCardProps {
  activity: {
    time: string;
    title: string;
    description: string;
    location: string;
    category: string;
    estimatedCost: number;
    rating?: number;
    image?: string;
  };
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  food: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  sightseeing: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  culture: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  adventure: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  shopping: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  relaxation: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const categoryStyle = categoryColors[activity.category.toLowerCase()] || categoryColors.sightseeing;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Image (if provided) */}
      {activity.image && (
        <div className="relative h-32 overflow-hidden">
          <ImageWithFallback
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Time Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
            <Clock className="size-3 text-white" />
            <span className="text-xs text-white">{activity.time}</span>
          </div>

          {/* Rating */}
          {activity.rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500 rounded-full">
              <Star className="size-3 text-white fill-white" />
              <span className="text-xs text-white">{activity.rating}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Time (if no image) */}
        {!activity.image && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Clock className="size-4" />
            <span>{activity.time}</span>
          </div>
        )}

        {/* Title */}
        <h4 className="text-slate-900 dark:text-white mb-2 pr-6">
          {activity.title}
        </h4>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {activity.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="size-3" />
            <span className="line-clamp-1">{activity.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <DollarSign className="size-3" />
            <span>${activity.estimatedCost}</span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
            <Tag className="size-3" />
            <span className="capitalize">{activity.category}</span>
          </div>

          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 3 }}
          >
            <ChevronRight className="size-5 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/50 rounded-xl pointer-events-none transition-colors"
      />
    </motion.div>
  );
}
