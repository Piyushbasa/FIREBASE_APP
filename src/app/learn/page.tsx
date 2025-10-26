import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sprout, Landmark } from 'lucide-react';
import Link from 'next/link';

const learningTopics = [
    {
        title: 'Modern Crop Management',
        description: 'Learn about advanced techniques for improving crop yield and health.',
        icon: Sprout,
        href: '#',
    },
    {
        title: 'Soil Health & Nutrition',
        description: 'Understand the importance of soil health and how to maintain it.',
        icon: BookOpen,
        href: '#',
    },
    {
        title: 'Government Schemes & Subsidies',
        description: 'Find information on the latest government schemes for farmers.',
        icon: Landmark,
        href: '#',
    },
    {
        title: 'Pest and Disease Control',
        description: 'Effective and sustainable methods to protect your crops.',
        icon: Sprout,
        href: '#',
    },
    {
        title: 'Water Management',
        description: 'Learn about efficient irrigation techniques to save water.',
        icon: BookOpen,
        href: '#',
    }
]

export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold mb-4">Learning Center</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {learningTopics.map((topic, index) => (
                <Link href={topic.href} key={index}>
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
