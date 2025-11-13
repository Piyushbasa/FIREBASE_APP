'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

export type Post = {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Timestamp;
};

export function ForumPost({ post }: { post: Post }) {

  const timeAgo = post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <Card className="bg-card/50">
        <CardHeader className="p-4">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base">{post.authorName}</CardTitle>
                    <CardDescription className="text-xs">{timeAgo}</CardDescription>
                </div>
            </div>
        </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground/90">{post.content}</p>
      </CardContent>
    </Card>
  );
}
