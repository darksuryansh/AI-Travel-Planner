import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Trash2, Eye, Download, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { getAllItineraries, deleteItinerary } from '../services/itineraryService';
import LoadingOverlay from './LoadingOverlay';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function TripDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('⏳ Auth is still loading...');
        return;
      }

      // Check if user is logged in
      if (!user) {
        console.log('⚠️ No user logged in, redirecting to login');
        toast.error('Please login to view your trips');
        navigate('/login');
        return;
      }

      try {
        console.log('📥 Fetching trips for user:', user.email);
        setLoading(true);
        const data = await getAllItineraries();
        console.log('✅ Trips fetched:', data.length);
        setTrips(data);
        
        if (data.length === 0) {
          toast.info('No trips yet. Create your first itinerary!');
        }
      } catch (error: any) {
        console.error('❌ Error loading trips:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          toast.error('Please login again');
          navigate('/login');
        } else {
          toast.error(error.message || 'Failed to load trips');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user, authLoading, navigate]);

  const handleDeleteTrip = async (id: string) => {
    try {
      await deleteItinerary(id);
      setTrips(trips.filter(trip => trip.id !== id));
      toast.success('Trip deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete trip');
      console.error('Error deleting trip:', error);
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('🔍 Trips data:', trips);
  console.log('🔍 Filtered trips:', filteredTrips);
  console.log('🔍 Search query:', searchQuery);

  // Calculate real stats from trips data
  const totalDays = trips.reduce((sum, trip) => sum + (trip.duration || 0), 0);
  const uniqueCountries = new Set(trips.map(trip => trip.destination?.split(',')[1]?.trim() || trip.destination)).size;

  // Show loading while auth or trips are loading
  if (authLoading || loading) {
    console.log('🔄 Dashboard Loading - authLoading:', authLoading, 'loading:', loading);
    return <LoadingOverlay />;
  }

  // User is not logged in (after auth finished loading)
  if (!user) {
    console.log('❌ No user found after auth loaded');
    return null; // Will redirect via useEffect
  }

  console.log('✅ Rendering dashboard with', trips.length, 'trips');

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                My Trips
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and explore your travel itineraries
              </p>
            </div>

            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                <Plus className="size-4 mr-2" />
                Create New Trip
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations, trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total Trips', value: trips.length, color: 'from-blue-500 to-indigo-600' },
            { label: 'Destinations', value: uniqueCountries, color: 'from-purple-500 to-pink-600' },
            { label: 'Days Traveled', value: totalDays, color: 'from-amber-500 to-orange-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className={`inline-block px-4 py-2 bg-gradient-to-r ${stat.color} rounded-xl mb-3`}>
                <span className="text-2xl text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Image/Gradient Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="opacity-20"
                  >
                    <MapPin className="size-24 text-white" />
                  </motion.div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <span className="text-xs text-white">{trip.duration} days</span>
                  </div>
                  {trip.isPublic && (
                    <div className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/30">
                      <Globe className="size-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl mb-2 text-slate-900 dark:text-white">
                  {trip.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="size-4" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="size-4" />
                    <span>
                      {trip.duration} days • ₹
                      {trip.estimatedCost?.min || trip.estimatedCost || 0}-
                      {trip.estimatedCost?.max || trip.estimatedCost || 0}
                    </span>
                  </div>
                  {trip.budget && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">
                        {trip.budget}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link to={`/itinerary/${trip.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group/btn"
                    >
                      <Eye className="size-4 mr-2 group-hover/btn:text-blue-600" />
                      View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    <Trash2 className="size-4 hover:text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Hover Border Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/50 rounded-2xl pointer-events-none transition-colors"
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-12 border border-slate-200/50 dark:border-slate-700/50">
              <MapPin className="size-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-2">No trips found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Try adjusting your search or create a new trip
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus className="size-4 mr-2" />
                  Create New Trip
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
