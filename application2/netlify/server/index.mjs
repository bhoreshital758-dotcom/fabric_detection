// Fabric AI API server, deployed as a Netlify Server.
// Handles /api/* routes used by the frontend. Fabric recognition runs on a
// Gemini vision model through Netlify AI Gateway (no API key needed).
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const CLASSES = ['cotton', 'linen', 'nylon', 'polyester', 'silk', 'wool'];

const MATERIALS = [
  { material: 'Cotton', fibre_type: 'Natural', sustainability_category: 'Eco-Friendly', reason: 'Plant-based and biodegradable; can be resource-intensive to grow (water/pesticides) - note this caveat in your report rather than treating all cotton as equally eco-friendly' },
  { material: 'Linen', fibre_type: 'Natural', sustainability_category: 'Eco-Friendly', reason: 'Made from flax; biodegradable and typically low water/pesticide input compared to cotton' },
  { material: 'Wool', fibre_type: 'Natural', sustainability_category: 'Eco-Friendly', reason: 'Animal-fibre, renewable and biodegradable; note shorter-term concerns around land use and methane are sometimes raised in sustainability literature' },
  { material: 'Silk', fibre_type: 'Natural', sustainability_category: 'Eco-Friendly', reason: 'Protein-based natural fibre, biodegradable' },
  { material: 'Polyester', fibre_type: 'Synthetic', sustainability_category: 'Non-Eco-Friendly', reason: 'Petroleum-derived plastic; not biodegradable and sheds microplastics during washing' },
  { material: 'Nylon', fibre_type: 'Synthetic', sustainability_category: 'Non-Eco-Friendly', reason: 'Petroleum-derived plastic; not biodegradable and sheds microplastics during washing' },
];

const CURATED_INSIGHTS = {
  cotton: {
    weave_observation: 'Classic matte finish with soft, uniform spun yarns and natural matte breathability.',
    recommended_care: 'Machine wash cold (30°C) with mild detergent; line dry to prevent shrinkage.',
    microplastic_risk: 'None (Cellulose plant fibre that biodegrades naturally in soil and water).',
    durability_score: '8.0/10 — Strong wet tensile strength, high tear resistance over repeated cycles.',
    eco_tip: 'Wash in cold water and air-dry to extend garment lifespan and reduce energy footprint by 60%.',
  },
  linen: {
    weave_observation: 'Distinctive textural slubs, crisp body, visible yarn thickness variations, and natural flax lustre.',
    recommended_care: 'Gentle wash at 30°C or hand wash; iron while damp if a smooth finish is desired.',
    microplastic_risk: 'None (100% bast plant fibre, completely biodegradable).',
    durability_score: '9.2/10 — One of the strongest natural fibres, softening and improving with every wash.',
    eco_tip: 'Linen requires minimal irrigation and pesticides compared to conventional crops; keep it for decades.',
  },
  wool: {
    weave_observation: 'Natural crimp, warm fibrous loft, matte surface with microscopic overlapping scales.',
    recommended_care: 'Hand wash in cool water with wool-safe detergent, lay flat on towel to dry. Never tumble dry.',
    microplastic_risk: 'None (Natural keratin protein fibre, biodegradable in soil within 3-6 months).',
    durability_score: '8.8/10 — Exceptional natural elasticity and wrinkle recovery.',
    eco_tip: 'Wool resists odour naturally; spot clean and air out outdoors rather than frequent full washes.',
  },
  silk: {
    weave_observation: 'Continuous filament sheen, luxurious triangular prism light refraction, fluid supple drape.',
    recommended_care: 'Delicate hand wash in cool water with pH-neutral soap; shade dry away from direct sunlight.',
    microplastic_risk: 'None (Natural protein filament fibre produced by silkworms, fully biodegradable).',
    durability_score: '7.5/10 — Very high tensile strength but sensitive to abrasion and sunlight.',
    eco_tip: 'Protect silk garments from direct UV rays and perfume alcohol to preserve fibre integrity.',
  },
  polyester: {
    weave_observation: 'Extremely uniform synthetic filaments, subtle synthetic sheen, smooth wrinkle-free surface.',
    recommended_care: 'Cold wash (30°C) inside a microfibre-catching wash bag; low heat dry.',
    microplastic_risk: 'High (Sheds thousands of non-biodegradable microplastic fibres per wash cycle).',
    durability_score: '9.5/10 — Highly resistant to tears, stretching, mildew, and fading.',
    eco_tip: 'Use a microfibre filter in your washing machine and avoid washing polyester garments after a single wear.',
  },
  nylon: {
    weave_observation: 'Dense, resilient synthetic weave with high abrasion resistance and sleek filament texture.',
    recommended_care: 'Machine wash cold with similar items; hang dry quickly due to low moisture absorption.',
    microplastic_risk: 'High (Petroleum-based polyamide that sheds synthetic microplastics into waterways).',
    durability_score: '9.8/10 — Exceptional tensile and abrasion resistance; widely used for activewear and outerwear.',
    eco_tip: 'Extend garment life through prompt repairs and wash only when necessary using cold cycles.',
  },
};

