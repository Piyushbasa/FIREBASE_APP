'use client';
import { Header } from '@/components/dashboard/header';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';
import { useUser } from '@/firebase';
import { useDoc } from '@/firebase';
import { doc, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';

type UserProfile = {
  location?: string;
}

export default function MarketPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <CommodityPrices defaultLocation={userProfile?.location} />
        </div>
      </main>
    </div>
  );
}
