const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');

// Load environment variables
dotenv.config();

const samplePackages = [
  {
    title: 'Bali Tropical Paradise & Cultural Retreat',
    description: 'Immerse yourself in Bali’s lush rice terraces, ancient sacred temples, vibrant art markets, and pristine tropical beaches.',
    destination: 'Bali, Indonesia',
    price: 1299,
    duration: 7,
    maxGroupSize: 12,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar & Ubud Transfer', description: 'Airport greeting, private transfer to Ubud resort, and welcome Balinese dinner.' },
      { day: 2, title: 'Sacred Monkey Forest & Tegallalang', description: 'Morning walk in the sacred monkey sanctuary followed by iconic rice terrace swings.' },
      { day: 3, title: 'Mount Batur Sunrise Hike', description: 'Early morning guided trek to the caldera rim with breakfast cooked in volcanic steam.' },
      { day: 4, title: 'Ulun Danu Beratan & Waterfall Chase', description: 'Visit the scenic lake temple and swim in Banyumala twin waterfalls.' },
      { day: 5, title: 'Seminyak Beach Day & Sunset Cruise', description: 'Transfer to south Bali, relax on golden sands, and enjoy an evening catamaran sunset tour.' },
      { day: 6, title: 'Uluwatu Cliff Temple & Kecak Dance', description: 'Explore cliffside temple perches and witness the spellbinding Kecak fire performance at dusk.' },
      { day: 7, title: 'Souvenir Markets & Departure', description: 'Leisure morning, last-minute shopping at Ubud Art Market, and transfer to airport.' },
    ],
    included: ['4-star boutique hotel stay', 'Daily breakfast & 4 dinners', 'Private air-conditioned transport', 'All temple entrance fees', 'English-speaking guide'],
    excluded: ['International airfare', 'Alcoholic drinks', 'Personal tips'],
    featured: true,
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    title: 'Swiss Alps Majestic Rail & Glacier Discovery',
    description: 'Experience panoramic train rides through alpine valleys, snowcapped peaks, crystal lakes, and charming Swiss chalets.',
    destination: 'Interlaken & Zermatt, Switzerland',
    price: 2499,
    duration: 6,
    maxGroupSize: 10,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Zurich to Lucerne & Lake Cruise', description: 'Arrive in Zurich, scenic train to Lucerne, Chapel Bridge tour, and sunset lake boat cruise.' },
      { day: 2, title: 'Mount Pilatus Golden Roundtrip', description: 'Ascend by boat, cogwheel railway, and descent by cable car with breathtaking mountain views.' },
      { day: 3, title: 'Interlaken & Lauterbrunnen Waterfalls', description: 'Explore the valley of 72 waterfalls and ride the funicular to Harder Kulm viewpoint.' },
      { day: 4, title: 'Jungfraujoch - Top of Europe', description: 'Cogwheel train journey up to Europe’s highest railway station at 3,454 meters.' },
      { day: 5, title: 'Scenic Glacier Express to Zermatt', description: 'Ride the world’s slowest express train into the car-free village beneath the Matterhorn.' },
      { day: 6, title: 'Gornergrat Viewpoint & Departure', description: 'Morning panoramic view of the Matterhorn before return train to Zurich airport.' },
    ],
    included: ['Swiss Travel Pass (First Class)', 'Alpine hotel accommodation', 'Breakfast included daily', 'Jungfraujoch and Pilatus excursion tickets'],
    excluded: ['Flights to/from Switzerland', 'Ski gear rentals', 'Travel insurance'],
    featured: true,
    rating: 4.95,
    reviewsCount: 34,
  },
  {
    title: 'Kyoto & Tokyo: Ancient Traditions & Neon Dreams',
    description: 'A captivating fusion of feudal temples, bamboo groves, tea ceremonies, and futuristic Tokyo neon skylines.',
    destination: 'Kyoto & Tokyo, Japan',
    price: 1850,
    duration: 8,
    maxGroupSize: 14,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Tokyo & Shinjuku Neon Night', description: 'Check-in to Shinjuku hotel, evening walk through Omoide Yokocho and Shibuya Crossing.' },
      { day: 2, title: 'Asakusa Senso-ji & Akihabara', description: 'Historic Senso-ji temple, traditional Nakamise shopping, and modern Akihabara electronics district.' },
      { day: 3, title: 'Meiji Shrine & Harajuku Culture', description: 'Peaceful stroll in Meiji Jingu forest followed by youth fashion and street treats on Takeshita Street.' },
      { day: 4, title: 'Shinkansen Bullet Train to Kyoto', description: '300 km/h bullet train to Kyoto, check into ryokan inn, traditional Kaiseki banquet dinner.' },
      { day: 5, title: 'Fushimi Inari & Gion Geisha District', description: 'Thousands of vermilion torii gates at sunrise and evening walking tour of historic Gion alleys.' },
      { day: 6, title: 'Arashiyama Bamboo Grove & Golden Pavilion', description: 'Walk through towering bamboo stalks and admire the reflective Kinkaku-ji Zen temple.' },
      { day: 7, title: 'Nara Day Excursion', description: 'Meet free-roaming sacred deer in Nara Park and visit the Great Bronze Buddha at Todai-ji.' },
      { day: 8, title: 'Sayonara Japan & Departure', description: 'Matcha tea ceremony workshop and airport transfer via Haruka Express.' },
    ],
    included: ['7-Day Japan Rail Pass', 'Traditional Ryokan + modern hotel stays', 'Welcome Kaiseki dinner', 'Expert local bilingual guides'],
    excluded: ['Flight tickets', 'Baggage shipping fees', 'Optional food tours'],
    featured: true,
    rating: 4.88,
    reviewsCount: 52,
  },
  {
    title: 'Serengeti Wildlife Safari & Ngorongoro Crater',
    description: 'Witness the Great Migration, spot the African Big Five, and camp under the untamed starlit skies of Tanzania.',
    destination: 'Arusha & Serengeti, Tanzania',
    price: 3200,
    duration: 6,
    maxGroupSize: 8,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Arusha to Tarangire National Park', description: 'Drive into Tarangire, famous for gigantic baobab trees and massive elephant herds.' },
      { day: 2, title: 'Journey to the Endless Plains of Serengeti', description: 'Scenic drive across Maasai territory into central Serengeti National Park.' },
      { day: 3, title: 'Full-Day Serengeti Big Five Game Drive', description: 'Morning and afternoon game drives tracking lions, cheetahs, and migrating wildebeests.' },
      { day: 4, title: 'Ngorongoro Crater Caldera Safari', description: 'Descend 600m into the UNESCO volcanic caldera harboring dense wildlife and black rhinos.' },
      { day: 5, title: 'Lake Manyara & Tree-Climbing Lions', description: 'Pink flamingos lining the alkaline lake and bird watching in groundwater forests.' },
      { day: 6, title: 'Maasai Cultural Village & Return to Arusha', description: 'Traditional boma cultural experience and transfer to Kilimanjaro International Airport.' },
    ],
    included: ['Custom 4x4 Land Cruiser with pop-up roof', 'Luxury tented safari camps', 'All national park conservation fees', 'Professional safari guide & tracker'],
    excluded: ['Tanzania tourist visa', 'Hot air balloon safari upgrade', 'Gratuities for guide/camp staff'],
    featured: false,
    rating: 4.97,
    reviewsCount: 29,
  },
  {
    title: 'Amalfi Coast & Capri Cliffside Odyssey',
    description: 'Marvel at pastel-colored villages clinging to dramatic cliffs, lemon groves, turquoise waters, and decadent Italian cuisine.',
    destination: 'Amalfi Coast, Italy',
    price: 2150,
    duration: 5,
    maxGroupSize: 12,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Naples to Sorrento & Limoncello Tasting', description: 'Private transfer from Naples, stroll Sorrento piazza, and artisan limoncello workshop.' },
      { day: 2, title: 'Positano & Amalfi Panoramic Drive', description: 'Drive the world-famous Amalfi scenic coast road, explore Positano pebbled beach and boutiques.' },
      { day: 3, title: 'Path of the Gods Hiking Adventure', description: 'Hike the legendary clifftop trail with uninterrupted views over the Tyrrhenian Sea.' },
      { day: 4, title: 'Private Boat Excursion to Isle of Capri', description: 'Sail around Capri, swim in hidden sea grottos, and explore Anacapri villas.' },
      { day: 5, title: 'Ravello Gardens & Departure', description: 'Visit Villa Rufolo’s romantic cliff gardens before return private transfer to Naples.' },
    ],
    included: ['Sea-view cliffside boutique hotel', 'Capri private boat charter', 'All land transfers', 'Daily Italian breakfast and wine tastings'],
    excluded: ['International airfare', 'City tourist tax', 'Lunches'],
    featured: true,
    rating: 4.85,
    reviewsCount: 41,
  },
  {
    title: 'Icelandic Ring Road: Geysers, Glaciers & Auroras',
    description: 'Chasing the magical Northern Lights, soaking in geothermal hot springs, and hiking through volcanic ice caves.',
    destination: 'Reykjavik & South Coast, Iceland',
    price: 2350,
    duration: 7,
    maxGroupSize: 10,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Blue Lagoon Geothermal Soak', description: 'Direct pickup from Keflavik airport to relax in the healing silica mineral waters.' },
      { day: 2, title: 'The Legendary Golden Circle', description: 'Explore Thingvellir continental rift, Strokkur erupting geyser, and Gullfoss golden falls.' },
      { day: 3, title: 'Seljalandsfoss & Skogafoss Waterfalls', description: 'Walk behind cascading waterfalls and visit the Black Sand Beach of Reynisfjara.' },
      { day: 4, title: 'Skaftafell Glacier Trek & Ice Cave', description: 'Strap on crampons for a guided walk atop Vatnajökull glacier and crystal blue ice caves.' },
      { day: 5, title: 'Jokulsarlon Glacier Lagoon & Diamond Beach', description: 'Watch icebergs drift out to sea and glisten like diamonds on volcanic black sands.' },
      { day: 6, title: 'Snæfellsnes Peninsula & Kirkjufell', description: 'Photograph the iconic arrowhead mountain and scenic coastal fishing villages.' },
      { day: 7, title: 'Reykjavik Sightseeing & Departure', description: 'Harpa Concert Hall, Hallgrimskirkja church, and transfer back to airport.' },
    ],
    included: ['All 4x4 expedition transport', 'Comfort hotels with private bath', 'Glacier trek gear & certified ice guide', 'Blue Lagoon Premium entry'],
    excluded: ['Flights', 'Warm thermal boots rental', 'Lunches & dinners'],
    featured: false,
    rating: 4.92,
    reviewsCount: 38,
  },
  {
    title: 'Rajasthan Royal Palaces & Thar Desert Safari',
    description: 'Live like royalty among golden sandstone fortresses, majestic marble palaces, and sunset camel rides over desert dunes.',
    destination: 'Jaipur, Jodhpur & Udaipur, India',
    price: 1100,
    duration: 7,
    maxGroupSize: 14,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Jaipur (The Pink City)', description: 'Airport welcome with flower garlands, check-in to heritage haveli, and evening local bazaar visit.' },
      { day: 2, title: 'Amber Fort & Hawa Mahal', description: 'Ascend Amber Fort ramparts, marvel at Sheesh Mahal mirrors, and photograph the Palace of Winds.' },
      { day: 3, title: 'Blue City of Jodhpur & Mehrangarh Fort', description: 'Scenic drive to Jodhpur, tour one of India’s largest forts overlooking indigo-painted houses.' },
      { day: 4, title: 'Thar Desert Camp & Camel Trek', description: 'Sunset camel safari over Sam Sand Dunes, followed by Rajasthani folk dances and bonfire dinner.' },
      { day: 5, title: 'Ranakpur Jain Temples & Drive to Udaipur', description: 'Explore the 1,444 uniquely carved marble pillars of Ranakpur nestled in the Aravalli hills.' },
      { day: 6, title: 'City of Lakes: Udaipur Palace & Lake Pichola', description: 'Tour the grand City Palace complex and enjoy a private sunset boat cruise on Lake Pichola.' },
      { day: 7, title: 'Saheliyon-ki-Bari & Departure', description: 'Visit the royal garden of fountains before transfer to Udaipur Airport.' },
    ],
    included: ['Heritage Palace Hotel stays', 'Air-conditioned chauffeured vehicle', 'Desert luxury tent with dinner & folk show', 'English-speaking government-approved guides'],
    excluded: ['Camera fees at monuments', 'International/domestic flights', 'Personal expenses'],
    featured: true,
    rating: 4.89,
    reviewsCount: 44,
  },
  {
    title: 'Greek Islands Sailing Odyssey: Santorini & Mykonos',
    description: 'Sail the sparkling Aegean Sea, admire iconic whitewashed windmills, blue-domed churches, and world-renowned sunsets.',
    destination: 'Athens, Mykonos & Santorini, Greece',
    price: 1980,
    duration: 6,
    maxGroupSize: 12,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    ],
    itinerary: [
      { day: 1, title: 'Athens Acropolis & Evening Plaka', description: 'Explore the Parthenon citadel and enjoy dinner in the lively pedestrian streets of Plaka.' },
      { day: 2, title: 'High-speed Ferry to Mykonos', description: 'Voyage to the Cyclades, stroll Little Venice, and photograph the iconic 16th-century windmills.' },
      { day: 3, title: 'Delos Ancient Ruins & Beach Day', description: 'Morning boat to the sacred UNESCO sanctuary of Apollo on Delos, afternoon relax at Ornos Beach.' },
      { day: 4, title: 'Ferry to Santorini & Fira Cliff Walk', description: 'Catamaran to Santorini, check in to caldera view hotel, and take scenic cliffside walk.' },
      { day: 5, title: 'Volcano Catamaran Cruise & Oia Sunset', description: 'Sail to volcanic hot springs, snorkel crystal coves, and watch the legendary sunset in Oia.' },
      { day: 6, title: 'Akrotiri Prehistoric City & Departure', description: 'Tour preserved Minoan bronze age ruins before flight or ferry connection to Athens.' },
    ],
    included: ['Hydrofoil ferry tickets between islands', 'Caldera-view and boutique hotel stays', 'Santorini semi-private sunset catamaran cruise with BBQ', 'Daily Mediterranean breakfast'],
    excluded: ['International flights', 'Greek stay resilience tax', 'Personal shopping'],
    featured: true,
    rating: 4.91,
    reviewsCount: 39,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/wander_world';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing packages...');
    await Package.deleteMany();

    console.log(`Inserting ${samplePackages.length} tourism packages...`);
    const createdPackages = await Package.insertMany(samplePackages);

    console.log('----------------------------------------------------');
    console.log(`SUCCESS: Successfully seeded ${createdPackages.length} packages into the database!`);
    createdPackages.forEach((pkg, index) => {
      console.log(`  ${index + 1}. [${pkg.destination}] ${pkg.title} - $${pkg.price} (${pkg.duration} days)`);
    });
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('ERROR during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
