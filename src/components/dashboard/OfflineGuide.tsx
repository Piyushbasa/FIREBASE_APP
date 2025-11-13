'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookMarked, Droplets, Leaf, Sprout } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Crop = 'Rice' | 'Wheat' | 'Maize';
type Soil = 'Alluvial' | 'Black' | 'Red';
type Stage = 'Vegetative' | 'Flowering' | 'Maturity';

const offlineTips: Record<Crop, Record<Soil, Record<Stage, { irrigation: string, fertilizer: string, pest: string }>>> = {
  Rice: {
    Alluvial: {
      Vegetative: {
        irrigation: 'Maintain 2-5cm of standing water. Ensure continuous submergence.',
        fertilizer: 'Apply a high-nitrogen fertilizer (Urea) at 2-3 weeks after transplanting.',
        pest: 'Scout for stem borer. Use pheromone traps to monitor.'
      },
      Flowering: {
        irrigation: 'Maintain 5cm of water. Critical stage, do not allow soil to dry.',
        fertilizer: 'Top-dress with Potash (MOP) to improve grain filling.',
        pest: 'Monitor for leaf folder and rice hispa. Consider neem oil spray.'
      },
      Maturity: {
        irrigation: 'Stop irrigation 10-15 days before harvesting to allow field to dry.',
        fertilizer: 'No fertilizer application is needed at this stage.',
        pest: 'Protect grains from birds. Monitor for grain-sucking pests.'
      },
    },
    Black: {
        Vegetative: {
            irrigation: 'Requires less water than Alluvial. Irrigate when cracks appear.',
            fertilizer: 'Apply nitrogen. Black soils are rich in potash, so less is needed.',
            pest: 'Similar to Alluvial. Check for zinc deficiency.'
        },
        Flowering: {
            irrigation: 'Ensure soil moisture is consistent. Avoid water stress.',
            fertilizer: 'Apply a balanced NPK fertilizer if soil test indicates deficiency.',
            pest: 'Monitor for bacterial leaf blight, more common in humid conditions.'
        },
        Maturity: {
            irrigation: 'Stop irrigation about 15 days before harvest.',
            fertilizer: 'No fertilizer needed.',
            pest: 'Watch for rodents and birds.'
        }
    },
    Red: {
        Vegetative: {
            irrigation: 'Needs frequent irrigation due to low water retention. Aim for saturation.',
            fertilizer: 'Red soils are often poor in nutrients. Apply a balanced NPK at base and top-dress nitrogen.',
            pest: 'Iron deficiency can occur. Monitor for yellowing leaves.'
        },
        Flowering: {
            irrigation: 'Critical stage. Do not let the soil dry out completely.',
            fertilizer: 'Apply a second dose of nitrogen and potash.',
            pest: 'Monitor for blast disease, which is common in red soil areas.'
        },
        Maturity: {
            irrigation: 'Withhold water 7-10 days before harvest.',
            fertilizer: 'No fertilizer needed.',
            pest: 'General monitoring for pests.'
        }
    },
  },
  Wheat: {
    Alluvial: {
      Vegetative: {
        irrigation: 'First irrigation at Crown Root Initiation (CRI) stage (21-25 days after sowing).',
        fertilizer: 'Apply half dose of Nitrogen and full dose of Phosphorus and Potash at sowing.',
        pest: 'Monitor for aphids. If found in patches, spray with soapy water.'
      },
      Flowering: {
        irrigation: 'Irrigate at flowering stage. Ensure soil has enough moisture.',
        fertilizer: 'Apply the remaining half of Nitrogen before first irrigation.',
        pest: 'Watch for rust disease (yellow/brown spots on leaves). Use resistant varieties.'
      },
      Maturity: {
        irrigation: 'Last irrigation at dough stage. Stop 15 days before harvest.',
        fertilizer: 'No fertilizer needed.',
        pest: 'Protect from birds and rodents.'
      },
    },
    Black: {
      Vegetative: {
        irrigation: 'First irrigation at 25-30 days. Black soil retains moisture well.',
        fertilizer: 'Basal application of NPK. Nitrogen top-dressing might be needed.',
        pest: 'Termite attacks can occur. Treat seeds before sowing.'
      },
      Flowering: {
        irrigation: 'Ensure moisture during flowering and grain filling.',
        fertilizer: 'Not usually required if basal dose was adequate.',
        pest: 'Check for Karnal bunt, especially in humid weather.'
      },
      Maturity: {
        irrigation: 'Stop irrigation once grains are hard.',
        fertilizer: 'No fertilizer needed.',
        pest: 'General monitoring.'
      },
    },
    Red: {
      Vegetative: {
        irrigation: 'Requires more frequent but lighter irrigation. Irrigate every 15-20 days.',
        fertilizer: 'Apply compost/FYM as red soils have low organic matter. Full NPK dose required.',
        pest: 'Monitor for root-knot nematodes.'
      },
      Flowering: {
        irrigation: 'Crucial to maintain moisture. Avoid water stress.',
        fertilizer: 'Split nitrogen application is beneficial.',
        pest: 'Monitor for powdery mildew.'
      },
      Maturity: {
        irrigation: 'Stop irrigation when leaves start turning yellow.',
        fertilizer: 'No fertilizer needed.',
        pest: 'General monitoring.'
      },
    }
  },
  Maize: {
    Alluvial: {
      Vegetative: {
        irrigation: 'Irrigate at 4-leaf and late vegetative stage. Avoid water logging.',
        fertilizer: 'Apply 1/3 of Nitrogen and full P & K at sowing.',
        pest: 'Control weeds. Watch for stem borer.'
      },
      Flowering: {
        irrigation: 'Critical stage for water. Ensure moisture at tasseling and silking.',
        fertilizer: 'Apply 1/3 of Nitrogen at knee-high stage and final 1/3 at tasseling.',
        pest: 'Monitor for fall armyworm. Manual removal of egg masses can help.'
      },
      Maturity: {
        irrigation: 'Irrigate during grain filling stage. Stop once grains are hard.',
        fertilizer: 'No fertilizer needed.',
        pest: 'Watch for cob borers.'
      },
    },
    Black: {
        Vegetative: {
            irrigation: 'Irrigate if there is a long dry spell. Black soil has good water retention.',
            fertilizer: 'Follow recommended NPK dose. Zinc deficiency can be an issue.',
            pest: 'Weed management is critical in the first 30-40 days.'
        },
        Flowering: {
            irrigation: 'One critical irrigation at silking/tasseling if soil is dry.',
            fertilizer: 'Complete nitrogen application before tasseling.',
            pest: 'Monitor for rust and leaf blight.'
        },
        Maturity: {
            irrigation: 'Usually not required if late-season rains occur.',
            fertilizer: 'No fertilizer needed.',
            pest: 'Protect cobs from birds and animals.'
        }
    },
    Red: {
      Vegetative: {
        irrigation: 'Frequent irrigation is needed. Maintain consistent soil moisture.',
        fertilizer: 'Apply organic manure. Use full recommended NPK dose in splits.',
        pest: 'Watch for shoot fly and stem borer.'
      },
      Flowering: {
        irrigation: 'Water stress at this stage severely reduces yield. Irrigate regularly.',
        fertilizer: 'Apply final dose of nitrogen.',
        pest: 'Fall armyworm can be a major problem. Use pheromone traps.'
      },
      Maturity: {
        irrigation: 'Continue irrigation until grains start to harden.',
        fertilizer: 'No fertilizer needed.',
        pest: 'Monitor for cob borers.'
      },
    }
  },
};


