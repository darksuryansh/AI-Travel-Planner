import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  type: 'itinerary' | 'suggestion';
  category?: string;
  day?: number;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (marker: MapMarker) => void;
}

export default function MapView({ markers, center, onMarkerClick }: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapCenter, setMapCenter] = useState(center || { lat: 35.6762, lng: 139.6503 }); // Default to Tokyo

  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  const getMarkerColor = (type: 'itinerary' | 'suggestion') => {
    return type === 'itinerary' ? 'text-blue-500' : 'text-green-500';
  };

  const getMarkerBg = (type: 'itinerary' | 'suggestion') => {
    return type === 'itinerary' 
      ? 'bg-blue-500/20 border-blue-500' 
      : 'bg-green-500/20 border-green-500';
  };

  // Mock map visualization (replace with actual Google Maps integration)
  return (
    <Card className={`relative overflow-hidden bg-card/30 backdrop-blur-xl border-border ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'
    }`}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-card/90 backdrop-blur"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-3 bg-card/90 backdrop-blur border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              <span className="text-xs text-foreground">Itinerary Items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              <span className="text-xs text-foreground">Suggestions</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Mock Map Background */}
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Grid overlay to simulate map */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250, 204, 21, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250, 204, 21, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="size-4 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 size-8 -m-2 bg-yellow-400/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Markers */}
        <div className="absolute inset-0 p-8">
          {markers.map((marker, index) => {
            // Calculate position (mock positioning around center)
            const angle = (index / markers.length) * 2 * Math.PI;
            const radius = 100 + (index % 3) * 50;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;

            return (
              <motion.div
                key={marker.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                {/* Marker Pin */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <MapPin
                    className={`size-8 ${getMarkerColor(marker.type)} drop-shadow-lg`}
                    fill="currentColor"
                  />
                  {marker.day && (
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                      <span className="text-[10px] text-white font-semibold">
                        {marker.day}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Marker Label */}
                {selectedMarker?.id === marker.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48"
                  >
                    <Card className="p-3 bg-card/95 backdrop-blur border-border shadow-xl">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm text-foreground">{marker.title}</h4>
                          <Badge
                            variant="outline"
                            className={marker.type === 'itinerary' 
                              ? 'border-blue-500 text-blue-400' 
                              : 'border-green-500 text-green-400'
                            }
                          >
                            {marker.type === 'itinerary' ? 'Day ' + marker.day : 'New'}
                          </Badge>
                        </div>
                        {marker.category && (
                          <p className="text-xs text-muted-foreground capitalize">{marker.category}</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="size-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No locations to display</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add activities to see them on the map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <Card className="p-4 bg-card/95 backdrop-blur-xl border-border shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Badge
                  className={`mb-2 ${
                    selectedMarker.type === 'itinerary'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                      : 'bg-green-500/20 text-green-400 border-green-500'
                  }`}
                >
                  {selectedMarker.type === 'itinerary' ? `Day ${selectedMarker.day}` : 'Suggestion'}
                </Badge>
                <h3 className="text-foreground">{selectedMarker.title}</h3>
                {selectedMarker.category && (
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {selectedMarker.category}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedMarker(null)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
