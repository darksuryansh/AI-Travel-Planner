import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plane, Train, Bus, Car, HelpCircle, BookOpen, Phone, AlertTriangle, Info } from 'lucide-react';
import { travelInfoService, type TravelInfo as TravelInfoType } from '../services/travelInfoService';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface TravelInfoProps {
  destination: string;
}

export default function TravelInfo({ destination }: TravelInfoProps) {
  const [info, setInfo] = useState<TravelInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfo();
  }, [destination]);

  const loadInfo = async () => {
    setLoading(true);
    try {
      const data = await travelInfoService.getTravelInfo(destination);
      setInfo(data);
    } catch (error) {
      console.error('Failed to load travel info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="size-5" />;
      case 'train':
        return <Train className="size-5" />;
      case 'bus':
        return <Bus className="size-5" />;
      case 'car':
        return <Car className="size-5" />;
      default:
        return <Plane className="size-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      visa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      currency: 'bg-green-500/20 text-green-400 border-green-500/30',
      language: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      safety: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      customs: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      general: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  if (!info) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border">
        <p className="text-muted-foreground">Unable to load travel information</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Tabs defaultValue="transport" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-muted/50">
          <TabsTrigger value="transport" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Plane className="size-4 mr-2" />
            Transport
          </TabsTrigger>
          <TabsTrigger value="faqs" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <HelpCircle className="size-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <BookOpen className="size-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="essentials" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Info className="size-4 mr-2" />
            Essentials
          </TabsTrigger>
        </TabsList>

        {/* Transport Options */}
        <TabsContent value="transport" className="space-y-3 mt-4">
          <h3 className="text-foreground">How to Reach {destination}</h3>
          {info.howToReach.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-border hover:border-yellow-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                    {getTransportIcon(option.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-foreground">{option.name}</h4>
                      <span className="text-2xl">{option.icon}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="text-foreground">{option.duration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="text-foreground">{option.price}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Frequency:</span>
                        <p className="text-foreground">{option.frequency}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-400 mb-1">✓ Pros:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {option.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-red-400 mb-1">✗ Cons:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {option.cons.map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* FAQs */}
        <TabsContent value="faqs" className="space-y-3 mt-4">
          <h3 className="text-foreground mb-3">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {info.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-none"
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur border-border">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className={`${getCategoryColor(faq.category)} shrink-0`}>
                        {faq.category}
                      </Badge>
                      <span className="text-sm text-foreground">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-3 mt-4">
          <h3 className="text-foreground mb-3">History & Culture</h3>
          {info.history.map((period, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-border">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <BookOpen className="size-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground">{period.title}</h4>
                    {period.era && (
                      <Badge variant="outline" className="mt-1 border-yellow-500/30 text-yellow-400">
                        {period.era}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{period.description}</p>
                <div className="space-y-1">
                  {period.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p className="text-xs text-muted-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Essentials */}
        <TabsContent value="essentials" className="space-y-3 mt-4">
          {/* Quick Facts */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border">
            <h4 className="text-foreground mb-3">Quick Facts</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Population</span>
                <p className="text-foreground">{info.quickFacts.population}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Currency</span>
                <p className="text-foreground">{info.quickFacts.currency}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Languages</span>
                <p className="text-foreground">{info.quickFacts.language.join(', ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timezone</span>
                <p className="text-foreground">{info.quickFacts.timezone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Best Time to Visit</span>
                <p className="text-foreground">{info.quickFacts.bestTimeToVisit}</p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Visa Required</span>
                  <Badge className={info.quickFacts.visaRequired ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                    {info.quickFacts.visaRequired ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Cultural Tips */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border">
            <h4 className="text-foreground mb-3">Cultural Tips</h4>
            <div className="space-y-2">
              {info.culturalTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Emergency Contacts */}
          <Card className="p-4 bg-red-500/10 backdrop-blur border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="size-5 text-red-400" />
              <h4 className="text-foreground">Emergency Contacts</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Police</span>
                <a href={`tel:${info.emergencyContacts.police}`} className="text-red-400 hover:text-red-300">
                  {info.emergencyContacts.police}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ambulance</span>
                <a href={`tel:${info.emergencyContacts.ambulance}`} className="text-red-400 hover:text-red-300">
                  {info.emergencyContacts.ambulance}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Embassy</span>
                <a href={`tel:${info.emergencyContacts.embassy}`} className="text-red-400 hover:text-red-300">
                  {info.emergencyContacts.embassy}
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}