export function OfflineGuide() {
    const [crop, setCrop] = React.useState<Crop>('Rice');
    const [soil, setSoil] = React.useState<Soil>('Alluvial');
    const [stage, setStage] = React.useState<Stage>('Vegetative');

    const tips = offlineTips[crop]?.[soil]?.[stage];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookMarked className="text-primary"/>
                    Offline Farming Guide
                </CardTitle>
                <CardDescription>
                    Get instant farming tips based on your conditions. No internet required.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Crop</label>
                        <Select value={crop} onValueChange={(v) => setCrop(v as Crop)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Maize">Maize</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium">Soil Type</label>
                        <Select value={soil} onValueChange={(v) => setSoil(v as Soil)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Alluvial">Alluvial</SelectItem>
                                <SelectItem value="Black">Black</SelectItem>
                                <SelectItem value="Red">Red</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium">Growth Stage</label>
                        <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Vegetative">Vegetative</SelectItem>
                                <SelectItem value="Flowering">Flowering</SelectItem>
                                <SelectItem value="Maturity">Maturity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {tips && (
                    <div className="space-y-4 pt-4">
                         <Alert>
                            <Droplets className="h-4 w-4" />
                            <AlertTitle>Irrigation</AlertTitle>
                            <AlertDescription>{tips.irrigation}</AlertDescription>
                        </Alert>
                         <Alert>
                            <Sprout className="h-4 w-4" />
                            <AlertTitle>Fertilizer</AlertTitle>
                            <AlertDescription>{tips.fertilizer}</AlertDescription>
                        </Alert>
                         <Alert>
                            <Leaf className="h-4 w-4" />
                            <AlertTitle>Pest Control</AlertTitle>
                            <AlertDescription>{tips.pest}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
