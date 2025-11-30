import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Camera, Maximize2, X } from 'lucide-react';
import { googleMapsService, type PlacePhoto } from '../services/googleMapsService';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface LocationPhotosProps {
  location: string;
  title?: string;
}

export default function LocationPhotos({ location, title }: LocationPhotosProps) {
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PlacePhoto | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [location]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const data = await googleMapsService.getLocationPhotos(location);
      setPhotos(data);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-card/50 backdrop-blur-xl border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="size-5 text-yellow-400" />
          <h3 className="text-foreground">{title || 'Popular Photos'}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4 bg-card/50 backdrop-blur-xl border-border">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="size-5 text-yellow-400" />
          <h3 className="text-foreground">{title || 'Popular Photos'}</h3>
          <span className="text-xs text-muted-foreground">({photos.length})</span>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="size-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No photos available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer aspect-video overflow-hidden rounded-lg"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={`${location} photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-black/50 backdrop-blur-sm rounded-full">
                    <Maximize2 className="size-5 text-white" />
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded">
                      Featured
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click any photo to view fullscreen
          </p>
        )}
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-yellow-500/20">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur hover:bg-black/70 text-white"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="size-4" />
            </Button>
            {selectedPhoto && (
              <div className="relative">
                <img
                  src={selectedPhoto.url}
                  alt="Full size"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white/70">{selectedPhoto.attribution}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
