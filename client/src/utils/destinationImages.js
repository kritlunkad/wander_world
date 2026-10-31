// WanderWorld & Odyssey: Destination-specific verified image mapping

const photo = (id, width = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const DESTINATION_GALLERIES = {
  // Greece: Santorini and Mykonos
  greece: {
    hero: photo("photo-1570077188670-e3a8d69ac5ff", 1200),
    gallery: [
      photo("photo-1570077188670-e3a8d69ac5ff", 1200), // Santorini, Oia
      photo("photo-1533105079780-92b9be482077"), // Santorini cliffside steps
      photo("photo-1669842360697-c7eba7310a85"), // Mykonos windmills
      photo("photo-1655535586022-a9e8ed3e2fe4"), // Mykonos whitewashed alley
    ]
  },

  // Japan: Kyoto, Tokyo and Mount Fuji
  japan: {
    hero: photo("photo-1493976040374-85c8e12f0c0e", 1200),
    gallery: [
      photo("photo-1493976040374-85c8e12f0c0e", 1200), // Kyoto traditional street and pagoda
      photo("photo-1503899036084-c55cdd92da26"), // Tokyo neon nightscape
      photo("photo-1545569341-9eb8b30979d9"), // Kyoto pagoda at dusk
      photo("photo-1762018824220-d4a9ebda2b28"), // Chureito Pagoda, Mount Fuji and cherry blossoms
    ]
  },

  // Indonesia: Bali and Ubud
  indonesia: {
    hero: photo("photo-1537996194471-e657df975ab4", 1200),
    gallery: [
      photo("photo-1537996194471-e657df975ab4", 1200), // Bali, Ulun Danu temple
      photo("photo-1555400038-63f5ba517a47"), // Tegallalang rice terraces
      photo("photo-1518548419970-58e3b4079ab2"), // Tanah Lot sea temple at sunset
      photo("photo-1544644181-1484b3fdfc62"), // Ulun Danu temple at Lake Bratan
    ]
  },

  // Switzerland: Swiss Alps and Zermatt
  switzerland: {
    hero: photo("photo-1530122037265-a5f1f91d3b99", 1200),
    gallery: [
      photo("photo-1530122037265-a5f1f91d3b99", 1200), // Lauterbrunnen valley
      photo("photo-1752999050383-0ba4d17bee2a"), // Seealpsee, Appenzell
      photo("photo-1742542172242-507f912f9e35"), // Matterhorn, Riffelsee
      photo("photo-1728319999568-bae91a299865"), // Matterhorn alpine lake
    ]
  },

  // Italy: Amalfi Coast, Positano and Capri
  italy: {
    hero: photo("photo-1723222951245-c45b014c37eb", 1200),
    gallery: [
      photo("photo-1723222951245-c45b014c37eb", 1200), // Positano coastal viewpoint
      photo("photo-1724003751502-88f32de0bad4"), // Positano hillside village
      photo("photo-1724003751639-95379e233bb9"), // Capri harbour and boats
      photo("photo-1779986515034-c5c4f4be6c25"), // Capri rocky coastline and yachts
    ]
  },

  // Tanzania: Serengeti and Ngorongoro
  tanzania: {
    hero: photo("photo-1731994634956-94a42f6b6290", 1200),
    gallery: [
      photo("photo-1731994634956-94a42f6b6290", 1200), // Serengeti giraffe
      photo("photo-1689479665318-0b4ab35256de"), // Serengeti elephant
      photo("photo-1719234522498-6f6ec4e86298"), // Serengeti elephant herd
      photo("photo-1516426122078-c23e76319801"), // African safari vehicle at sunset
    ]
  },

  // Iceland: Vatnajokull, Diamond Beach and northern lights
  iceland: {
    hero: photo("photo-1504893524553-b855bce32c67", 1200),
    gallery: [
      photo("photo-1504893524553-b855bce32c67", 1200), // Fjaðrárgljúfur canyon
      photo("photo-1742316946714-b06b7cb98e53"), // Vatnajokull glacier ice cave
      photo("photo-1671274503532-563633e07688"), // Aurora over Faxafloi
      photo("photo-1780419362292-db29c7dc3c9c"), // Diamond Beach, Iceland
    ]
  },

  // India: Rajasthan, Jaipur, Udaipur and Jodhpur
  india: {
    hero: photo("photo-1477587458883-47145ed94245", 1200),
    gallery: [
      photo("photo-1477587458883-47145ed94245", 1200), // Hawa Mahal, Jaipur
      photo("photo-1715178003372-9f790b685775"), // Lake Pichola, Udaipur
      photo("photo-1602643454724-21d5a40722db"), // Jodhpur Blue City
      photo("photo-1764243213897-45e6def5ad3e"), // Mehrangarh Fort, Jodhpur
    ]
  },
};

// Fallback high-class neutral landscape placeholder when a destination is unconfigured
const NEUTRAL_FALLBACK_HERO = photo("photo-1488646953014-85cb44e25828", 1200);

// Helper: check whether a destination contains any matching keyword
const hasAny = (text, keywords) =>
  keywords.some(keyword => text.includes(keyword));

// Returns the appropriate destination gallery entry.
// Returns null for destinations that are not configured.
export const getDestinationEntry = (item) => {
  if (!item || typeof item !== "object") return null;

  const text = [
    item.destination,
    item.title,
    item.country,
    item.region,
    item.city,
    item.location
  ]
    .filter(value => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (hasAny(text, [
    "greece", "greek", "santorini", "mykonos", "oia"
  ])) {
    return DESTINATION_GALLERIES.greece;
  }

  if (hasAny(text, [
    "japan", "kyoto", "tokyo", "osaka", "fuji"
  ])) {
    return DESTINATION_GALLERIES.japan;
  }

  if (hasAny(text, [
    "bali", "indonesia", "ubud", "tegallalang"
  ])) {
    return DESTINATION_GALLERIES.indonesia;
  }

  if (hasAny(text, [
    "swiss", "switzerland", "interlaken",
    "zermatt", "matterhorn", "lauterbrunnen", "seealpsee"
  ])) {
    return DESTINATION_GALLERIES.switzerland;
  }

  if (hasAny(text, [
    "italy", "italian", "amalfi", "positano",
    "capri", "sorrento", "ravello"
  ])) {
    return DESTINATION_GALLERIES.italy;
  }

  if (hasAny(text, [
    "tanzania", "serengeti", "ngorongoro", "tarangire"
  ])) {
    return DESTINATION_GALLERIES.tanzania;
  }

  if (hasAny(text, [
    "iceland", "reykjavik", "vatnajokull",
    "vatnajökull", "diamond beach", "jokulsarlon",
    "fjaðrárgljúfur", "fjadrargljufur"
  ])) {
    return DESTINATION_GALLERIES.iceland;
  }

  if (hasAny(text, [
    "rajasthan", "jaipur", "udaipur",
    "jodhpur", "jaisalmer", "hawa mahal", "amber fort"
  ])) {
    return DESTINATION_GALLERIES.india;
  }

  return null;
};

// Extract the Unsplash photo ID from a URL
const getUnsplashPhotoId = (url) => {
  if (typeof url !== "string") return null;
  return url.match(/photo-[\w-]+/)?.[0] ?? null;
};

// Safely resolve a package hero image.
// Custom images are accepted only when their ID matches the
// curated hero for that destination. Falls back safely if unconfigured.
export const getDestinationHeroImage = (item) => {
  const entry = getDestinationEntry(item);

  if (!entry) {
    return item?.image || NEUTRAL_FALLBACK_HERO;
  }

  const requestedImageId = getUnsplashPhotoId(item?.image);
  const expectedHeroId = getUnsplashPhotoId(entry.hero);

  if (
    requestedImageId &&
    requestedImageId === expectedHeroId
  ) {
    return item.image;
  }

  return entry.hero;
};

// Returns four destination-specific photographs.
// Unverified custom database galleries are rejected.
export const getDestinationGallery = (pkg) => {
  const entry = getDestinationEntry(pkg);

  if (!entry) {
    const fallbackHero = pkg?.image || NEUTRAL_FALLBACK_HERO;
    return [fallbackHero, fallbackHero, fallbackHero, fallbackHero];
  }

  const allowedIds = new Set(
    [entry.hero, ...entry.gallery].map(getUnsplashPhotoId)
  );

  if (Array.isArray(pkg?.images) && pkg.images.length >= 4) {
    const candidate = pkg.images.slice(0, 4);
    const candidateIds = candidate.map(getUnsplashPhotoId);

    const isVerified =
      candidateIds.every(
        id => id !== null && allowedIds.has(id)
      ) &&
      new Set(candidateIds).size === 4;

    if (isVerified) {
      return candidate;
    }
  }

  return entry.gallery;
};
