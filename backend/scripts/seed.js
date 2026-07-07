/**
 * Database Seed Script
 * Populates MongoDB with initial crop, diagnosis, and advisory data.
 *
 * Usage: npm run seed
 */

const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Use Google DNS — fixes ECONNREFUSED on ISPs blocking MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const Crop = require('../models/Crop');
const Diagnosis = require('../models/Diagnosis');
const Advisory = require('../models/Advisory');

// ──────────────────────────────────────────────
// Seed Data
// ──────────────────────────────────────────────

const crops = [
  { name: 'Tomato', season: 'Kharif / Rabi', region: 'All India' },
  { name: 'Rice', season: 'Kharif', region: 'Eastern & Southern India' },
  { name: 'Wheat', season: 'Rabi', region: 'Northern & Central India' },
  { name: 'Potato', season: 'Rabi', region: 'Northern India' },
  { name: 'Cotton', season: 'Kharif', region: 'Western & Central India' },
  { name: 'Maize', season: 'Kharif / Rabi', region: 'All India' },
];

const diagnosesData = [
  {
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    confidence: 92.5,
    status: 'Treated',
    treatment:
      'Apply copper-based fungicide such as Bordeaux mixture. Remove and destroy infected leaves. Ensure proper spacing between plants for air circulation.',
    preventiveMeasures:
      'Rotate crops every 2-3 years. Avoid overhead watering. Use drip irrigation. Apply mulch around the base of plants.',
    diagnosisDate: new Date('2026-06-20T08:30:00Z'),
  },
  {
    cropName: 'Rice',
    diseaseName: 'Blast Disease',
    confidence: 87.3,
    status: 'Under Treatment',
    treatment:
      'Apply tricyclazole or isoprothiolane fungicide. Drain the field and allow to dry for 2-3 days before re-flooding.',
    preventiveMeasures:
      'Use resistant varieties like IR64. Avoid excessive nitrogen fertilization. Maintain proper water management.',
    diagnosisDate: new Date('2026-06-22T14:15:00Z'),
  },
  {
    cropName: 'Wheat',
    diseaseName: 'Rust (Puccinia)',
    confidence: 95.1,
    status: 'Treated',
    treatment:
      'Apply propiconazole or tebuconazole fungicide at first sign of infection. Two applications 14 days apart may be necessary.',
    preventiveMeasures:
      'Plant resistant varieties. Avoid late planting. Remove volunteer wheat plants. Monitor fields regularly during growing season.',
    diagnosisDate: new Date('2026-06-18T11:00:00Z'),
  },
  {
    cropName: 'Potato',
    diseaseName: 'Late Blight',
    confidence: 89.8,
    status: 'Detected',
    treatment:
      'Apply mancozeb or chlorothalonil fungicide immediately. Remove and destroy all infected plant material. Do not compost infected debris.',
    preventiveMeasures:
      'Use certified disease-free seed potatoes. Ensure good drainage. Hill soil around plants. Destroy cull piles and volunteer plants.',
    diagnosisDate: new Date('2026-06-25T09:45:00Z'),
  },
  {
    cropName: 'Cotton',
    diseaseName: 'Bacterial Blight',
    confidence: 78.6,
    status: 'Under Treatment',
    treatment:
      'Apply streptomycin sulfate or copper oxychloride spray. Remove severely infected plants from the field.',
    preventiveMeasures:
      'Use acid-delinted and treated seeds. Practice crop rotation with non-host crops. Avoid working in fields when foliage is wet.',
    diagnosisDate: new Date('2026-06-23T16:20:00Z'),
  },
  {
    cropName: 'Maize',
    diseaseName: 'Northern Leaf Blight',
    confidence: 84.2,
    status: 'Treated',
    treatment:
      'Apply azoxystrobin or pyraclostrobin fungicide. Timing is critical — apply at first symptoms or at tasseling stage.',
    preventiveMeasures:
      'Plant resistant hybrids. Practice crop rotation. Ensure proper tillage to bury infected residue. Avoid planting in areas with known disease history.',
    diagnosisDate: new Date('2026-06-15T07:30:00Z'),
  },
];

