import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:5000/predict';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure temp uploads folder exists
const uploadsDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'fabric-' + uniqueSuffix + path.extname(file.originalname || '.jpg'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 } // 12MB limit
});

// Helper to parse CSV database
function getMaterialDatabase() {
  const csvPath = path.join(appDir, 'material_database.csv');
  if (!fs.existsSync(csvPath)) return [];
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser supporting quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }
    if (matches.length >= 4) {
      rows.push({
        material: matches[0],
        fibre_type: matches[1],
        sustainability_category: matches[2],
        reason: matches[3]
      });
    }
  }
  return rows;
}

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  const labelsPath = path.join(appDir, 'fabric_model_labels.txt');
  let classes = ['cotton', 'linen', 'nylon', 'polyester', 'silk', 'wool'];
  if (fs.existsSync(labelsPath)) {
    classes = fs.readFileSync(labelsPath, 'utf8').split('\n').map(c => c.trim()).filter(Boolean);
  }
  res.json({
    status: 'ok',
    service: 'Fabric AI Express Gateway',
    classes,
    materialsCount: getMaterialDatabase().length,
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Materials Database API
app.get(['/api/materials', '/materials'], (req, res) => {
  try {
    const materials = getMaterialDatabase();
    res.json({ status: 'ok', materials });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read material database' });
  }
});

// Primary Predict Endpoint
app.post(['/api/predict', '/predict'], upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No 'image' file provided in request." });
  }

  const tempFilePath = req.file.path;

  // Strategy 1: Forward to Python Flask server if available
  try {
    const fileBuffer = fs.readFileSync(tempFilePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('image', blob, req.file.originalname || 'upload.jpg');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const flaskResponse = await fetch(PYTHON_API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (flaskResponse.ok) {
      const data = await flaskResponse.json();
      // Clean up temp file
      fs.unlink(tempFilePath, () => {});
      return res.json(data);
    }
  } catch (flaskErr) {
    // Flask unavailable, proceed to Strategy 2
  }

  // Strategy 2: Direct CLI runner with Python
  const runnerPath = path.join(__dirname, 'run_inference.py');
  execFile('python', [runnerPath, tempFilePath], { maxBuffer: 1024 * 1024 * 5 }, (err, stdout, stderr) => {
    // Clean up temp file
    fs.unlink(tempFilePath, () => {});

    if (err) {
      console.error('Inference CLI execution error:', err, stderr);
      return res.status(500).json({
        error: 'Fabric detection inference failed. Ensure Python and TensorFlow are available.'
      });
    }

    try {
      // Find JSON block in stdout in case TensorFlow emitted logging
      const jsonStart = stdout.indexOf('{');
      const jsonEnd = stdout.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = stdout.substring(jsonStart, jsonEnd + 1);
        const result = JSON.parse(jsonStr);
        return res.json(result);
      } else {
        throw new Error('No JSON output from inference runner: ' + stdout);
      }
    } catch (parseErr) {
      console.error('Failed to parse CLI output:', parseErr, stdout);
      res.status(500).json({ error: 'Failed to process model output.' });
    }
  });
});

// Gemini AI Textile Insights Endpoint
app.post(['/api/ai-insights', '/ai-insights'], async (req, res) => {
  const { fabric_type, confidence, sustainability } = req.body;
  if (!fabric_type) {
    return res.status(400).json({ error: 'Missing fabric_type' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `You are an expert textile engineer and sustainable fashion advisor for FABRIC AI.
Analyze the fabric: "${fabric_type}" (Identified with ${Math.round((confidence || 0.9) * 100)}% confidence).
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
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
        return res.json({ status: 'ok', source: 'gemini', insights: parsed });
      }
    } catch (geminiErr) {
      console.warn('Gemini API call failed, falling back to curated intelligence:', geminiErr.message);
    }
  }

  // Curated fallback intelligence based on fabric type
  const curatedDatabase = {
    cotton: {
      weave_observation: "Classic matte finish with soft, uniform spun yarns and natural matte breathability.",
      recommended_care: "Machine wash cold (30°C) with mild detergent; line dry to prevent shrinkage.",
      microplastic_risk: "None (Cellulose plant fibre that biodegrades naturally in soil and water).",
      durability_score: "8.0/10 — Strong wet tensile strength, high tear resistance over repeated cycles.",
      eco_tip: "Wash in cold water and air-dry to extend garment lifespan and reduce energy footprint by 60%."
    },
    linen: {
      weave_observation: "Distinctive textural slubs, crisp body, visible yarn thickness variations, and natural flax lustre.",
      recommended_care: "Gentle wash at 30°C or hand wash; iron while damp if a smooth finish is desired.",
      microplastic_risk: "None (100% bast plant fibre, completely biodegradable).",
      durability_score: "9.2/10 — One of the strongest natural fibres, softening and improving with every wash.",
      eco_tip: "Linen requires minimal irrigation and pesticides compared to conventional crops; keep it for decades."
    },
    wool: {
      weave_observation: "Natural crimp, warm fibrous loft, matte surface with microscopic overlapping scales.",
      recommended_care: "Hand wash in cool water with wool-safe detergent, lay flat on towel to dry. Never tumble dry.",
      microplastic_risk: "None (Natural keratin protein fibre, biodegradable in soil within 3-6 months).",
      durability_score: "8.8/10 — Exceptional natural elasticity and wrinkle recovery.",
      eco_tip: "Wool resists odour naturally; spot clean and air out outdoors rather than frequent full washes."
    },
    silk: {
      weave_observation: "Continuous filament sheen, luxurious triangular prism light refraction, fluid supple drape.",
      recommended_care: "Delicate hand wash in cool water with pH-neutral soap; shade dry away from direct sunlight.",
      microplastic_risk: "None (Natural protein filament fibre produced by silkworms, fully biodegradable).",
      durability_score: "7.5/10 — Very high tensile strength but sensitive to abrasion and sunlight.",
      eco_tip: "Protect silk garments from direct UV rays and perfume alcohol to preserve fibre integrity."
    },
    polyester: {
      weave_observation: "Extremely uniform synthetic filaments, subtle synthetic sheen, smooth wrinkle-free surface.",
      recommended_care: "Cold wash (30°C) inside a microfibre-catching wash bag (e.g. Guppyfriend); low heat dry.",
      microplastic_risk: "High (Sheds thousands of non-biodegradable microplastic fibres per wash cycle).",
      durability_score: "9.5/10 — Highly resistant to tears, stretching, mildew, and fading.",
      eco_tip: "Use a microfibre filter in your washing machine and avoid washing polyester garments after a single wear."
    },
    nylon: {
      weave_observation: "Dense, resilient synthetic weave with high abrasion resistance and sleek filament texture.",
      recommended_care: "Machine wash cold with similar items; hang dry quickly due to low moisture absorption.",
      microplastic_risk: "High (Petroleum-based polyamide that sheds synthetic microplastics into waterways).",
      durability_score: "9.8/10 — Exceptional tensile and abrasion resistance; widely used for activewear and outerwear.",
      eco_tip: "Extend garment life through prompt repairs and wash only when necessary using cold cycles."
    }
  };

  const key = fabric_type.toLowerCase();
  const insights = curatedDatabase[key] || {
    weave_observation: "Distinctive textile weave structure corresponding to standard apparel fabrication.",
    recommended_care: "Wash at 30°C and follow garment care label symbols.",
    microplastic_risk: sustainability?.fibre_type === 'Natural' ? 'Low/None' : 'Moderate to High',
    durability_score: "8.0/10",
    eco_tip: "Care for garments gently to maximize wear count before recycling or donation."
  };

  res.json({ status: 'ok', source: 'curated', insights });
});

// Serve frontend build if dist folder exists
const distDir = path.join(appDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Fabric AI Express Server running on port ${PORT}`);
  console.log(`Python API Target: ${PYTHON_API_URL}`);
  console.log(`Gemini AI Status: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled (Curated Fallback Active)'}`);
});
