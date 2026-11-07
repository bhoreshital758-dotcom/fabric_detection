import { PredictionResult, AIInsights } from '../types/fabric';

const API_BASE = '/api';

export async function predictFabric(imageFile: File | Blob): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('image', imageFile, (imageFile as File).name || 'fabric.jpg');

  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errMsg = 'Fabric analysis failed. Please try again.';
      try {
        const errorData = await res.json();
        if (errorData.error) errMsg = errorData.error;
      } catch {
        // Fallback to HTTP status
        errMsg = `Server error (${res.status}). Please check your connection.`;
      }
      throw new Error(errMsg);
    }

    const data: PredictionResult = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error. Please check your internet connection.');
  }
}

export async function fetchAiInsights(
  fabricType: string,
  confidence: number,
  sustainability: PredictionResult['sustainability']
): Promise<AIInsights> {
  try {
    const res = await fetch(`${API_BASE}/ai-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fabric_type: fabricType,
        confidence,
        sustainability,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.insights) return data.insights;
    }
  } catch (e) {
    console.warn('AI insights request failed, using default guidance:', e);
  }

  // Graceful fallback if offline or request fails
  return {
    weave_observation: 'Characteristic textile weave structure identified by model pattern.',
    recommended_care: 'Gentle wash at 30°C and follow care tag symbols.',
    microplastic_risk: sustainability.fibre_type === 'Natural' ? 'None (Natural Biodegradable)' : 'High (Synthetic Filament)',
    durability_score: '8.2/10',
    eco_tip: 'Wash gently in cold water and air dry to extend garment lifespan.'
  };
}

export async function checkBackendHealth(): Promise<{ status: string; classes: string[]; geminiEnabled: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Health check failed:', e);
  }
  return { status: 'offline', classes: ['cotton', 'linen', 'nylon', 'polyester', 'silk', 'wool'], geminiEnabled: false };
}
