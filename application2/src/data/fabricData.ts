import { MaterialEncyclopediaItem } from '../types/fabric';

export const FABRICS_DATABASE: Record<string, MaterialEncyclopediaItem> = {
  cotton: {
    id: 'cotton',
    name: 'Cotton',
    fibreType: 'Natural',
    sustainabilityCategory: 'Eco-Friendly',
    tagline: 'Breathable, plant-based staple of global textiles',
    databaseReason: 'Plant-based and biodegradable; can be resource-intensive to grow (water/pesticides) - note this caveat in your report rather than treating all cotton as equally eco-friendly',
    overview: 'Cotton is a soft, fluffy staple fibre that grows in a boll around the seeds of the cotton plant (Gossypium). Composed almost purely of cellulose, cotton provides unmatched softness and comfort.',
    origin: 'Plant boll (Gossypium family)',
    visualIndicators: [
      'Soft, matte surface with subtle micro-fuzz (nap)',
      'Uniform weave with interlaced plain or twill yarns',
      'No synthetic plastic gloss or intense specular shine',
      'Natural creases and relaxed drape'
    ],
    aiDetectionTip: 'Look for matte texture with soft fiber halos under directional light, distinct from the sharp gloss of polyester.',
    commonUses: ['T-shirts & shirts', 'Denim jeans', 'Bed linens', 'Undergarments', 'Canvas bags'],
    careInstructions: [
      'Machine wash cold (30°C) with eco-friendly detergent',
      'Wash inside-out to preserve color vibrancy',
      'Line dry in indirect sun to prevent shrinkage and save electricity',
      'Warm iron while slightly damp if crispness is desired'
    ],
    environmentalScore: 7.2,
    waterIntensity: 'High',
    biodegradability: 'Fully biodegradable (approx. 5-6 months in compost)',
    microplasticRisk: 'None',
    accentColor: '#54683C',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23E8E1CD"/><g stroke="%23B7A98A" stroke-width="2"><path d="M0,30 Q150,45 300,30 M0,60 Q150,75 300,60 M0,90 Q150,105 300,90 M0,120 Q150,135 300,120 M0,150 Q150,165 300,150 M0,180 Q150,195 300,180 M0,210 Q150,225 300,210 M0,240 Q150,255 300,240 M0,270 Q150,285 300,270"/><path d="M30,0 Q45,150 30,300 M60,0 Q75,150 60,300 M90,0 Q105,150 90,300 M120,0 Q135,150 120,300 M150,0 Q165,150 150,300 M180,0 Q195,150 180,300 M210,0 Q225,150 210,300 M240,0 Q255,150 240,300 M270,0 Q285,150 270,300"/></g><circle cx="150" cy="150" r="40" fill="%2354683C" opacity="0.15"/><text x="150" y="155" font-family="serif" font-size="20" fill="%2326211C" text-anchor="middle" font-weight="bold">COTTON</text></svg>'
  },
  linen: {
    id: 'linen',
    name: 'Linen',
    fibreType: 'Natural',
    sustainabilityCategory: 'Eco-Friendly',
    tagline: 'Ancient, resilient bast fibre with low environmental impact',
    databaseReason: 'Made from flax; biodegradable and typically low water/pesticide input compared to cotton',
    overview: 'Linen is a textile made from the bast fibres of the flax plant (Linum usitatissimum). It is one of the oldest cultivated textiles in human history, renowned for its cool, crisp hand and exceptional durability.',
    origin: 'Flax plant stems (Linum usitatissimum)',
    visualIndicators: [
      'Characteristic natural "slubs" (irregular thick and thin yarn sections)',
      'Open, structured weave with crisp body and crisp folds',
      'Gentle natural lustre without synthetic glint',
      'Visible organic texture with coarse yarn cross-sections'
    ],
    aiDetectionTip: 'Slubs and visible variations in yarn thickness are signature features of genuine flax linen.',
    commonUses: ['Summer suits & blouses', 'Breezy dresses', 'Tablecloths & napkins', 'Luxury bedding', 'Art canvas'],
    careInstructions: [
      'Wash on delicate cycle at 30°C or hand wash',
      'Do not wring vigorously; press gently in a towel',
      'Hang to dry; linen dries substantially faster than cotton',
      'Iron while still damp using high heat'
    ],
    environmentalScore: 9.0,
    waterIntensity: 'Low',
    biodegradability: 'Fully biodegradable (approx. 2 weeks in active soil)',
    microplasticRisk: 'None',
    accentColor: '#54683C',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23EBE4CF"/><g stroke="%23A89A77" stroke-width="2.5"><path d="M0,25 C100,20 200,30 300,25 M0,65 C120,55 220,70 300,65 M0,110 C80,120 180,105 300,110 M0,160 C90,150 210,165 300,160 M0,205 C140,215 230,195 300,205 M0,255 C70,245 190,260 300,255"/><path d="M25,0 C20,100 30,200 25,300 M70,0 C80,110 60,210 70,300 M120,0 C110,90 130,220 120,300 M175,0 C185,130 165,240 175,300 M225,0 C220,100 235,190 225,300 M275,0 C280,120 270,230 275,300"/></g><circle cx="150" cy="150" r="40" fill="%2354683C" opacity="0.15"/><text x="150" y="155" font-family="serif" font-size="20" fill="%2326211C" text-anchor="middle" font-weight="bold">LINEN</text></svg>'
  },
  wool: {
    id: 'wool',
    name: 'Wool',
    fibreType: 'Natural',
    sustainabilityCategory: 'Eco-Friendly',
    tagline: 'Naturally insulating, renewable animal protein fibre',
    databaseReason: 'Animal-fibre, renewable and biodegradable; note shorter-term concerns around land use and methane are sometimes raised in sustainability literature',
    overview: 'Wool is the textile fibre obtained from sheep and other animals (such as cashmere from goats, mohair, and alpaca). Wool has natural crimp and microscopic scales that trap insulating air pockets.',
    origin: 'Animal fleece (Sheep / Capra hircus)',
    visualIndicators: [
      'Dense fuzzy surface with high fibrous loft',
      'Microscopic crimp causing spongy, springy tactile spring',
      'Deep matte appearance with diffuse light dispersion',
      'Twisted ply yarns with protruding fine wool hairs'
    ],
    aiDetectionTip: 'Look for the fuzzy surface halo (nap) and three-dimensional yarn loft typical of spun animal fibers.',
    commonUses: ['Overcoats & peacoats', 'Knit sweaters & cardigans', 'Tailored suits', 'Thermal base layers', 'Rugs & blankets'],
    careInstructions: [
      'Hand wash in cold water using a wool-certified detergent',
      'Never agitate aggressively or wring, which causes felting',
      'Roll in a clean dry towel to extract excess moisture',
      'Lay completely flat to dry away from radiators and direct sun'
    ],
    environmentalScore: 7.8,
    waterIntensity: 'Moderate',
    biodegradability: 'Fully biodegradable (returns nitrogen to soil within 3-4 months)',
    microplasticRisk: 'None',
    accentColor: '#54683C',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23DDD5C0"/><g stroke="%238C8275" stroke-width="3" stroke-linecap="round"><path d="M20,40 Q40,20 60,40 T100,40 T140,40 T180,40 T220,40 T260,40 T300,40 M0,90 Q40,70 80,90 T160,90 T240,90 T320,90 M20,140 Q40,120 60,140 T100,140 T140,140 T180,140 T220,140 T260,140 T300,140 M0,190 Q40,170 80,190 T160,190 T240,190 T320,190 M20,240 Q40,220 60,240 T100,240 T140,240 T180,240 T220,240 T260,240 T300,240"/></g><circle cx="150" cy="150" r="40" fill="%2354683C" opacity="0.15"/><text x="150" y="155" font-family="serif" font-size="20" fill="%2326211C" text-anchor="middle" font-weight="bold">WOOL</text></svg>'
  },
  silk: {
    id: 'silk',
    name: 'Silk',
    fibreType: 'Natural',
    sustainabilityCategory: 'Eco-Friendly',
    tagline: 'Continuous natural protein filament with shimmering lustre',
    databaseReason: 'Protein-based natural fibre, biodegradable',
    overview: 'Silk is a natural protein fibre produced by certain insect larvae to form cocoons, most famously the mulberry silkworm (Bombyx mori). The triangular prism-like structure of the silk fibre allows cloth to refract incoming light at different angles.',
    origin: 'Silkworm cocoons (Bombyx mori protein)',
    visualIndicators: [
      'Fluid, liquid drape with reflective shimmering highlights',
      'Smooth, fine filament yarn surface without coarse slubs',
      'Triangular prism reflections creating soft opalescence',
      'Extremely dense and compact lightweight weave'
    ],
    aiDetectionTip: 'Prismatic specular highlights and liquid fluid folds distinguish silk from other natural materials.',
    commonUses: ['Evening dresses & gowns', 'Formal ties & pocket squares', 'Silk scarves', 'Luxury blouses', 'Fine lingerie'],
    careInstructions: [
      'Hand wash gently in lukewarm/cool water with neutral detergent',
      'Do not soak or bleach; handle gently when wet',
      'Air dry on padded hanger in shade',
      'Iron on lowest setting on reverse side while slightly damp'
    ],
    environmentalScore: 7.5,
    waterIntensity: 'Moderate',
    biodegradability: 'Fully biodegradable (approx. 1-2 years)',
    microplasticRisk: 'None',
    accentColor: '#54683C',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="silkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FAF7EE"/><stop offset="50%" stop-color="%23DCD3B8"/><stop offset="100%" stop-color="%23FAF7EE"/></linearGradient></defs><rect width="300" height="300" fill="url(%23silkGrad)"/><g stroke="%23B7A98A" stroke-width="1.2" opacity="0.6"><path d="M0,0 C100,50 150,250 300,300 M50,0 C150,50 200,250 350,300 M-50,0 C50,50 100,250 250,300 M0,50 C100,100 150,300 300,350"/></g><circle cx="150" cy="150" r="40" fill="%2354683C" opacity="0.15"/><text x="150" y="155" font-family="serif" font-size="20" fill="%2326211C" text-anchor="middle" font-weight="bold">SILK</text></svg>'
  },
  polyester: {
    id: 'polyester',
    name: 'Polyester',
    fibreType: 'Synthetic',
    sustainabilityCategory: 'Non-Eco-Friendly',
    tagline: 'High-strength petroleum polymer; non-biodegradable',
    databaseReason: 'Petroleum-derived plastic; not biodegradable and sheds microplastics during washing',
    overview: 'Polyester (specifically polyethylene terephthalate or PET) is a category of synthetic polymers. First developed in the 1940s, polyester has become the most widely produced textile fibre in the world due to low manufacturing costs and high durability.',
    origin: 'Petroleum / crude oil petrochemical synthesis',
    visualIndicators: [
      'Uniform synthetic sheen with consistent plastic reflection',
      'Perfect geometric yarn consistency with zero natural slubs',
      'Crisp edges that resist natural wrinkles',
      'Tight, compact filament or spun yarn texture'
    ],
    aiDetectionTip: 'Uniform synthetic gloss, lack of natural irregular slubs, and synthetic wrinkle-resistance identify polyester.',
    commonUses: ['Fast fashion clothing', 'Sportswear & jerseys', 'Waterproof jackets', 'Fleece jackets', 'Upholstery'],
    careInstructions: [
      'Wash cold (30°C) with a microfibre-catching laundry bag (e.g. Guppyfriend)',
      'Avoid high-heat drying, which degrades synthetic polymers',
      'Wash less frequently; air out between wears',
      'Never iron with high heat to prevent melting'
    ],
    environmentalScore: 3.0,
    waterIntensity: 'Low (manufacturing), but high chemical footprint',
    biodegradability: 'Non-biodegradable (takes 200 to 500+ years to fragment)',
    microplasticRisk: 'High',
    accentColor: '#4B4F92',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23E1E1F0"/><g stroke="%234B4F92" stroke-width="1.8" opacity="0.4"><path d="M0,20 H300 M0,40 H300 M0,60 H300 M0,80 H300 M0,100 H300 M0,120 H300 M0,140 H300 M0,160 H300 M0,180 H300 M0,200 H300 M0,220 H300 M0,240 H300 M0,260 H300 M0,280 H300"/><path d="M20,0 V300 M40,0 V300 M60,0 V300 M80,0 V300 M100,0 V300 M120,0 V300 M140,0 V300 M160,0 V300 M180,0 V300 M200,0 V300 M220,0 V300 M240,0 V300 M260,0 V300 M280,0 V300"/></g><circle cx="150" cy="150" r="40" fill="%234B4F92" opacity="0.2"/><text x="150" y="155" font-family="sans-serif" font-size="18" fill="%2326211C" text-anchor="middle" font-weight="bold">POLYESTER</text></svg>'
  },
  nylon: {
    id: 'nylon',
    name: 'Nylon',
    fibreType: 'Synthetic',
    sustainabilityCategory: 'Non-Eco-Friendly',
    tagline: 'Tough, abrasion-resistant polyamide synthetic fibre',
    databaseReason: 'Petroleum-derived plastic; not biodegradable and sheds microplastics during washing',
    overview: 'Nylon is a generic designation for a family of synthetic polymers known as polyamides. Originally developed by Wallace Carothers at DuPont in 1935, nylon is renowned for its immense tensile strength, elasticity, and resistance to abrasion.',
    origin: 'Petroleum-derived polyamide polymers',
    visualIndicators: [
      'Dense, sleek synthetic surface with smooth synthetic filaments',
      'Semi-matte to shiny surface with high resistance to scuffs',
      'Crisp ripstop grid or compact weave pattern',
      'Extremely lightweight yet structurally firm'
    ],
    aiDetectionTip: 'Look for tight, highly uniform technical weave patterns (such as ripstop or technical satin) with sleek polyamide finish.',
    commonUses: ['Activewear & leggings', 'Windbreakers & rainwear', 'Hosiery & stockings', 'Backpacks & luggage', 'Swimwear'],
    careInstructions: [
      'Machine wash cold (30°C) with like colors',
      'Use a wash bag to catch microscopic plastic fibers',
      'Hang dry; nylon dries rapidly without requiring a dryer',
      'Avoid high iron heat which causes fiber glaze or scorching'
    ],
    environmentalScore: 3.2,
    waterIntensity: 'Low (direct water), high chemical effluent footprint',
    biodegradability: 'Non-biodegradable (persists 40 to 100+ years in landfills)',
    microplasticRisk: 'High',
    accentColor: '#4B4F92',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23DCE0EC"/><g stroke="%234B4F92" stroke-width="2" opacity="0.5"><path d="M0,0 L300,300 M50,0 L300,250 M100,0 L300,200 M150,0 L300,150 M200,0 L300,100 M250,0 L300,50 M0,50 L250,300 M0,100 L200,300 M0,150 L150,300 M0,200 L100,300 M0,250 L50,300"/><path d="M300,0 L0,300 M250,0 L0,250 M200,0 L0,200 M150,0 L0,150 M100,0 L0,100 M50,0 L0,50 M300,50 L50,300 M300,100 L100,300 M300,150 L150,300 M300,200 L200,300 M300,250 L250,300"/></g><circle cx="150" cy="150" r="40" fill="%234B4F92" opacity="0.2"/><text x="150" y="155" font-family="sans-serif" font-size="19" fill="%2326211C" text-anchor="middle" font-weight="bold">NYLON</text></svg>'
  }
};

