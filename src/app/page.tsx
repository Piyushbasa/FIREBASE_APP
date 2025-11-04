
'use client';
import { useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { CropSuggestionCard } from '@/components/dashboard/crop-suggestion-card';
import { CityData } from '@/components/dashboard/city-data';
import { PlantHealthCard } from '@/components/dashboard/plant-health-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';
import { useUser } from '@/firebase';
import { useDoc } from '@/firebase';
import { doc, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LiveFieldMonitorPreview } from '@/components/dashboard/live-field-monitor-preview';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type UserProfile = {
  location?: string;
  language?: string;
}

export default function Home() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    // Only ask for location if the user is loaded and doesn't have a location set.
    if (user && !isProfileLoading && !userProfile?.location) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use a free reverse geocoding API to get city from coordinates
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village;
            
            if (city && userProfileRef) {
               setDocumentNonBlocking(userProfileRef, { location: city }, { merge: true });
               toast({
                 title: "Location Saved",
                 description: `Your location has been set to ${city}.`
               });
            }
          } catch (error) {
            console.error("Error fetching city from coordinates:", error);
            toast({
              variant: 'destructive',
              title: "Could not fetch city",
              description: "We couldn't determine your city from your location."
            });
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
             console.log("User denied location access.");
             // Optionally, inform the user that they can set their location manually in their profile.
             toast({
                 title: "Location Access Denied",
                 description: "You can set your location manually in your profile for a personalized experience.",
                 duration: 5000,
             });
          }
        }
      );
    }
  }, [user, userProfile, isProfileLoading, firestore, toast, userProfileRef]);

  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <CityData defaultCity={userProfile?.location} userLanguage={userProfile?.language} />
                <SunTimesCard />
                <LiveFieldMonitorPreview />
                <PlantHealthCard userLanguage={userProfile?.language} />
              </div>
              <div className="space-y-4">
                <CropSuggestionCard defaultLocation={userProfile?.location} userLanguage={userProfile?.language} />
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
