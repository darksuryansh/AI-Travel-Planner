import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Hotel, Star, MapPin, Plus, DollarSign } from 'lucide-react';
import { googleMapsService, type GooglePlace } from '../services/googleMapsService';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

interface AccommodationSuggestionsProps {
  location: { lat: number; lng: number };
  dayNumber: number;
  onAddToItinerary: (place: GooglePlace) => void;
}

export default function AccommodationSuggestions({
  location,
  dayNumber,
  onAddToItinerary,
}: AccommodationSuggestionsProps) {
  const [accommodations, setAccommodations] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccommodations();
  }, [location]);

  const loadAccommodations = async () => {
    setLoading(true);
    try {
      const results = await googleMapsService.searchNearby(location, 'lodging', 2000);
      // Sort by rating
      const sorted = results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setAccommodations(sorted.slice(0, 3)); // Top 3
    } catch (error) {
      console.error('Failed to load accommodations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (place: GooglePlace) => {
    onAddToItinerary(place);
    toast.success(`${place.name} added as accommodation for Day ${dayNumber}`);
  };

  const getPriceLevelText = (level?: number) => {
    if (!level) return 'Price not available';
    const labels = ['Budget', 'Moderate', 'Upscale', 'Luxury'];
    return labels[level - 1] || 'Moderate';
  };

  if (loading) {
    return (
      <Card className="p-4 bg-card/50 backdrop-blur-xl border-border">
        <div className="flex items-center gap-2 mb-3">
          <Hotel className="size-5 text-yellow-400" />
          <h4 className="text-foreground">End of Day {dayNumber} - Where to Stay</h4>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (accommodations.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Hotel className="size-5 text-blue-400" />
        <div className="flex-1">
          <h4 className="text-foreground">End of Day {dayNumber} - Where to Stay</h4>
          <p className="text-xs text-muted-foreground">Recommended accommodations nearby</p>
        </div>
      </div>

      <div className="space-y-2">
        {accommodations.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 bg-card/70 backdrop-blur border-border hover:border-blue-500/50 transition-all">
              <div className="flex gap-3">
                {/* Photo */}
                {place.photoUrl && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={place.photoUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1">
                        <Badge className="text-[10px] py-0 bg-yellow-500 text-black">
                          Top Pick
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm text-foreground truncate">{place.name}</h5>
                  </div>

                  {place.vicinity && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="size-3" />
                      <span className="truncate">{place.vicinity}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-foreground">{place.rating}</span>
                      </div>
                    )}
                    {place.priceLevel && (
                      <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-400">
                        {getPriceLevelText(place.priceLevel)}
                      </Badge>
                    )}
                    {place.openNow !== undefined && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          place.openNow
                            ? 'border-green-500/30 text-green-400'
                            : 'border-red-500/30 text-red-400'
                        }`}
                      >
                        {place.openNow ? 'Available' : 'Call'}
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAdd(place)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs"
                  >
                    <Plus className="size-3 mr-1" />
                    Add to Day {dayNumber}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        💡 Tip: Book accommodations near your last activity of the day
      </p>
    </Card>
  );
}
