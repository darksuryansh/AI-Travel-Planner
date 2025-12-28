import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, LayoutDashboard, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Plane className="size-5 text-white" />
              </div>
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                IntelliTrek
              </span>
              <Sparkles className="size-4 text-amber-500 animate-pulse" />
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="relative group flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <LayoutDashboard className="size-4" />
              <span>My Trips</span>
              {location.pathname === '/dashboard' && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"
                />
              )}
            </Link>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {theme === 'light' ? (
                  <Moon className="size-5 text-slate-700" />
                ) : (
                  <Sun className="size-5 text-amber-400" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
