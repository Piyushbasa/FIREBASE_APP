'use client';
import { useEffect, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type UserProfile = {
  email: string;
  location?: string;
  language?: string;
};

export function LanguageSelector() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [language, setLanguage] = useState('English');
  
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (userProfile?.language) {
      setLanguage(userProfile.language);
    }
  }, [userProfile]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (!user || !firestore || !userProfileRef) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to change your language.',
        });
        return;
    }
    
    setDocumentNonBlocking(userProfileRef, { language: newLanguage }, { merge: true });
    toast({
        title: 'Language Updated',
        description: `Your preferred language is now ${newLanguage}.`,
    });
  };

  if (!user) return null;

  return (
    <div className="p-2">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <SelectValue placeholder="Select language" />
            </div>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
            <SelectItem value="Odia">Odia (ଓଡ଼ିଆ)</SelectItem>
            <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
            <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
