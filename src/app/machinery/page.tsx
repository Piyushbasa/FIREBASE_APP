
'use client';

import * as React from 'react';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MachineryList, UserMachinery } from '@/components/machinery/MachineryList';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';

// Simulated data for machinery rental
const allMachinery: UserMachinery[] = [
  {
    id: '1',
    name: 'John Deere 5050D',
    type: 'Tractor',
    dealer: 'Gupta Tractors',
    location: 'Pune, Maharashtra',
    hourlyRate: 800,
    imageUrl: 'https://picsum.photos/seed/jd5050d/600/400',
    imageHint: 'John Deere tractor',
    features: ['Tillage', 'Hauling', 'Seeding'],
  },
  {
    id: '2',
    name: 'Mahindra Arjun 555',
    type: 'Tractor',
    dealer: 'Patel Farm Equipments',
    location: 'Bhubaneswar, Odisha',
    hourlyRate: 750,
    imageUrl: 'https://picsum.photos/seed/mahindra555/600/400',
    imageHint: 'Mahindra tractor',
    features: ['Plowing', 'Rotavating', 'Transport'],
  },
  {
    id: '3',
    name: 'Claas Dominator 150',
    type: 'Harvester',
    dealer: 'Modern Agro Solutions',
    location: 'Ludhiana, Punjab',
    hourlyRate: 2500,
    imageUrl: 'https://picsum.photos/seed/claas150/600/400',
    imageHint: 'combine harvester',
    features: ['Grain Harvesting', 'Threshing', 'Cleaning'],
  },
  {
    id: '4',
    name: 'Shaktiman Rotary Tiller',
    type: 'Tiller',
    dealer: 'Shakti Equipments',
    location: 'Nashik, Maharashtra',
    hourlyRate: 500,
    imageUrl: 'https://picsum.photos/seed/shaktiman/600/400',
    imageHint: 'rotary tiller',
    features: ['Soil Preparation', 'Weed Control'],
  },
  {
    id: '5',
    name: 'Maschio Gaspardo Seeder',
    type: 'Seeder',
    dealer: 'Agro-Tech India',
    location: 'Hisar, Haryana',
    hourlyRate: 600,
    imageUrl: 'https://picsum.photos/seed/gaspardo/600/400',
    imageHint: 'seed drill',
    features: ['Precision Sowing', 'Fertilizer Drilling'],
  },
  {
    id: '6',
    name: 'Swaraj 744 FE',
    type: 'Tractor',
    dealer: 'Swaraj Rentals',
    location: 'Cuttack, Odisha',
    hourlyRate: 780,
    imageUrl: 'https://picsum.photos/seed/swaraj744/600/400',
    imageHint: 'Swaraj tractor',
    features: ['Puddling', 'Hauling', 'Mowing'],
  },
  {
    id: '7',
    name: 'New Holland 3630 TX',
    type: 'Tractor',
    dealer: 'Holland Rent-a-Farm',
    location: 'Jaipur, Rajasthan',
    hourlyRate: 820,
    imageUrl: 'https://picsum.photos/seed/newholland/600/400',
    imageHint: 'New Holland tractor',
    features: ['Heavy Haulage', 'Plowing', 'Baling'],
  },
  {
    id: '8',
    name: 'Kubota MU4501',
    type: 'Tractor',
    dealer: 'Kubota Partners',
    location: 'Bangalore, Karnataka',
    hourlyRate: 850,
    imageUrl: 'https://picsum.photos/seed/kubota/600/400',
    imageHint: 'Kubota tractor',
    features: ['Front Loader Work', 'Tillage', 'Spraying'],
  },
  {
    id: '9',
    name: 'John Deere W70',
    type: 'Harvester',
    dealer: 'Punjab Harvesters',
    location: 'Amritsar, Punjab',
    hourlyRate: 2800,
    imageUrl: 'https://picsum.photos/seed/jdw70/600/400',
    imageHint: 'John Deere harvester',
    features: ['Paddy Harvesting', 'Wheat Harvesting'],
  },
  {
    id: '10',
    name: 'Preet 955',
    type: 'Tractor',
    dealer: 'Preet Agro Industries',
    location: 'Patiala, Punjab',
    hourlyRate: 810,
    imageUrl: 'https://picsum.photos/seed/preet955/600/400',
    imageHint: 'Preet tractor',
    features: ['Cultivation', 'Sowing', 'Threshing'],
  },
  {
    id: '11',
    name: 'Farmtrac 60',
    type: 'Tractor',
    dealer: 'Escorts Agri Machinery',
    location: 'Faridabad, Haryana',
    hourlyRate: 790,
    imageUrl: 'https://picsum.photos/seed/farmtrac60/600/400',
    imageHint: 'Farmtrac tractor',
    features: ['Plowing', 'Hauling', 'Rotavating'],
  },
  {
    id: '12',
    name: 'JCB 3DX Backhoe Loader',
    type: 'Loader',
    dealer: 'JCB Rentals India',
    location: 'Mumbai, Maharashtra',
    hourlyRate: 1500,
    imageUrl: 'https://picsum.photos/seed/jcb3dx/600/400',
    imageHint: 'JCB backhoe loader',
    features: ['Digging', 'Loading', 'Excavation'],
  }
];

type UserProfile = {
  location?: string;
};

export default function MachineryPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [machineryType, setMachineryType] = React.useState('All');
    
    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'userProfile', user.uid);
    }, [firestore, user]);

    const { data: userProfile } = useDoc<UserProfile>(userProfileRef);
    const [location, setLocation] = React.useState(userProfile?.location || '');

    React.useEffect(() => {
        if(userProfile?.location) {
            setLocation(userProfile.location);
        }
    }, [userProfile]);

    const filteredMachinery = React.useMemo(() => {
        return allMachinery.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  item.dealer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = machineryType === 'All' || item.type === machineryType;
            const matchesLocation = !location || item.location.toLowerCase().includes(location.toLowerCase());

            return matchesSearch && matchesType && matchesLocation;
        });
    }, [searchTerm, machineryType, location]);

    const machineryTypes = ['All', ...new Set(allMachinery.map(item => item.type))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Farm Machinery Rental</CardTitle>
              <CardDescription>
                Find and rent modern farm equipment from providers near you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input 
                        placeholder="Search by name or dealer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Input 
                        placeholder="Enter your location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <Select value={machineryType} onValueChange={setMachineryType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            {machineryTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
          </Card>
          <MachineryList machinery={filteredMachinery} />
        </div>
      </main>
    </div>
  );
}

    
