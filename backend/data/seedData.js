const { v4: uuidv4 } = require('uuid');

// ──────────────────────────────────────────────
// In-memory diagnosis records (seed data)
// ──────────────────────────────────────────────
const diagnoses = [
  {
    id: uuidv4(),
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    confidence: 92.5,
    status: 'Treated',
    treatment: 'Apply copper-based fungicide such as Bordeaux mixture. Remove and destroy infected leaves. Ensure proper spacing between plants for air circulation.',
    preventiveMeasures: 'Rotate crops every 2-3 years. Avoid overhead watering. Use drip irrigation. Apply mulch around the base of plants.',
    imageUrl: null,
    diagnosisDate: '2026-06-20T08:30:00Z',
    createdAt: '2026-06-20T08:30:00Z'
  },
  {
    id: uuidv4(),
    cropName: 'Rice',
    diseaseName: 'Blast Disease',
    confidence: 87.3,
    status: 'Under Treatment',
    treatment: 'Apply tricyclazole or isoprothiolane fungicide. Drain the field and allow to dry for 2-3 days before re-flooding.',
    preventiveMeasures: 'Use resistant varieties like IR64. Avoid excessive nitrogen fertilization. Maintain proper water management.',
    imageUrl: null,
    diagnosisDate: '2026-06-22T14:15:00Z',
    createdAt: '2026-06-22T14:15:00Z'
  },
  {
    id: uuidv4(),
    cropName: 'Wheat',
    diseaseName: 'Rust (Puccinia)',
    confidence: 95.1,
    status: 'Treated',
    treatment: 'Apply propiconazole or tebuconazole fungicide at first sign of infection. Two applications 14 days apart may be necessary.',
    preventiveMeasures: 'Plant resistant varieties. Avoid late planting. Remove volunteer wheat plants. Monitor fields regularly during growing season.',
    imageUrl: null,
    diagnosisDate: '2026-06-18T11:00:00Z',
    createdAt: '2026-06-18T11:00:00Z'
  },
  {
    id: uuidv4(),
    cropName: 'Potato',
    diseaseName: 'Late Blight',
    confidence: 89.8,
    status: 'Detected',
    treatment: 'Apply mancozeb or chlorothalonil fungicide immediately. Remove and destroy all infected plant material. Do not compost infected debris.',
    preventiveMeasures: 'Use certified disease-free seed potatoes. Ensure good drainage. Hill soil around plants. Destroy cull piles and volunteer plants.',
    imageUrl: null,
    diagnosisDate: '2026-06-25T09:45:00Z',
    createdAt: '2026-06-25T09:45:00Z'
  },
  {
    id: uuidv4(),
    cropName: 'Cotton',
    diseaseName: 'Bacterial Blight',
    confidence: 78.6,
    status: 'Under Treatment',
    treatment: 'Apply streptomycin sulfate or copper oxychloride spray. Remove severely infected plants from the field.',
    preventiveMeasures: 'Use acid-delinted and treated seeds. Practice crop rotation with non-host crops. Avoid working in fields when foliage is wet.',
    imageUrl: null,
    diagnosisDate: '2026-06-23T16:20:00Z',
    createdAt: '2026-06-23T16:20:00Z'
  },
  {
    id: uuidv4(),
    cropName: 'Maize',
    diseaseName: 'Northern Leaf Blight',
    confidence: 84.2,
    status: 'Treated',
    treatment: 'Apply azoxystrobin or pyraclostrobin fungicide. Timing is critical — apply at first symptoms or at tasseling stage.',
    preventiveMeasures: 'Plant resistant hybrids. Practice crop rotation. Ensure proper tillage to bury infected residue. Avoid planting in areas with known disease history.',
    imageUrl: null,
    diagnosisDate: '2026-06-15T07:30:00Z',
    createdAt: '2026-06-15T07:30:00Z'
  }
];

