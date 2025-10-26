'use client';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Landmark, Newspaper, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const resources = [
  {
    title: 'PM-KISAN Scheme',
    description: 'Official portal for the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme. Check your status and find information.',
    icon: Landmark,
    href: 'https://pmkisan.gov.in/',
    cta: 'Visit PM-KISAN Portal',
  },
  {
    title: 'Agri Coop Schemes',
    description: 'Explore various schemes from the Department of Agriculture & Farmers Welfare for cooperation and farmer welfare.',
    icon: Landmark,
    href: 'https://agricoop.nic.in/en/Schemes',
    cta: 'Explore Schemes',
  },
  {
    title: 'Farmers\' Development Initiatives',
    description: "Learn about the Indian government's vision and initiatives for agricultural growth and farmer development.",
    icon: Newspaper,
    href: 'https://www.india.gov.in/topics/agriculture',
    cta: 'Learn More',
  },
  {
    title: 'Ministry of Agriculture on X (Twitter)',
    description: 'Follow the official account of the Ministry of Agriculture & Farmers Welfare for the latest news and updates.',
    icon: () => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
    href: 'https://twitter.com/agrigoi',
    cta: 'Follow @agrigoi',
  },
];


export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Resources & Govt. Schemes</h1>
            <p className="text-muted-foreground">Stay updated with the latest information and government initiatives.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {resources.map((resource, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <resource.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end">
                    <Link href={resource.href} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full" variant="secondary">
                        {resource.cta}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
