
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
    phone: '+919876543210'
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
    phone: '+919876543211'
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
    phone: '+919876543212'
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
    phone: '+919876543213'
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
    phone: '+919876543214'
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
    phone: '+919876543215'
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
    phone: '+919876543216'
  },
  {
    id: '8',
    name: 'Kubota MU4501',
    type: 'Tractor',
    dealer: 'Kubota Partners',
    location: 'Bengaluru, Karnataka',
    hourlyRate: 850,
    imageUrl: 'https://picsum.photos/seed/kubota/600/400',
    imageHint: 'Kubota tractor',
    features: ['Front Loader Work', 'Tillage', 'Spraying'],
    phone: '+919876543217'
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
    phone: '+919876543218'
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
    phone: '+919876543219'
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
    phone: '+919876543220'
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
    phone: '+919876543221'
  },
  {
    id: '13',
    name: 'Solis 5015 E',
    type: 'Tractor',
    dealer: 'Solis Yanmar Rentals',
    location: 'Lucknow, Uttar Pradesh',
    hourlyRate: 770,
    imageUrl: 'https://picsum.photos/seed/solis5015/600/400',
    imageHint: 'Solis tractor',
    features: ['Tillage', 'Spraying', 'Hauling'],
    phone: '+919876543222'
  },
  {
    id: '14',
    name: 'Mahindra JIVO 245 DI',
    type: 'Tractor',
    dealer: 'Hindustan Tractors',
    location: 'Indore, Madhya Pradesh',
    hourlyRate: 650,
    imageUrl: 'https://picsum.photos/seed/jivo245/600/400',
    imageHint: 'small Mahindra tractor',
    features: ['Orchard Spraying', 'Inter-culture', 'Vineyard work'],
    phone: '+919876543223'
  },
  {
    id: '15',
    name: 'John Deere 5310',
    type: 'Tractor',
    dealer: 'Deccan Agri',
    location: 'Hyderabad, Telangana',
    hourlyRate: 900,
    imageUrl: 'https://picsum.photos/seed/jd5310/600/400',
    imageHint: 'large John Deere tractor',
    features: ['Puddling', 'Heavy Haulage', 'Laser Leveling'],
    phone: '+919876543224'
  },
  {
    id: '16',
    name: 'Kartar 4000 Harvester',
    type: 'Harvester',
    dealer: 'Kartar Agro',
    location: 'Bhatinda, Punjab',
    hourlyRate: 3000,
    imageUrl: 'https://picsum.photos/seed/kartar4000/600/400',
    imageHint: 'Kartar harvester',
    features: ['Multi-crop harvesting', 'GPS enabled', 'High capacity'],
    phone: '+919876543225'
  },
  {
    id: '17',
    name: 'LEMKEN Plough',
    type: 'Plough',
    dealer: 'German Agro Tech',
    location: 'Ahmedabad, Gujarat',
    hourlyRate: 450,
    imageUrl: 'https://picsum.photos/seed/lemken/600/400',
    imageHint: 'reversible plough',
    features: ['Deep Ploughing', 'Reversible', 'Heavy-duty'],
    phone: '+919876543226'
  },
  {
    id: '18',
    name: 'Jain Drip Irrigation System',
    type: 'Irrigation',
    dealer: 'Jain Irrigation Systems',
    location: 'Jalgaon, Maharashtra',
    hourlyRate: 1200,
    imageUrl: 'https://picsum.photos/seed/jaindrip/600/400',
    imageHint: 'drip irrigation system',
    features: ['Water saving', 'Automated', 'Fertigation capable'],
    phone: '+919876543227'
  },
  {
    id: '19',
    name: 'VST Shakti 130DI',
    type: 'Tiller',
    dealer: 'VST Tillers & Tractors',
    location: 'Coimbatore, Tamil Nadu',
    hourlyRate: 550,
    imageUrl: 'https://picsum.photos/seed/vst130/600/400',
    imageHint: 'power tiller',
    features: ['Wetland Puddling', 'Dryland Cultivation', 'Compact'],
    phone: '+919876543228'
  },
  {
    id: '20',
    name: 'Swaraj 963 FE',
    type: 'Tractor',
    dealer: 'Punjab Motors',
    location: 'Chandigarh, Punjab',
    hourlyRate: 950,
    imageUrl: 'https://picsum.photos/seed/swaraj963/600/400',
    imageHint: 'large Swaraj tractor',
    features: ['Heavy Implements', 'Comfortable', 'Powerful'],
    phone: '+919876543229'
  },
  {
    id: '21',
    name: 'Force Balwan 500',
    type: 'Tractor',
    dealer: 'Balwan Tractors',
    location: 'Jodhpur, Rajasthan',
    hourlyRate: 720,
    imageUrl: 'https://picsum.photos/seed/balwan500/600/400',
    imageHint: 'Force tractor',
    features: ['Fuel Efficient', 'Hauling', 'Cultivation'],
    phone: '+919876543230'
  },
  {
    id: '22',
    name: 'Mahindra Rice Transplanter',
    type: 'Transplanter',
    dealer: 'Krishna Services',
    location: 'Vijayawada, Andhra Pradesh',
    hourlyRate: 1800,
    imageUrl: 'https://picsum.photos/seed/ricetrp/600/400',
    imageHint: 'rice transplanter machine',
    features: ['Paddy planting', 'Labor saving', 'High speed'],
    phone: '+919876543231'
  },
  {
    id: '23',
    name: 'TAFE 5900 DI',
    type: 'Tractor',
    dealer: 'TAFE Rentals',
    location: 'Chennai, Tamil Nadu',
    hourlyRate: 830,
    imageUrl: 'https://picsum.photos/seed/tafe5900/600/400',
    imageHint: 'TAFE tractor',
    features: ['Puddling Specialist', 'Rotavating', 'Heavy Duty'],
    phone: '+919876543232'
  },
  {
    id: '24',
    name: 'Dasmesh 912 Harvester',
    type: 'Harvester',
    dealer: 'Dasmesh Mechanical Works',
    location: 'Ambala, Haryana',
    hourlyRate: 2600,
    imageUrl: 'https://picsum.photos/seed/dasmesh912/600/400',
    imageHint: 'Dasmesh harvester',
    features: ['Wheat harvesting', 'Paddy harvesting', 'Reliable'],
    phone: '+919876543233'
  },
  {
    id: '25',
    name: 'New Holland TD5.90',
    type: 'Tractor',
    dealer: 'Capital Tractors',
    location: 'New Delhi, Delhi',
    hourlyRate: 880,
    imageUrl: 'https://picsum.photos/seed/nhtd590/600/400',
    imageHint: 'blue New Holland tractor',
    features: ['Loader work', 'Baling', 'Mowing'],
    phone: '+919876543234'
  },
  {
    id: '26',
    name: 'Agristar Power Sprayer',
    type: 'Sprayer',
    dealer: 'Agri Solutions',
    location: 'Guwahati, Assam',
    hourlyRate: 400,
    imageUrl: 'https://picsum.photos/seed/agrisprayer/600/400',
    imageHint: 'power sprayer farm',
    features: ['Pesticide Spraying', 'Foliar application', 'High pressure'],
    phone: '+919876543235'
  },
  {
    id: '27',
    name: 'Massey Ferguson 241',
    type: 'Tractor',
    dealer: 'MF Tractor World',
    location: 'Mysuru, Karnataka',
    hourlyRate: 800,
    imageUrl: 'https://picsum.photos/seed/mf241/600/400',
    imageHint: 'Massey Ferguson tractor',
    features: ['Cultivation', 'Haulage', 'Reliable'],
    phone: '+919876543236'
  },
  {
    id: '28',
    name: 'Landforce Rotavator',
    type: 'Tiller',
    dealer: 'National Agro',
    location: 'Kanpur, Uttar Pradesh',
    hourlyRate: 520,
    imageUrl: 'https://picsum.photos/seed/landforce/600/400',
    imageHint: 'tractor rotavator',
    features: ['Seedbed preparation', 'Heavy duty', 'Multi-speed'],
    phone: '+919876543237'
  },
  {
    id: '29',
    name: 'Mahindra Novo 755 DI',
    type: 'Tractor',
    dealer: 'Bihar Farm Equip',
    location: 'Patna, Bihar',
    hourlyRate: 920,
    imageUrl: 'https://picsum.photos/seed/novo755/600/400',
    imageHint: 'red Mahindra tractor',
    features: ['Heavy implements', 'Advanced hydraulics', '4WD'],
    phone: '+919876543238'
  },
  {
    id: '30',
    name: 'Shrachi SF 15 DI',
    type: 'Tiller',
    dealer: 'Eastern Agro',
    location: 'Kolkata, West Bengal',
    hourlyRate: 500,
    imageUrl: 'https://picsum.photos/seed/shrachi/600/400',
    imageHint: 'walking tiller',
    features: ['Small farms', 'Easy maneuverability', 'Fuel efficient'],
    phone: '+919876543239'
  },
  {
    id: '31',
    name: 'Powertrac Euro 50',
    type: 'Tractor',
    dealer: 'Ranchi Tractors',
    location: 'Ranchi, Jharkhand',
    hourlyRate: 810,
    imageUrl: 'https://picsum.photos/seed/powertrac50/600/400',
    imageHint: 'Powertrac tractor',
    features: ['Cultivation', 'Puddling', 'Hauling'],
    phone: '+919876543240'
  },
  {
    id: '32',
    name: 'John Deere 3028EN',
    type: 'Tractor',
    dealer: 'Chotanagpur Agri',
    location: 'Hazaribagh, Jharkhand',
    hourlyRate: 700,
    imageUrl: 'https://picsum.photos/seed/jd3028en/600/400',
    imageHint: 'small John Deere tractor',
    features: ['Orchard work', 'Inter-cultivation', 'Compact'],
    phone: '+919876543241'
  },
  {
    id: '33',
    name: 'KisanKraft Tiller',
    type: 'Tiller',
    dealer: 'Jharkhand Farm Solutions',
    location: 'Dhanbad, Jharkhand',
    hourlyRate: 480,
    imageUrl: 'https://picsum.photos/seed/kisankraft/600/400',
    imageHint: 'power tiller small',
    features: ['Weeding', 'Soil turning', 'Lightweight'],
    phone: '+919876543242'
  },
  {
    id: '34',
    name: 'Captain 250 DI',
    type: 'Tractor',
    dealer: 'Odisha Farm Tech',
    location: 'Sambalpur, Odisha',
    hourlyRate: 680,
    imageUrl: 'https://picsum.photos/seed/captain250/600/400',
    imageHint: 'mini tractor',
    features: ['Small plots', 'Spraying', 'Hauling'],
    phone: '+919876543243'
  },
  {
    id: '35',
    name: 'Fieldking Tandem Disc Harrow',
    type: 'Harrow',
    dealer: 'Kalinga Agro',
    location: 'Berhampur, Odisha',
    hourlyRate: 400,
    imageUrl: 'https://picsum.photos/seed/fieldking/600/400',
    imageHint: 'disc harrow attachment',
    features: ['Ploughing', 'Soil breaking', 'Weed removal'],
    phone: '+919876543244'
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

    