const advisoriesData = [
  {
    question: 'How to prevent tomato leaf blight?',
    answer:
      'To prevent tomato leaf blight, follow these key practices:\n\n1. **Crop Rotation**: Rotate tomatoes with non-solanaceous crops every 2-3 years.\n2. **Proper Spacing**: Maintain 60-90 cm between plants for air circulation.\n3. **Water Management**: Use drip irrigation instead of overhead watering. Water early morning so foliage dries quickly.\n4. **Mulching**: Apply organic mulch to prevent soil splash onto lower leaves.\n5. **Resistant Varieties**: Choose varieties like "Mountain Merit" or "Defiant PhR" that have blight resistance.\n6. **Preventive Sprays**: Apply copper-based fungicide every 7-10 days during humid conditions.',
    category: 'Disease Prevention',
  },
  {
    question: 'Best time to plant wheat in monsoon?',
    answer:
      'Wheat is a **rabi (winter) crop** and should NOT be planted during the monsoon season. Here is the ideal timeline:\n\n1. **Sowing Period**: October to November (after monsoon ends).\n2. **Optimal Temperature**: 20-25°C for germination, 15-20°C for growth.\n3. **Harvesting**: March to April.\n\nIf you are in a monsoon-affected region, prepare your land during late monsoon (September) by:\n- Plowing and leveling the field\n- Applying basal fertilizer\n- Ensuring proper drainage\n- Testing soil pH (ideal: 6.0-7.5)',
    category: 'Seasonal Planning',
  },
  {
    question: 'Organic fertilizers for rice farming',
    answer:
      'Here are the best organic fertilizers for rice farming:\n\n1. **Green Manure**: Grow and plow in leguminous crops (Sesbania, Dhaincha) before transplanting rice. Adds 60-80 kg N/ha.\n2. **Farm Yard Manure (FYM)**: Apply 10-12 tonnes/ha during land preparation.\n3. **Vermicompost**: Apply 2-3 tonnes/ha. Rich in NPK and beneficial microorganisms.\n4. **Azolla**: A floating fern that fixes atmospheric nitrogen. Apply as green manure — adds 25-30 kg N/ha.\n5. **Neem Cake**: Apply 250 kg/ha. Acts as both fertilizer and pest repellent.\n6. **Bio-fertilizers**: Use Azospirillum and Phosphobacteria — apply to seedlings before transplanting.',
    category: 'Soil & Fertilizers',
  },
  {
    question: 'Managing water for cotton crops',
    answer:
      'Water management is critical for cotton. Follow these guidelines:\n\n1. **Irrigation Schedule**:\n   - First irrigation: 3-4 weeks after sowing\n   - Subsequent: every 15-20 days during vegetative stage\n   - Critical stages: flowering and boll development (do not allow water stress)\n\n2. **Water Requirement**: 700-1200 mm total across the growing season.\n\n3. **Drainage**: Cotton is sensitive to waterlogging. Ensure proper drainage, especially during monsoon.\n\n4. **Techniques**:\n   - Furrow irrigation is most common\n   - Drip irrigation saves 40-60% water and increases yield by 20-30%\n   - Sprinkler irrigation can be used but avoid during flowering\n\n5. **Mulching**: Reduces evaporation by 20-25%. Use straw or polyethylene mulch.',
    category: 'Water Management',
  },
  {
    question: 'How to identify pest infestation in maize?',
    answer:
      'Common pest infestations in maize and how to identify them:\n\n1. **Fall Armyworm**: Look for ragged holes in leaves, frass (excrement) in the whorl, and caterpillars with an inverted Y on the head.\n2. **Stem Borer**: Deadheart symptom in young plants, small round holes in stems, sawdust-like frass near holes.\n3. **Aphids**: Clusters of small green/black insects on undersides of leaves, sticky honeydew, sooty mold.\n4. **Shoot Fly**: Deadheart in seedlings (central leaf dries and can be pulled out easily).\n\n**Action Steps**:\n- Scout fields weekly, especially during vegetative growth\n- Use pheromone traps for monitoring\n- Apply neem oil (5ml/L) as first organic intervention\n- For severe infestation, consult local agricultural extension officer',
    category: 'Pest Management',
  },
];

// ──────────────────────────────────────────────
// Seed Function
// ──────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    console.log('\n🌱 Seeding CropCare AI Database...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('   ✓ Connected to MongoDB');

    // Clear existing data
    await Crop.deleteMany({});
    await Diagnosis.deleteMany({});
    await Advisory.deleteMany({});
    console.log('   ✓ Cleared existing data');

    // Insert crops
    const createdCrops = await Crop.insertMany(crops);
    console.log(`   ✓ Inserted ${createdCrops.length} crops`);

    // Build a name → ObjectId lookup map
    const cropMap = {};
    createdCrops.forEach((c) => {
      cropMap[c.name] = c._id;
    });

    // Insert diagnoses with crop references
    const diagnosesWithRefs = diagnosesData.map((d) => ({
      ...d,
      crop: cropMap[d.cropName] || null,
    }));
    const createdDiagnoses = await Diagnosis.insertMany(diagnosesWithRefs);
    console.log(`   ✓ Inserted ${createdDiagnoses.length} diagnoses`);

    // Insert advisories
    const createdAdvisories = await Advisory.insertMany(advisoriesData);
    console.log(`   ✓ Inserted ${createdAdvisories.length} advisories`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}\n`);
    process.exit(1);
  }
};

seedDatabase();