// ──────────────────────────────────────────────
// In-memory advisory records (seed data)
// ──────────────────────────────────────────────
const advisories = [
  {
    id: uuidv4(),
    question: 'How to prevent tomato leaf blight?',
    answer: 'To prevent tomato leaf blight, follow these key practices:\n\n1. **Crop Rotation**: Rotate tomatoes with non-solanaceous crops every 2-3 years.\n2. **Proper Spacing**: Maintain 60-90 cm between plants for air circulation.\n3. **Water Management**: Use drip irrigation instead of overhead watering. Water early morning so foliage dries quickly.\n4. **Mulching**: Apply organic mulch to prevent soil splash onto lower leaves.\n5. **Resistant Varieties**: Choose varieties like "Mountain Merit" or "Defiant PhR" that have blight resistance.\n6. **Preventive Sprays**: Apply copper-based fungicide every 7-10 days during humid conditions.',
    category: 'Disease Prevention',
    createdAt: '2026-06-19T10:00:00Z'
  },
  {
    id: uuidv4(),
    question: 'Best time to plant wheat in monsoon?',
    answer: 'Wheat is a **rabi (winter) crop** and should NOT be planted during the monsoon season. Here is the ideal timeline:\n\n1. **Sowing Period**: October to November (after monsoon ends).\n2. **Optimal Temperature**: 20-25°C for germination, 15-20°C for growth.\n3. **Harvesting**: March to April.\n\nIf you are in a monsoon-affected region, prepare your land during late monsoon (September) by:\n- Plowing and leveling the field\n- Applying basal fertilizer\n- Ensuring proper drainage\n- Testing soil pH (ideal: 6.0-7.5)',
    category: 'Seasonal Planning',
    createdAt: '2026-06-20T12:30:00Z'
  },
  {
    id: uuidv4(),
    question: 'Organic fertilizers for rice farming',
    answer: 'Here are the best organic fertilizers for rice farming:\n\n1. **Green Manure**: Grow and plow in leguminous crops (Sesbania, Dhaincha) before transplanting rice. Adds 60-80 kg N/ha.\n2. **Farm Yard Manure (FYM)**: Apply 10-12 tonnes/ha during land preparation.\n3. **Vermicompost**: Apply 2-3 tonnes/ha. Rich in NPK and beneficial microorganisms.\n4. **Azolla**: A floating fern that fixes atmospheric nitrogen. Apply as green manure — adds 25-30 kg N/ha.\n5. **Neem Cake**: Apply 250 kg/ha. Acts as both fertilizer and pest repellent.\n6. **Bio-fertilizers**: Use Azospirillum and Phosphobacteria — apply to seedlings before transplanting.',
    category: 'Soil & Fertilizers',
    createdAt: '2026-06-21T09:15:00Z'
  },
  {
    id: uuidv4(),
    question: 'Managing water for cotton crops',
    answer: 'Water management is critical for cotton. Follow these guidelines:\n\n1. **Irrigation Schedule**:\n   - First irrigation: 3-4 weeks after sowing\n   - Subsequent: every 15-20 days during vegetative stage\n   - Critical stages: flowering and boll development (do not allow water stress)\n\n2. **Water Requirement**: 700-1200 mm total across the growing season.\n\n3. **Drainage**: Cotton is sensitive to waterlogging. Ensure proper drainage, especially during monsoon.\n\n4. **Techniques**:\n   - Furrow irrigation is most common\n   - Drip irrigation saves 40-60% water and increases yield by 20-30%\n   - Sprinkler irrigation can be used but avoid during flowering\n\n5. **Mulching**: Reduces evaporation by 20-25%. Use straw or polyethylene mulch.',
    category: 'Water Management',
    createdAt: '2026-06-22T15:45:00Z'
  },
  {
    id: uuidv4(),
    question: 'How to identify pest infestation in maize?',
    answer: 'Common pest infestations in maize and how to identify them:\n\n1. **Fall Armyworm**: Look for ragged holes in leaves, frass (excrement) in the whorl, and caterpillars with an inverted Y on the head.\n2. **Stem Borer**: Deadheart symptom in young plants, small round holes in stems, sawdust-like frass near holes.\n3. **Aphids**: Clusters of small green/black insects on undersides of leaves, sticky honeydew, sooty mold.\n4. **Shoot Fly**: Deadheart in seedlings (central leaf dries and can be pulled out easily).\n\n**Action Steps**:\n- Scout fields weekly, especially during vegetative growth\n- Use pheromone traps for monitoring\n- Apply neem oil (5ml/L) as first organic intervention\n- For severe infestation, consult local agricultural extension officer',
    category: 'Pest Management',
    createdAt: '2026-06-24T08:00:00Z'
  }
];

module.exports = { diagnoses, advisories };
