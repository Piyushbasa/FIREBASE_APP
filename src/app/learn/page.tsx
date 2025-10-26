'use client';
import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sprout, Landmark, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const learningTopics = [
    {
        title: 'Modern Crop Management',
        description: 'Learn about advanced techniques for improving crop yield and health.',
        icon: Sprout,
        href: 'https://www.youtube.com/results?search_query=modern+crop+management+for+indian+farmers',
    },
    {
        title: 'Soil Health & Nutrition',
        description: 'Understand the importance of soil health and how to maintain it.',
        icon: BookOpen,
        href: 'https://www.youtube.com/results?search_query=soil+health+and+nutrition+for+indian+farmers',
    },
    {
        title: 'Government Schemes & Subsidies',
        description: 'Find information on the latest government schemes for farmers.',
        icon: Landmark,
        href: 'https://www.youtube.com/results?search_query=government+schemes+for+indian+farmers',
    },
    {
        title: 'Pest and Disease Control',
        description: 'Effective and sustainable methods to protect your crops.',
        icon: Sprout,
        href: 'https://www.youtube.com/results?search_query=pest+and+disease+control+for+indian+farmers',
    },
    {
        title: 'Water Management',
        description: 'Learn about efficient irrigation techniques to save water.',
        icon: BookOpen,
        href: 'https://www.youtube.com/results?search_query=water+management+for+indian+farmers',
    }
]

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(youtubeSearchUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-4">Learning Center</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for farming videos on YouTube..."
              className="flex-1"
            />
            <Button type="submit">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {learningTopics.map((topic, index) => (
                <Link href={topic.href} key={index} target="_blank" rel="noopener noreferrer">
                    <Card className="h-full hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <topic.icon className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{topic.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
