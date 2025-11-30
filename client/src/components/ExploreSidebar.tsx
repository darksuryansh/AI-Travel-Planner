import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Hotel, PartyPopper, Camera, ShoppingBag, Car, MapPin, Plus, Star, Loader2, Search } from 'lucide-react';
import { googleMapsService, categoryMapper, type GooglePlace } from '../services/googleMapsService';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

interface ExploreSidebarProps {
  selectedDay: number | null;
  dayLocation: { lat: number; lng: number } | null;
  onAddToItinerary: (place: GooglePlace, day: number) => void;
}

type Category = 'stays' | 'fun' | 'sightseeing' | 'shopping' | 'transport';

export default function ExploreSidebar({ selectedDay, dayLocation, onAddToItinerary }: ExploreSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('sightseeing');
  const [places, setPlaces] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null);

  useEffect(() => {
    if (dayLocation) {
      loadPlaces(activeCategory);
    }
  }, [activeCategory, dayLocation]);

  const loadPlaces = async (category: Category) => {
    if (!dayLocation) return;
    
    setLoading(true);
    try {
      const placeTypes = categoryMapper[category];
      const results = await googleMapsService.searchNearby(dayLocation, placeTypes);
      setPlaces(results);
    } catch (error) {
      console.error('Failed to load places:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = (place: GooglePlace) => {
    if (!selectedDay) {
      toast.error('Please select a day first');
      return;
    }
    onAddToItinerary(place, selectedDay);
    toast.success(`Added ${place.name} to Day ${selectedDay}`);
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'stays':
        return <Hotel className="size-4" />;
      case 'fun':
        return <PartyPopper className="size-4" />;
      case 'sightseeing':
        return <Camera className="size-4" />;
      case 'shopping':
        return <ShoppingBag className="size-4" />;
      case 'transport':
        return <Car className="size-4" />;
    }
  };

  const getPriceLevelIndicator = (level?: number) => {
    if (!level) return null;
    return '💰'.repeat(level);
  };

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-xl border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-foreground mb-1">Explore & Services</h3>
        <p className="text-xs text-muted-foreground">
          {selectedDay ? `Finding places near Day ${selectedDay}` : 'Select a day to explore'}
        </p>
      </div>

      {/* Empty State */}
      {!selectedDay || !dayLocation ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <MapPin className="size-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Select a day from your itinerary to discover nearby places
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)} className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-5 gap-1 p-2 bg-transparent">
              <TabsTrigger value="sightseeing" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Camera className="size-4" />
                <span className="text-[10px]">Sights</span>
              </TabsTrigger>
              <TabsTrigger value="stays" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Hotel className="size-4" />
                <span className="text-[10px]">Stays</span>
              </TabsTrigger>
              <TabsTrigger value="fun" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <PartyPopper className="size-4" />
                <span className="text-[10px]">Fun</span>
              </TabsTrigger>
              <TabsTrigger value="shopping" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <ShoppingBag className="size-4" />
                <span className="text-[10px]">Shop</span>
              </TabsTrigger>
              <TabsTrigger value="transport" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Car className="size-4" />
                <span className="text-[10px]">Move</span>
              </TabsTrigger>
            </TabsList>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-3 bg-card/50">
                      <Skeleton className="h-32 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </Card>
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No places found nearby</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {places.map((place) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      layout
                    >
                      <Card className="overflow-hidden bg-card/50 backdrop-blur border-border hover:border-yellow-500/30 transition-all group">
                        {/* Photo */}
                        {place.photoUrl && (
                          <div className="relative h-32 overflow-hidden">
                            <img
                              src={place.photoUrl}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Status Badge */}
                            {place.openNow !== undefined && (
                              <Badge
                                className={`absolute top-2 right-2 ${
                                  place.openNow
                                    ? 'bg-green-500/90 text-white'
                                    : 'bg-red-500/90 text-white'
                                }`}
                              >
                                {place.openNow ? 'Open' : 'Closed'}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-foreground truncate">{place.name}</h4>
                              {place.vicinity && (
                                <p className="text-xs text-muted-foreground truncate">{place.vicinity}</p>
                              )}
                            </div>
                          </div>

                          {/* Rating & Price */}
                          <div className="flex items-center gap-3 mb-3">
                            {place.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="size-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-foreground">{place.rating}</span>
                              </div>
                            )}
                            {place.priceLevel && (
                              <span className="text-xs">{getPriceLevelIndicator(place.priceLevel)}</span>
                            )}
                          </div>

                          {/* Add Button */}
                          <Button
                            onClick={() => handleAddPlace(place)}
                            size="sm"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                          >
                            <Plus className="size-3 mr-1" />
                            Add to Day {selectedDay}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
}
