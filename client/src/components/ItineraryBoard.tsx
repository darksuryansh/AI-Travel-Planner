import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, Download, Edit3, MapPin, Calendar, Lock, Globe, Trash2, Info, Plane, HelpCircle, Backpack, Sun, DollarSign, Camera, BookOpen, Languages, Compass } from 'lucide-react';
import ActivityCard from './ActivityCard';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { shareItinerary, deleteItinerary } from '../services/itineraryService';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ItineraryBoardProps {
  itinerary: any;
  onReset: () => void;
}

export default function ItineraryBoard({ itinerary, onReset }: ItineraryBoardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(itinerary?.isPublic || false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  console.log('🎨 ItineraryBoard received data:', itinerary);
  console.log('📅 Days data:', itinerary?.days);

  const handleShare = async () => {
    if (!itinerary?.id) {
      toast.error('Cannot share unsaved itinerary');
      return;
    }

    try {
      setIsSharing(true);
      const newPublicState = !isPublic;
      await shareItinerary(itinerary.id, newPublicState);
      setIsPublic(newPublicState);
      
      if (newPublicState) {
        const shareUrl = `${window.location.origin}/itinerary/${itinerary.id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Itinerary is now public! Link copied to clipboard.');
      } else {
        toast.success('Itinerary is now private.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update sharing settings');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    toast.success('Downloading itinerary as PDF...');
  };

  const handleDelete = async () => {
    if (!itinerary?.id) {
      toast.error('Cannot delete unsaved itinerary');
      return;
    }

    if (!confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteItinerary(itinerary.id);
      toast.success('Itinerary deleted successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete itinerary');
    } finally {
      setIsDeleting(false);
    }
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
                  <span className="text-xs text-amber-600 dark:text-amber-400">AI Generated</span>
                </motion.div>

                <h1 className="text-4xl mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {itinerary.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {itinerary.overview || itinerary.description}
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
                  {itinerary.estimatedCost && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                      <DollarSign className="size-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        {typeof itinerary.estimatedCost === 'object' 
                          ? `₹${itinerary.estimatedCost.min?.toLocaleString()} - ₹${itinerary.estimatedCost.max?.toLocaleString()}`
                          : `₹${itinerary.estimatedCost?.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}
                  {itinerary.budget && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <span className="text-sm text-green-700 dark:text-green-300 capitalize">{itinerary.budget}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2">
                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`flex-1 lg:flex-none ${
                    isPublic 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  } text-white shadow-lg`}
                >
                  {isPublic ? <Globe className="size-4 mr-2" /> : <Lock className="size-4 mr-2" />}
                  {isSharing ? 'Updating...' : isPublic ? 'Public' : 'Make Public'}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 lg:flex-none"
                >
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="outline"
                  className="flex-1 lg:flex-none hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 className="size-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Accordion type="multiple" className="space-y-4">
            {/* Best Time to Visit */}
            {itinerary.bestTimeToVisit && (
              <AccordionItem value="best-time" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Sun className="size-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-lg font-semibold">Best Time to Visit</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-slate-600 dark:text-slate-400">{itinerary.bestTimeToVisit}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Estimated Cost Breakdown */}
            {itinerary.estimatedCost && (
              <AccordionItem value="cost" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <DollarSign className="size-5 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold">Budget Breakdown</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Total Estimated Cost</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {typeof itinerary.estimatedCost === 'object'
                          ? `₹${itinerary.estimatedCost.min?.toLocaleString()} - ₹${itinerary.estimatedCost.max?.toLocaleString()}`
                          : `₹${itinerary.estimatedCost?.toLocaleString()}`
                        }
                      </span>
                    </div>
                    {typeof itinerary.estimatedCost === 'object' && itinerary.estimatedCost.breakdown && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {Object.entries(itinerary.estimatedCost.breakdown).map(([key, value]: [string, any]) => (
                          <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{key}</p>
                            <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">₹{typeof value === 'number' ? value.toLocaleString() : value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Destination Info */}
            {itinerary.destinationInfo && (
              <AccordionItem value="destination-info" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Info className="size-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-semibold">Destination Guide</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-6">
                    {/* History */}
                    {itinerary.destinationInfo.history && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" />
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">History</h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{itinerary.destinationInfo.history}</p>
                      </div>
                    )}

                    {/* Famous For */}
                    {itinerary.destinationInfo.famousFor && itinerary.destinationInfo.famousFor.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Compass className="size-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Famous For</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.destinationInfo.famousFor.map((item: string, index: number) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Language */}
                    {itinerary.destinationInfo.language && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Languages className="size-4 text-rose-600 dark:text-rose-400" />
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Language Guide</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          <strong>Primary:</strong> {itinerary.destinationInfo.language.primary}
                        </p>
                        {itinerary.destinationInfo.language.commonPhrases && (
                          <div className="grid md:grid-cols-2 gap-2 mt-2">
                            {itinerary.destinationInfo.language.commonPhrases.map((phrase: any, index: number) => (
                              <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{phrase.phrase}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">{phrase.local}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cultural Tips */}
                    {itinerary.destinationInfo.culturalTips && itinerary.destinationInfo.culturalTips.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Cultural Tips</h4>
                        <ul className="space-y-2">
                          {itinerary.destinationInfo.culturalTips.map((tip: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Photo Spots */}
                    {itinerary.destinationInfo.photoSpots && itinerary.destinationInfo.photoSpots.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Camera className="size-4 text-pink-600 dark:text-pink-400" />
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Best Photo Spots</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {itinerary.destinationInfo.photoSpots.map((spot: any, index: number) => (
                            <Card key={index}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{spot.name}</CardTitle>
                                <CardDescription className="text-xs">Best time: {spot.bestTime}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{spot.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Travel Information */}
            {itinerary.travelInfo && (
              <AccordionItem value="travel-info" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Plane className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-lg font-semibold">Travel Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-6">
                    {/* Visa Requirements */}
                    {itinerary.travelInfo.visaRequirements && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Visa Requirements</h4>
                        <p className="text-slate-600 dark:text-slate-400">{itinerary.travelInfo.visaRequirements}</p>
                      </div>
                    )}

                    {/* Currency */}
                    {itinerary.travelInfo.currency && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Currency</h4>
                        <p className="text-slate-600 dark:text-slate-400">{itinerary.travelInfo.currency}</p>
                      </div>
                    )}

                    {/* How to Reach */}
                    {itinerary.travelInfo.howToReach && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">How to Reach</h4>
                        
                        {/* By Flight */}
                        {itinerary.travelInfo.howToReach.byFlight && (
                          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">✈️ By Flight</h5>
                            {itinerary.travelInfo.howToReach.byFlight.airports && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                <strong>Airports:</strong> {itinerary.travelInfo.howToReach.byFlight.airports.join(', ')}
                              </p>
                            )}
                            {itinerary.travelInfo.howToReach.byFlight.averageFlightTime && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                <strong>Average Flight Time:</strong> {itinerary.travelInfo.howToReach.byFlight.averageFlightTime}
                              </p>
                            )}
                            {itinerary.travelInfo.howToReach.byFlight.bestAirlines && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <strong>Airlines:</strong> {itinerary.travelInfo.howToReach.byFlight.bestAirlines.join(', ')}
                              </p>
                            )}
                          </div>
                        )}

                        {/* By Train */}
                        {itinerary.travelInfo.howToReach.byTrain && (
                          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">🚂 By Train</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.travelInfo.howToReach.byTrain}</p>
                          </div>
                        )}

                        {/* By Bus */}
                        {itinerary.travelInfo.howToReach.byBus && (
                          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">🚌 By Bus</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.travelInfo.howToReach.byBus}</p>
                          </div>
                        )}

                        {/* By Road */}
                        {itinerary.travelInfo.howToReach.byRoad && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">🚗 By Road</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.travelInfo.howToReach.byRoad}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Local Transport */}
                    {itinerary.travelInfo.localTransport && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Local Transport</h4>
                        <div className="space-y-3">
                          {itinerary.travelInfo.localTransport.publicTransport && (
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Public Transport:</p>
                              <div className="flex flex-wrap gap-2">
                                {itinerary.travelInfo.localTransport.publicTransport.map((transport: string, index: number) => (
                                  <Badge key={index} variant="outline">{transport}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {itinerary.travelInfo.localTransport.rentalOptions && (
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Rental Options:</p>
                              <div className="flex flex-wrap gap-2">
                                {itinerary.travelInfo.localTransport.rentalOptions.map((option: string, index: number) => (
                                  <Badge key={index} variant="outline">{option}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {itinerary.travelInfo.localTransport.taxiApps && (
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Taxi Apps:</p>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                {itinerary.travelInfo.localTransport.taxiApps.map((app: string, index: number) => (
                                  <li key={index}>• {app}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Packing List */}
            {itinerary.packingList && itinerary.packingList.length > 0 && (
              <AccordionItem value="packing" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Backpack className="size-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-lg font-semibold">Packing List</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid md:grid-cols-2 gap-2">
                    {itinerary.packingList.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="size-2 rounded-full bg-orange-600 dark:bg-orange-400"></div>
                        <span className="text-slate-600 dark:text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* FAQs */}
            {itinerary.faqs && itinerary.faqs.length > 0 && (
              <AccordionItem value="faqs" className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="size-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-lg font-semibold">Frequently Asked Questions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    {itinerary.faqs.map((faq: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{faq.question}</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
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
                          <ActivityCard activity={activity} destination={itinerary.destination} />
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
                      <ActivityCard key={activityIndex} activity={activity} destination={itinerary.destination} />
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
