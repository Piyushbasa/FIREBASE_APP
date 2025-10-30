
'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Droplets, ShieldCheck, Upload, Loader2, Microscope, Sparkles, XCircle, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { diagnosePlantAction } from '@/app/actions';
import type { DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PlantHealthCard({ userLanguage }: { userLanguage?: string; }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosePlantOutput | null>(null);
  
  const defaultImage = PlaceHolderImages.find(p => p.id === 'plant-leaf');
  const imageUrl = uploadedImage || defaultImage?.imageUrl || "https://picsum.photos/seed/plant-leaf/1974/1200";

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setDiagnosisResult(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!uploadedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Uploaded',
        description: 'Please upload an image of a plant leaf to diagnose.',
      });
      return;
    }

    setIsLoading(true);
    setDiagnosisResult(null);

    const result = await diagnosePlantAction({
      photoDataUri: uploadedImage,
      description: 'A close-up photo of a plant leaf.',
      language: userLanguage || 'English',
    });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: result.error,
      });
    } else if (result.data) {
      if (!result.data.identification.isPlant) {
         toast({
          variant: 'destructive',
          title: 'Not a Plant',
          description: "The uploaded image does not appear to be a plant. Please try another image.",
        });
      }
      setDiagnosisResult(result.data);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setUploadedImage(null);
    setDiagnosisResult(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <Card className="relative overflow-hidden">
      <Image
        src={imageUrl}
        alt={uploadedImage ? "Uploaded plant leaf" : "A healthy plant leaf"}
        fill
        className="object-cover -z-10 transition-all duration-300"
        data-ai-hint={defaultImage?.imageHint || "plant leaf"}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Microscope /> AI Plant Health Diagnosis</CardTitle>
          <CardDescription>Upload a photo of a plant leaf to get an AI-powered diagnosis.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} variant="secondary" className="flex-1">
                <Upload className="mr-2" /> {uploadedImage ? 'Change Image' : 'Upload Image'}
              </Button>
              <Button onClick={handleDiagnose} disabled={isLoading || !uploadedImage}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Diagnose
              </Button>
               {uploadedImage && (
                <Button onClick={handleClear} disabled={isLoading} variant="destructive" size="icon">
                  <XCircle />
                </Button>
              )}
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-background/20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="font-semibold">AI is analyzing the plant...</p>
                  <p className="text-sm">This may take a moment.</p>
              </div>
            )}

            {diagnosisResult && (
              <div className="space-y-4 p-4 rounded-lg bg-background/20 animate-in fade-in-50">
                {!diagnosisResult.identification.isPlant ? (
                   <div className="text-center">
                     <p className="font-bold text-lg">Not a Plant</p>
                     <p className="text-sm">The uploaded image doesn't seem to be a plant. Please try another one.</p>
                   </div>
                ): (
                  <>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2"><Leaf />{diagnosisResult.identification.commonName}</h3>
                      <p className="text-sm text-muted-foreground italic">{diagnosisResult.identification.latinName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-primary">Health Status:</h4>
                          <Badge variant={diagnosisResult.diagnosis.isHealthy ? 'default' : 'destructive'}>
                            {diagnosisResult.diagnosis.isHealthy ? 'Healthy' : 'Needs Attention'}
                          </Badge>
                      </div>
                       <div className="space-y-1">
                          <h4 className="font-semibold text-primary">Diagnosis:</h4>
                          <p className="text-sm text-muted-foreground">{diagnosisResult.diagnosis.diagnosis}</p>
                       </div>
                       {!diagnosisResult.diagnosis.isHealthy && (
                         <div className="space-y-1">
                            <h4 className="font-semibold text-primary">Suggested Remedy:</h4>
                            <p className="text-sm text-muted-foreground">{diagnosisResult.diagnosis.remedy}</p>
                         </div>
                       )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
         
          {!isLoading && !diagnosisResult && (
             <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm">
                  <HeartPulse className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Health</p>
                    <p className="text-lg font-semibold">Excellent</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm">
                  <Droplets className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Watering</p>
                    <p className="text-lg font-semibold">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Pesticides</p>
                    <p className="text-lg font-semibold">3 days ago</p>
                  </div>
                </div>
              </div>
          )}

        </CardContent>
      </div>
    </Card>
  );
}

    