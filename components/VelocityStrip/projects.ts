export interface Project {
  id: number;
  title: string;
  slug: string;
  image: string;
  gallery: string[];
  color: {
    bg: string;      // Background color for project mode
    text: string;    // Text color
    multiply: number; // Multiply factor for neighbours
  };
  letterPositions: number[]; // Per-letter X positions as % of title width
  meta: {
    completed: string;
    type: string;
    role: string;
    client: string;
  };
  description: string;
}

// Sample projects with fashion/design themes
export const projects: Project[] = [
  {
    id: 1,
    title: "ATELIER",
    slug: "atelier",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#e8e7e4", text: "#1a1a1a", multiply: 0.6 },
    letterPositions: [0, 15, 30, 45, 60, 75, 90],
    meta: { completed: "2024", type: "Fashion", role: "Art Direction", client: "Atelier Studio" },
    description: "A curated collection exploring minimalist fashion aesthetics."
  },
  {
    id: 2,
    title: "NOIR",
    slug: "noir",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#0a0a0a", text: "#fafafa", multiply: 0.3 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2024", type: "Editorial", role: "Creative Direction", client: "Noir Magazine" },
    description: "Bold editorial series in monochrome."
  },
  {
    id: 3,
    title: "VELVET",
    slug: "velvet",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#2d1f3d", text: "#fafafa", multiply: 0.5 },
    letterPositions: [0, 16, 32, 48, 64, 80],
    meta: { completed: "2023", type: "Campaign", role: "Photography", client: "Velvet House" },
    description: "Luxurious textures and rich tones."
  },
  {
    id: 4,
    title: "SILK",
    slug: "silk",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f5f0eb", text: "#1a1a1a", multiply: 0.7 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2023", type: "Lookbook", role: "Styling", client: "Silk & Co" },
    description: "Flowing forms and delicate draping."
  },
  {
    id: 5,
    title: "EMBER",
    slug: "ember",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#1a0a0a", text: "#ff6b4a", multiply: 0.4 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Show", role: "Production", client: "Ember Fashion" },
    description: "Warm hues meet dramatic silhouettes."
  },
  {
    id: 6,
    title: "FROST",
    slug: "frost",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#e8f4f8", text: "#1a2a3a", multiply: 0.6 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Editorial", role: "Art Direction", client: "Frost Studio" },
    description: "Cool tones and crystalline clarity."
  },
  {
    id: 7,
    title: "MOCHA",
    slug: "mocha",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#3d2b1f", text: "#f5e6d3", multiply: 0.5 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Campaign", role: "Creative Direction", client: "Mocha Label" },
    description: "Earth tones and natural textures."
  },
  {
    id: 8,
    title: "JADE",
    slug: "jade",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#1a3d2b", text: "#e8f5e9", multiply: 0.5 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2023", type: "Lookbook", role: "Photography", client: "Jade Collective" },
    description: "Verdant hues and organic forms."
  },
  {
    id: 9,
    title: "SABLE",
    slug: "sable",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#2b2520", text: "#d4c4b0", multiply: 0.4 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Show", role: "Styling", client: "Sable Paris" },
    description: "Deep neutrals and understated elegance."
  },
  {
    id: 10,
    title: "AZURE",
    slug: "azure",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#1a2a4a", text: "#c0d8f0", multiply: 0.5 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Editorial", role: "Art Direction", client: "Azure Magazine" },
    description: "Oceanic depths and celestial heights."
  },
  {
    id: 11,
    title: "CORAL",
    slug: "coral",
    image: "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#fff0ed", text: "#4a2a25", multiply: 0.6 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Campaign", role: "Creative Direction", client: "Coral & Rose" },
    description: "Soft pinks and living hues."
  },
  {
    id: 12,
    title: "SLATE",
    slug: "slate",
    image: "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#3a3a4a", text: "#e0e0e8", multiply: 0.5 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Lookbook", role: "Production", client: "Slate Atelier" },
    description: "Industrial grey meets refined minimalism."
  },
  {
    id: 13,
    title: "BLUSH",
    slug: "blush",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f8e8e8", text: "#4a3030", multiply: 0.6 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Editorial", role: "Styling", client: "Blush Studio" },
    description: "Delicate warmth and feminine grace."
  },
  {
    id: 14,
    title: "ONYX",
    slug: "onyx",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#0a0a0a", text: "#fafafa", multiply: 0.3 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2023", type: "Show", role: "Art Direction", client: "Onyx Collective" },
    description: "Pure black and absolute contrast."
  },
  {
    id: 15,
    title: "PEARL",
    slug: "pearl",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f8f8f5", text: "#2a2a2a", multiply: 0.7 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Campaign", role: "Photography", client: "Pearl & Lace" },
    description: "Luminous whites and iridescent sheen."
  },
  {
    id: 16,
    title: "DUSK",
    slug: "dusk",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#2a1a3a", text: "#e8d0f0", multiply: 0.5 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2023", type: "Lookbook", role: "Creative Direction", client: "Dusk House" },
    description: "Twilight hues and dreamy gradients."
  },
  {
    id: 17,
    title: "STORM",
    slug: "storm",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#1a1a2a", text: "#a0b0c0", multiply: 0.4 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Editorial", role: "Production", client: "Storm Agency" },
    description: "Electric energy and dynamic movement."
  },
  {
    id: 18,
    title: "SAGE",
    slug: "sage",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#e8f0e8", text: "#2a3a2a", multiply: 0.6 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2023", type: "Campaign", role: "Styling", client: "Sage & Stone" },
    description: "Natural greens and botanical inspiration."
  },
  {
    id: 19,
    title: "RAVEN",
    slug: "raven",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#0a0a10", text: "#8080a0", multiply: 0.3 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Show", role: "Art Direction", client: "Raven Studio" },
    description: "Midnight black with subtle iridescence."
  },
  {
    id: 20,
    title: "IVORY",
    slug: "ivory",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f5f5f0", text: "#3a3a35", multiply: 0.7 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Lookbook", role: "Photography", client: "Ivory & Co" },
    description: "Timeless white and classic elegance."
  },
  {
    id: 21,
    title: "RUSSET",
    slug: "russet",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#3d2015", text: "#e8d0c0", multiply: 0.5 },
    letterPositions: [0, 15, 30, 45, 60, 75],
    meta: { completed: "2024", type: "Editorial", role: "Creative Direction", client: "Russet Label" },
    description: "Autumn warmth and burnished tones."
  },
  {
    id: 22,
    title: "COBALT",
    slug: "cobalt",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#0a1a4a", text: "#a0c0f0", multiply: 0.4 },
    letterPositions: [0, 15, 30, 45, 60, 75],
    meta: { completed: "2023", type: "Campaign", role: "Production", client: "Cobalt Agency" },
    description: "Intense blue and electric accents."
  },
  {
    id: 23,
    title: "AMBER",
    slug: "amber",
    image: "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#4a3010", text: "#f8e8c0", multiply: 0.5 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2024", type: "Show", role: "Styling", client: "Amber House" },
    description: "Golden warmth and fossilized beauty."
  },
  {
    id: 24,
    title: "CHROME",
    slug: "chrome",
    image: "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#e8e8e8", text: "#2a2a2a", multiply: 0.6 },
    letterPositions: [0, 15, 30, 45, 60, 75],
    meta: { completed: "2023", type: "Lookbook", role: "Art Direction", client: "Chrome Atelier" },
    description: "Metallic sheen and futuristic polish."
  },
  {
    id: 25,
    title: "ROSE",
    slug: "rose",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f0e0e8", text: "#4a2030", multiply: 0.6 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2024", type: "Editorial", role: "Photography", client: "Rose Garden" },
    description: "Romantic pinks and floral softness."
  },
  {
    id: 26,
    title: "UMBER",
    slug: "umber",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#2a1810", text: "#d8c8b8", multiply: 0.4 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Campaign", role: "Creative Direction", client: "Umber Studio" },
    description: "Raw earth and primal elegance."
  },
  {
    id: 27,
    title: "MINT",
    slug: "mint",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1475180429745-84bd802dc4b2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1485968579169-9e000f8b6b5b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#e8f8f0", text: "#1a3a2a", multiply: 0.6 },
    letterPositions: [0, 25, 50, 75],
    meta: { completed: "2024", type: "Show", role: "Production", client: "Mint Collective" },
    description: "Fresh green and cooling clarity."
  },
  {
    id: 28,
    title: "EBONY",
    slug: "ebony",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#0a0808", text: "#f0e8e0", multiply: 0.3 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Lookbook", role: "Styling", client: "Ebony & Oak" },
    description: "Deep black and wood-like warmth."
  },
  {
    id: 29,
    title: "QUARTZ",
    slug: "quartz",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#f8f0f8", text: "#3a2a3a", multiply: 0.6 },
    letterPositions: [0, 15, 30, 45, 60, 75],
    meta: { completed: "2024", type: "Editorial", role: "Art Direction", client: "Quartz Agency" },
    description: "Crystal clarity and prismatic light."
  },
  {
    id: 30,
    title: "TERRA",
    slug: "terra",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop",
    ],
    color: { bg: "#c8a080", text: "#2a1a10", multiply: 0.5 },
    letterPositions: [0, 20, 40, 60, 80],
    meta: { completed: "2023", type: "Campaign", role: "Photography", client: "Terra Firma" },
    description: "Earthy terracotta and grounded warmth."
  },
];