export const SAMPLE_TEST_FABRICS = [
  {
    name: 'Cotton Sample',
    fabricType: 'cotton',
    subtitle: '100% Ring-Spun Cotton',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23E8E1CD"/><g stroke="%23B7A98A" stroke-width="3" opacity="0.8"><path d="M0,40 H400 M0,80 H400 M0,120 H400 M0,160 H400 M0,200 H400 M0,240 H400 M0,280 H400 M0,320 H400 M0,360 H400"/><path d="M40,0 V400 M80,0 V400 M120,0 V400 M160,0 V400 M200,0 V400 M240,0 V400 M280,0 V400 M320,0 V400 M360,0 V400"/></g><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FAF7EE" stroke="%2326211C" stroke-width="2"/><text x="200" y="195" font-family="serif" font-size="28" fill="%2326211C" text-anchor="middle" font-weight="bold">NATURAL COTTON</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%2354683C" text-anchor="middle" font-weight="600">Eco-Friendly Staple</text></svg>'
  },
  {
    name: 'Linen Sample',
    fabricType: 'linen',
    subtitle: 'Woven Belgian Flax',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23DCD3B8"/><g stroke="%23A89A77" stroke-width="3.5" opacity="0.8"><path d="M0,35 C150,45 250,25 400,35 M0,85 C130,75 270,95 400,85 M0,145 C160,135 240,155 400,145 M0,205 C110,215 290,195 400,205 M0,265 C140,255 260,275 400,265 M0,325 C120,335 280,315 400,325"/><path d="M35,0 C45,150 25,250 35,400 M85,0 C75,130 95,270 85,400 M145,0 C135,160 155,240 145,400 M205,0 C215,110 195,290 205,400 M265,0 C255,140 275,260 265,400 M325,0 C335,120 315,280 325,400"/></g><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FAF7EE" stroke="%2326211C" stroke-width="2"/><text x="200" y="195" font-family="serif" font-size="28" fill="%2326211C" text-anchor="middle" font-weight="bold">FLAX LINEN</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%2354683C" text-anchor="middle" font-weight="600">Pure Bast Fibre</text></svg>'
  },
  {
    name: 'Wool Sample',
    fabricType: 'wool',
    subtitle: 'Merino Fleece Weave',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23DDD5C0"/><g stroke="%238C8275" stroke-width="4" stroke-linecap="round" opacity="0.7"><path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50 M0,110 Q50,80 100,110 T200,110 T300,110 T400,110 M0,170 Q50,140 100,170 T200,170 T300,170 T400,170 M0,230 Q50,200 100,230 T200,230 T300,230 T400,230 M0,290 Q50,260 100,290 T200,290 T300,290 T400,290 M0,350 Q50,320 100,350 T200,350 T300,350 T400,350"/></g><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FAF7EE" stroke="%2326211C" stroke-width="2"/><text x="200" y="195" font-family="serif" font-size="28" fill="%2326211C" text-anchor="middle" font-weight="bold">MERINO WOOL</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%2354683C" text-anchor="middle" font-weight="600">Insulating Protein Fibre</text></svg>'
  },
  {
    name: 'Silk Sample',
    fabricType: 'silk',
    subtitle: 'Mulberry Charmeuse',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="silkSample" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FAF7EE"/><stop offset="35%" stop-color="%23E8E1CD"/><stop offset="70%" stop-color="%23DDD5C0"/><stop offset="100%" stop-color="%23FAF7EE"/></linearGradient></defs><rect width="400" height="400" fill="url(%23silkSample)"/><path d="M0,0 C150,80 200,320 400,400 M80,0 C230,80 280,320 480,400 M-80,0 C70,80 120,320 320,400" stroke="%23B7A98A" stroke-width="2" opacity="0.6"/><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FAF7EE" stroke="%2326211C" stroke-width="2"/><text x="200" y="195" font-family="serif" font-size="28" fill="%2326211C" text-anchor="middle" font-weight="bold">MULBERRY SILK</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%2354683C" text-anchor="middle" font-weight="600">Lustrous Natural Filament</text></svg>'
  },
  {
    name: 'Polyester Sample',
    fabricType: 'polyester',
    subtitle: 'Technical Microfibre',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23E1E1F0"/><g stroke="%234B4F92" stroke-width="2.2" opacity="0.35"><path d="M0,30 H400 M0,60 H400 M0,90 H400 M0,120 H400 M0,150 H400 M0,180 H400 M0,210 H400 M0,240 H400 M0,270 H400 M0,300 H400 M0,330 H400 M0,360 H400"/><path d="M30,0 V400 M60,0 V400 M90,0 V400 M120,0 V400 M150,0 V400 M180,0 V400 M210,0 V400 M240,0 V400 M270,0 V400 M300,0 V400 M330,0 V400 M360,0 V400"/></g><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FFFFFF" stroke="%234B4F92" stroke-width="2"/><text x="200" y="195" font-family="sans-serif" font-size="26" fill="%2326211C" text-anchor="middle" font-weight="bold">POLYESTER</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%23A8451F" text-anchor="middle" font-weight="600">Synthetic Microplastic Risk</text></svg>'
  },
  {
    name: 'Nylon Sample',
    fabricType: 'nylon',
    subtitle: 'Polyamide Ripstop',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23DCE0EC"/><g stroke="%234B4F92" stroke-width="2.5" opacity="0.4"><path d="M0,0 L400,400 M100,0 L400,300 M200,0 L400,200 M300,0 L400,100 M0,100 L300,400 M0,200 L200,400 M0,300 L100,400"/><path d="M400,0 L0,400 M300,0 L0,300 M200,0 L0,200 M100,0 L0,100 M400,100 L100,400 M400,200 L200,400 M400,300 L300,400"/></g><rect x="50" y="140" width="300" height="120" rx="8" fill="%23FFFFFF" stroke="%234B4F92" stroke-width="2"/><text x="200" y="195" font-family="sans-serif" font-size="26" fill="%2326211C" text-anchor="middle" font-weight="bold">NYLON</text><text x="200" y="225" font-family="sans-serif" font-size="14" fill="%23A8451F" text-anchor="middle" font-weight="600">Synthetic Technical Polymer</text></svg>'
  }
];
