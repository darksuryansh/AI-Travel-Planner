import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { ChevronLeft, Save, Share2, Download, MapPin, Calendar, DollarSign, Sparkles, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import ActivityCard from './ActivityCard';
import MapView from './MapView';
import ExploreSidebar from './ExploreSidebar';
import WeatherWidget from './WeatherWidget';
import TravelInfo from './TravelInfo';
import LocationPhotos from './LocationPhotos';
import AccommodationSuggestions from './AccommodationSuggestions';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import type { GooglePlace } from '../services/googleMapsService';

interface CommandCenterProps {
  itinerary: any;
  onReset: () => void;
}

export default function CommandCenter({ itinerary, onReset }: CommandCenterProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(1);
  const [itineraryData, setItineraryData] = useState(itinerary);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug logging
  console.log('🎨 CommandCenter received itinerary:', {
    title: itineraryData?.title,
    destination: itineraryData?.destination,
    daysCount: itineraryData?.days?.length,
    hasEstimatedCost: !!itineraryData?.estimatedCost,
  });

  // Add safety check
  if (!itineraryData || !itineraryData.days || itineraryData.days.length === 0) {
    console.error('❌ Invalid itinerary data:', itineraryData);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Unable to display itinerary</h2>
          <p className="text-gray-400 mb-6">The itinerary data is invalid or incomplete.</p>
          <Button onClick={onReset} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('Itinerary saved to your trips!');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  const handleDownload = () => {
    toast.success('Downloading itinerary as PDF...');
  };

  // Handle adding a place to the itinerary
  const handleAddToItinerary = (place: GooglePlace, day: number) => {
    const newActivity = {
      time: '',
      title: place.name,
      description: place.vicinity || 'Added from suggestions',
      location: place.vicinity || '',
      category: place.category,
      estimatedCost: 0,
      rating: place.rating,
      image: place.photoUrl,
      source: 'GOOGLE_SEARCH',
      placeId: place.placeId,
    };

    const updatedDays = itineraryData.days.map((d: any) => {
      if (d.day === day) {
        return {
          ...d,
          activities: [...d.activities, newActivity],
        };
      }
      return d;
    });

    setItineraryData({
      ...itineraryData,
      days: updatedDays,
    });

    toast.success(`Added ${place.name} to Day ${day}`);
  };

  // Get current day location for explore sidebar
  const currentDayLocation = useMemo(() => {
    if (!selectedDay) return null;
    const day = itineraryData.days.find((d: any) => d.day === selectedDay);
    if (!day || day.activities.length === 0) return { lat: 35.6762, lng: 139.6503 }; // Default Tokyo
    
    // Use first activity location (in real app, parse from location string)
    return { lat: 35.6762 + (selectedDay * 0.01), lng: 139.6503 + (selectedDay * 0.01) };
  }, [selectedDay, itineraryData]);

  // Generate map markers
  const mapMarkers = useMemo(() => {
    const markers: any[] = [];
    itineraryData.days.forEach((day: any) => {
      day.activities.forEach((activity: any, index: number) => {
        markers.push({
          id: `day-${day.day}-activity-${index}`,
          position: { lat: 35.6762 + (day.day * 0.01), lng: 139.6503 + (day.day * 0.01) },
          title: activity.title,
          type: 'itinerary',
          category: activity.category,
          day: day.day,
        });
      });
    });
    return markers;
  }, [itineraryData]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-yellow-500/10"
      >
        <div className="max-w-[1920px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={onReset}
              className="group text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
            >
              <ChevronLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              New Trip
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Save className="size-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleShare}
                size="sm"
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Share2 className="size-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Download className="size-4 mr-2" />
                Export
              </Button>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="lg:hidden border-yellow-500/30">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-card border-yellow-500/20">
                  <ExploreSidebar
                    selectedDay={selectedDay}
                    dayLocation={currentDayLocation}
                    onAddToItinerary={handleAddToItinerary}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Trip Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-2">
                <Sparkles className="size-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">AI Generated</span>
              </div>
              <h1 className="text-3xl text-white mb-2">{itineraryData.title}</h1>
              <p className="text-neutral-400 text-sm">{itineraryData.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur border border-border rounded-lg">
                <MapPin className="size-4 text-yellow-400" />
                <span className="text-sm text-foreground">{itineraryData.destination}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur border border-border rounded-lg">
                <Calendar className="size-4 text-yellow-400" />
                <span className="text-sm text-foreground">{itineraryData.duration} Days</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur border border-border rounded-lg">
                <DollarSign className="size-4 text-yellow-400" />
                <span className="text-sm text-foreground">
                  {typeof itineraryData.estimatedCost === 'number' 
                    ? `$${itineraryData.estimatedCost}`
                    : itineraryData.estimatedCost?.min && itineraryData.estimatedCost?.max
                    ? `$${itineraryData.estimatedCost.min}-${itineraryData.estimatedCost.max}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">
        {/* LEFT PANEL: Itinerary Editor (30%) */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-[30%] border-r border-yellow-500/10 overflow-y-auto"
        >
          <div className="p-4 space-y-3">
            {itineraryData.days.map((day: any) => (
              <Card
                key={day.day}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedDay === day.day
                    ? 'border-yellow-500 ring-2 ring-yellow-500/20'
                    : 'border-border hover:border-yellow-500/50'
                }`}
                onClick={() => setSelectedDay(day.day)}
              >
                {/* Day Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                  <h3 className="text-black">Day {day.day}</h3>
                  <p className="text-black/80 text-sm">{day.theme}</p>
                </div>

                {/* Activities */}
                <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                  {day.activities.map((activity: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-start gap-2">
                        {activity.time && (
                          <span className="text-yellow-400 text-xs mt-0.5 shrink-0">{activity.time}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground truncate">{activity.title}</p>
                          <p className="text-muted-foreground text-xs truncate">{activity.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CENTER PANEL: Interactive Map (40%) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block lg:w-[40%] relative"
        >
          <MapView
            markers={mapMarkers}
            center={currentDayLocation || undefined}
          />
        </motion.div>

        {/* RIGHT PANEL: Explore & Services Hub (30%) */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block lg:w-[30%] overflow-y-auto"
        >
          <Tabs defaultValue="explore" className="h-full">
            <div className="sticky top-0 z-10 bg-card/50 backdrop-blur-xl border-b border-border">
              <TabsList className="w-full grid grid-cols-4 bg-transparent">
                <TabsTrigger value="explore" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                  Explore
                </TabsTrigger>
                <TabsTrigger value="weather" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                  Weather
                </TabsTrigger>
                <TabsTrigger value="photos" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                  Info
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="explore" className="h-full m-0 p-0">
              <ExploreSidebar
                selectedDay={selectedDay}
                dayLocation={currentDayLocation}
                onAddToItinerary={handleAddToItinerary}
              />
            </TabsContent>

            <TabsContent value="weather" className="p-4">
              <WeatherWidget location={itineraryData.destination} />
            </TabsContent>

            <TabsContent value="photos" className="p-4">
              <LocationPhotos
                location={itineraryData.destination}
                title="Popular Places to Visit"
              />
            </TabsContent>

            <TabsContent value="info" className="p-4">
              <TravelInfo destination={itineraryData.destination} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}