const MODEL = 'gemini-flash-latest';
const ai = new GoogleGenAI({});

const app = express();
app.use(express.json({ limit: '15mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
});

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sustainabilityFor(label) {
  const row = MATERIALS.find((m) => m.material.toLowerCase() === label);
  return {
    fibre_type: row.fibre_type,
    category: row.sustainability_category,
    reason: row.reason,
  };
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in model output');
  return JSON.parse(text.substring(start, end + 1));
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Fabric AI API',
    classes: CLASSES,
    materialsCount: MATERIALS.length,
    geminiEnabled: true,
  });
});

app.get('/api/materials', (req, res) => {
  res.json({ status: 'ok', materials: MATERIALS });
});

app.post('/api/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No 'image' file provided in request." });
  }

  const mimeType = req.file.mimetype?.startsWith('image/') ? req.file.mimetype : 'image/jpeg';

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: req.file.buffer.toString('base64') } },
            {
              text: `You are a textile classification model. Look closely at the fabric in this image (weave, sheen, texture, drape, fibre structure).
Estimate the probability that the fabric is each of these classes: ${CLASSES.join(', ')}.
Respond with ONLY a JSON object mapping every class name to a probability between 0 and 1, with all values summing to 1.
Example: {"cotton":0.7,"linen":0.1,"nylon":0.05,"polyester":0.1,"silk":0.03,"wool":0.02}`,
            },
          ],
        },
      ],
      config: { responseMimeType: 'application/json', temperature: 0 },
    });

    const raw = extractJson(response.text || '');
    const scores = CLASSES.map((c) => {
      const v = Number(raw[c] ?? raw[capitalize(c)] ?? 0);
      return Number.isFinite(v) && v > 0 ? v : 0;
    });
    const total = scores.reduce((a, b) => a + b, 0);
    if (total <= 0) throw new Error('Model returned no usable scores');

    const ranked = CLASSES.map((c, i) => ({ fabric: capitalize(c), confidence: scores[i] / total })).sort(
      (a, b) => b.confidence - a.confidence,
    );
    const top = ranked[0];

    res.json({
      fabric_type: top.fabric,
      confidence: top.confidence,
      ranked_predictions: ranked,
      sustainability: sustainabilityFor(top.fabric.toLowerCase()),
    });
  } catch (err) {
    console.error('Fabric prediction failed:', err);
    res.status(502).json({ error: 'Fabric analysis is temporarily unavailable. Please try again.' });
  }
});

app.post('/api/ai-insights', async (req, res) => {
  const { fabric_type, confidence, sustainability } = req.body || {};
  if (!fabric_type) {
    return res.status(400).json({ error: 'Missing fabric_type' });
  }

  try {
    const prompt = `You are an expert textile engineer and sustainable fashion advisor for FABRIC AI.
Analyze the fabric: "${String(fabric_type).slice(0, 50)}" (Identified with ${Math.round((Number(confidence) || 0.9) * 100)}% confidence).
Fibre Type: ${sustainability?.fibre_type || 'Natural/Synthetic'}.
Category: ${sustainability?.category || 'Eco-Friendly'}.

Provide a concise, highly professional JSON response with these exact keys:
{
  "weave_observation": "1-2 sentences on typical visual weave texture, slub, or sheen characteristics",
  "recommended_care": "Recommended wash temperature and gentle care technique",
  "microplastic_risk": "Low/Medium/High with a brief 1-sentence explanation",
  "durability_score": "e.g. 8.5/10 with brief rationale",
  "eco_tip": "One actionable sustainable choice tip for the user"
}
Output ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const insights = extractJson(response.text || '');
    return res.json({ status: 'ok', source: 'gemini', insights });
  } catch (err) {
    console.warn('AI insights failed, using curated fallback:', err?.message);
  }

  const insights = CURATED_INSIGHTS[String(fabric_type).toLowerCase()] || {
    weave_observation: 'Distinctive textile weave structure corresponding to standard apparel fabrication.',
    recommended_care: 'Wash at 30°C and follow garment care label symbols.',
    microplastic_risk: sustainability?.fibre_type === 'Natural' ? 'Low/None' : 'Moderate to High',
    durability_score: '8.0/10',
    eco_tip: 'Care for garments gently to maximize wear count before recycling or donation.',
  };
  res.json({ status: 'ok', source: 'curated', insights });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export const config = {
  path: '/api/*',
};

export default app;
