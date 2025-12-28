import { motion } from 'motion/react';
import { Plane, Globe2, MapPin, Sparkles } from 'lucide-react';

export default function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 dark:bg-slate-900/80"
    >
      <div className="relative">
        {/* Orbiting Globe */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative w-64 h-64"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30"
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe2 className="size-32 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Orbiting Plane */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50"
                />
                <Plane className="relative size-8 text-amber-500 rotate-90" />
              </div>
            </motion.div>
          </motion.div>

          {/* Map Pins */}
          {[0, 90, 180, 270].map((angle, index) => (
            <motion.div
              key={angle}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(120px) translateY(-50%)`,
              }}
            >
              <MapPin className="size-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div className="text-center mt-8">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="size-5 text-amber-500" />
            <span className="text-xl text-slate-700 dark:text-slate-300">Crafting your perfect itinerary</span>
            <Sparkles className="size-5 text-amber-500" />
          </motion.div>

          <div className="flex items-center justify-center gap-2">
            {['Analyzing preferences', 'Finding destinations', 'Optimizing routes'].map((text, index) => (
              <motion.span
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: index * 0.3,
                }}
                className="text-sm text-slate-500 dark:text-slate-400"
              >
                {text}
              </motion.span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
