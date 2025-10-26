'use client';
import { useState } from 'react';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { askAssistant } from '@/app/actions';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await askAssistant({ prompt: input });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages(prev => [...prev, assistantMessage]);
    } else if (result.data) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.data.response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex flex-col p-4 gap-4">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-180px)] p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="w-12 h-12 mb-2" />
                    <p className="text-lg font-medium">AI Assistant</p>
                    <p>Ask me about crop suggestions, market prices, or farming techniques.</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Bot size={20} />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg p-3 max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <Bot size={20} />
                        </div>
                        <div className="rounded-lg p-3 bg-muted flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your farming question..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}
