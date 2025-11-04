
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Leaf, Droplets, MapPin, Ruler, BrainCircuit, Check, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { NewFieldForm } from '@/components/land-review/NewFieldForm';
import { FieldList, UserField } from '@/components/land-review/FieldList';
import { fetchFieldAnalysis } from '../actions';
import type { AnalyzeFieldOutput } from '@/ai/flows/analyze-field-flow';
import { useToast } from '@/hooks/use-toast';

const generateNdviData = (base: number) => {
  return [
    { month: 'Jan', ndvi: base - 0.1 + Math.random() * 0.05 },
    { month: 'Feb', ndvi: base - 0.05 + Math.random() * 0.05 },
    { month: 'Mar', ndvi: base + Math.random() * 0.05 },
    { month: 'Apr', ndvi: base + 0.05 + Math.random() * 0.05 },
    { month: 'May', ndvi: base + 0.1 + Math.random() * 0.05 },
    { month: 'Jun', ndvi: base + 0.08 + Math.random() * 0.05 },
  ].map(d => ({ ...d, ndvi: parseFloat(d.ndvi.toFixed(2)) }));
};


export default function FieldAnalysisPage() {
  const [selectedField, setSelectedField] = React.useState<UserField | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalyzeFieldOutput | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const fieldsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `userProfile/${user.uid}/fields`), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: fields, isLoading: areFieldsLoading } = useCollection<UserField>(fieldsQuery);

  // Select the first field by default
  React.useEffect(() => {
    if (fields && fields.length > 0 && !selectedField) {
      setSelectedField(fields[0]);
    } else if (fields && fields.length === 0) {
      setSelectedField(null);
      setAnalysis(null);
    }
  }, [fields, selectedField]);

  // Fetch analysis when selectedField changes
  React.useEffect(() => {
    if (selectedField) {
      const getAnalysis = async () => {
        setIsAnalysisLoading(true);
        setAnalysis(null);
        const result = await fetchFieldAnalysis({
          fieldName: selectedField.fieldName,
          vegetationIndex: selectedField.vegetationIndex,
          moistureLevel: selectedField.moistureLevel,
        });
        if (result.error) {
          toast({
            variant: "destructive",
            title: "AI Analysis Failed",
            description: result.error,
          });
        } else {
          setAnalysis(result.data);
        }
        setIsAnalysisLoading(false);
      };
      getAnalysis();
    }
  }, [selectedField, toast]);

  const ndviData = React.useMemo(() => 
    selectedField ? generateNdviData(selectedField.vegetationIndex) : [], 
  [selectedField]);

  const isLoading = isUserLoading || areFieldsLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>My Fields</CardTitle>
                <CardDescription>Manage and analyze your farm plots.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewFieldForm />
                <div className="mt-6">
                  <FieldList 
                    fields={fields} 
                    isLoading={isLoading} 
                    selectedField={selectedField}
                    onSelectField={setSelectedField}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Field Details
                </CardTitle>
                <CardDescription>
                  Satellite-powered insights for your selected farm.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedField && !isLoading && (
                   <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed h-96">
                     <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                     <h3 className="text-xl font-semibold">No Field Selected</h3>
                     <p className="text-muted-foreground">Add a field or select one from your list to see its analysis.</p>
                   </div>
                )}
                {isLoading && !selectedField && (
                  <div className="space-y-6">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                    </div>
                  </div>
                )}
                {selectedField && (
                  <div className="space-y-6">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={selectedField.imageUrl}
                        alt={`Aerial view of ${selectedField.fieldName}`}
                        fill
                        className="object-cover"
                        data-ai-hint="aerial agriculture"
                      />
                      <div className="absolute bottom-0 left-0 bg-black/50 text-white p-3 rounded-tr-lg">
                        <h3 className="font-bold text-lg">{selectedField.fieldName}</h3>
                        <p className="text-sm flex items-center gap-1"><Ruler size={14}/> {selectedField.fieldSize} Acres</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Vegetation Index (NDVI)</CardTitle>
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">{selectedField.vegetationIndex.toFixed(2)}</div>
                          <p className="text-xs text-muted-foreground">Higher is generally healthier</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Soil Moisture</CardTitle>
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedField.moistureLevel}%</div>
                          <p className="text-xs text-muted-foreground">Based on recent estimates</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedField && (
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-primary" />
                      AI Analysis & Recommendations
                    </CardTitle>
                    <CardDescription>Generated based on the latest field data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAnalysisLoading && (
                      <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card h-40">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="font-semibold">AI is analyzing your field...</p>
                      </div>
                    )}
                    {analysis && !isAnalysisLoading && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary">Summary</h4>
                          <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">Recommendations</h4>
                          <ul className="space-y-2 mt-2">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
              </Card>
            )}

            {selectedField && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    NDVI Trend (6 Months)
                  </CardTitle>
                  <CardDescription>Simulated crop growth cycle analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={ndviData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 1]} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

    