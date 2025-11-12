
'use client';
import { useMemoFirebase } from '@/firebase/provider';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useUser } from '@/firebase';
import { collection, orderBy, query, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { NewPostForm } from '@/components/community/NewPostForm';
import { ForumPost, Post } from '@/components/community/ForumPost';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';


export default function CommunityPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const postsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: posts, isLoading: isPostsLoading } = useCollection<Post>(postsQuery);

    const isLoading = isUserLoading || isPostsLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Ask questions, share your knowledge, and connect with other farmers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
              {!isLoading && (
                <>
                    {user ? (
                        <NewPostForm />
                    ) : (
                        <div className="text-center p-4 border rounded-lg bg-secondary/50">
                            <p className="text-muted-foreground mb-2">You must be logged in to create a post.</p>
                            <Link href="/login">
                                <Button>Login or Sign Up</Button>
                            </Link>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Recent Posts</h2>
                        {posts && posts.length > 0 ? (
                             <ScrollArea className="h-[calc(100vh-450px)]">
                                <div className="space-y-4 pr-4">
                                    {posts.map(post => (
                                        <ForumPost key={post.id} post={post} />
                                    ))}
                                </div>
                             </ScrollArea>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No posts yet. Be the first to start a conversation!</p>
                        )}
                    </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
