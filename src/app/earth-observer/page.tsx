
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Globe, Upload, Loader2, Image as ImageIcon, Sparkles, CheckCircle2, AlertTriangle, Droplets, Leaf } from 'lucide-react';
import { fetchSatelliteImageAnalysis } from '../actions';
import type { AnalyzeSatelliteImageOutput } from '@/ai/flows/analyze-satellite-image-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  cropType: z.string().optional(),
});

type UserProfile = {
  language?: string;
};

export default function EarthObserverPage() {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSatelliteImageOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfile', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropType: '' },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!uploadedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Provided',
        description: 'Please upload an image of your field to analyze.',
      });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await fetchSatelliteImageAnalysis({
      imageDataUri: uploadedImage,
      cropType: data.cropType,
      language: userProfile?.language || 'English',
    });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    } else {
      setAnalysisResult(result.data);
    }
    setIsLoading(false);
  };
  
  const defaultImage = PlaceHolderImages.find(p => p.id === 'uva-map');

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                AI Earth Observer
              </CardTitle>
              <CardDescription>
                Upload a satellite or drone image of your field for an in-depth AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="relative aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center">
                       {uploadedImage ? (
                        <Image src={uploadedImage} alt="Uploaded field" fill className="object-contain rounded-lg" />
                       ) : (
                        <div className="text-center text-muted-foreground p-4">
                          <ImageIcon className="mx-auto h-12 w-12" />
                          <p>Your image will appear here</p>
                        </div>
                       )}
                    </div>
                    <div className="space-y-4">
                       <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadedImage ? "Change Image" : "Upload Image"}
                      </Button>
                      <FormField
                        control={form.control}
                        name="cropType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Crop Type (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Wheat, Rice" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading || !uploadedImage} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Analyze Field Image
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="font-semibold text-lg">AI is observing your field...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
              </CardContent>
            </Card>
          )}

          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Report</CardTitle>
                <CardDescription>{analysisResult.imageDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold text-primary flex items-center gap-1 mb-1"><Leaf size={16}/> Crop Health</h4>
                    <p className="text-sm text-muted-foreground">{analysisResult.cropHealth}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold text-primary flex items-center gap-1 mb-1"><Droplets size={16}/> Water Stress</h4>
                    <p className="text-sm text-muted-foreground">{analysisResult.waterStress}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold text-primary flex items-center gap-1 mb-1"><AlertTriangle size={16}/> Anomaly Detection</h4>
                    <p className="text-sm text-muted-foreground">{analysisResult.anomalyDetection}</p>
                  </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Actionable Recommendations</h3>
                    <ul className="space-y-3">
                    {analysisResult.actionableRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{rec}</span>
                        </li>
                    ))}
                    </ul>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Disclaimer: This AI analysis is for informational purposes and should be verified with on-ground inspection.
              </CardFooter>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
