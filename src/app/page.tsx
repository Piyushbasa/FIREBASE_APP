
'use client';
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

type UserProfile = {
  location?: string;
  language?: string;
}

export default function Home() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <CityData defaultCity={userProfile?.location} userLanguage={userProfile?.language} />
                <PlantHealthCard userLanguage={userProfile?.language} />
              </div>
              <div className="space-y-4">
                <CropSuggestionCard defaultLocation={userProfile?.location} userLanguage={userProfile?.language} />
                <SunTimesCard />
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
