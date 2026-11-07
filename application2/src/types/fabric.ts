export type FabricType = 'cotton' | 'linen' | 'nylon' | 'polyester' | 'silk' | 'wool';

export interface SustainabilityInfo {
  fibre_type: string;
  category: string;
  reason: string;
}

export interface RankedPrediction {
  fabric: string;
  confidence: number;
}

export interface PredictionResult {
  fabric_type: string;
  confidence: number;
  ranked_predictions: RankedPrediction[];
  sustainability: SustainabilityInfo;
  image_url?: string;
  timestamp?: number;
  id?: string;
}

export interface AIInsights {
  weave_observation: string;
  recommended_care: string;
  microplastic_risk: string;
  durability_score: string;
  eco_tip: string;
}

export interface HistoryItem {
  id: string;
  fabric_type: string;
  confidence: number;
  sustainability: SustainabilityInfo;
  ranked_predictions: RankedPrediction[];
  image_url: string;
  timestamp: number;
}

export interface MaterialEncyclopediaItem {
  id: FabricType;
  name: string;
  fibreType: 'Natural' | 'Synthetic';
  sustainabilityCategory: 'Eco-Friendly' | 'Non-Eco-Friendly';
  tagline: string;
  databaseReason: string;
  overview: string;
  origin: string;
  visualIndicators: string[];
  aiDetectionTip: string;
  commonUses: string[];
  careInstructions: string[];
  environmentalScore: number; // 1 to 10
  waterIntensity: string;
  biodegradability: string;
  microplasticRisk: 'None' | 'High';
  accentColor: string;
  sampleImage: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isGuest: boolean;
  scanCount: number;
  joinedDate: string;
}

export interface ScanAnalytics {
  totalScans: number;
  mostDetected: string;
  naturalCount: number;
  syntheticCount: number;
  ecoFriendlyCount: number;
  nonEcoCount: number;
  averageConfidence: number;
  fabricBreakdown: Record<string, number>;
}
