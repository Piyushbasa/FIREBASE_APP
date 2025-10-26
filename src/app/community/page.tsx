import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const posts = [
  {
    id: 1,
    author: {
      name: 'Ramesh Kumar',
      avatarUrl: 'https://picsum.photos/seed/1/40/40',
      initials: 'RK',
    },
    content: 'The monsoon is late this year in Maharashtra. Has anyone started sowing yet? I am worried about my cotton crop.',
    likes: 12,
    comments: 4,
    time: '2h ago',
  },
  {
    id: 2,
    author: {
      name: 'Sunita Devi',
      avatarUrl: 'https://picsum.photos/seed/2/40/40',
      initials: 'SD',
    },
    content: 'Has anyone used the new fertilizer subsidy scheme? I need some information on how to apply for it in Punjab.',
    likes: 25,
    comments: 8,
    time: '5h ago',
  },
    {
    id: 3,
    author: {
      name: 'Arjun Singh',
      avatarUrl: 'https://picsum.photos/seed/3/40/40',
      initials: 'AS',
    },
    content: 'Good news! The local mandi prices for wheat have increased by 5%. Finally a good day for us farmers in Uttar Pradesh.',
    likes: 45,
    comments: 15,
    time: '1d ago',
  },
];


export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Community Hub</h1>
            <Button>New Post</Button>
          </div>
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                            <AvatarFallback>{post.author.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{post.author.name}</CardTitle>
                            <CardDescription>{post.time}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-start gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MessageSquare className="w-4 h-4" /> {post.comments}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
