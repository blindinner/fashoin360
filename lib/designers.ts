export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Designer {
  id: number;
  name: string;
  category: string;
  image: string;
  bio: string;
  established?: number;
  location: string;
  website?: string;
  instagram?: string;
  products: Product[];
}

// Color schemes per designer - [background, text/accent]
export const colorSchemes: [string, string][] = [
  ["#000000", "#c5a227"], // Gold on black
  ["#000000", "#e8d5b5"], // Cream on black
  ["#000000", "#58a6ff"], // Blue on black
  ["#000000", "#ff6b6b"], // Coral on black
  ["#000000", "#4ade80"], // Green on black
  ["#000000", "#fbbf24"], // Amber on black
  ["#000000", "#a78bfa"], // Purple on black
  ["#000000", "#fb923c"], // Orange on black
  ["#000000", "#2dd4bf"], // Teal on black
  ["#000000", "#f472b6"], // Pink on black
  ["#000000", "#818cf8"], // Indigo on black
  ["#000000", "#f5f5f5"], // White on black
  ["#000000", "#34d399"], // Emerald on black
  ["#000000", "#fcd34d"], // Yellow on black
  ["#000000", "#c084fc"], // Violet on black
  ["#000000", "#38bdf8"], // Sky on black
];

export const designers: Designer[] = [
  {
    id: 1,
    name: "Alon Livné",
    category: "Haute Couture",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    bio: "Alon Livné is an Israeli fashion designer known for his avant-garde bridal and evening wear. His designs have graced red carpets worldwide, worn by celebrities including Beyoncé and Lady Gaga. Livné's work combines architectural precision with romantic femininity.",
    established: 2012,
    location: "Tel Aviv, Israel",
    website: "https://alonlivne.com",
    instagram: "alonlivne",
    products: [
      { id: 101, name: "Sculptural Evening Gown", price: 4500, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80", category: "Evening Wear" },
      { id: 102, name: "Architectural Bridal Dress", price: 8500, image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80", category: "Bridal" },
      { id: 103, name: "Asymmetric Cocktail Dress", price: 2800, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Cocktail" },
      { id: 104, name: "Draped Silk Gown", price: 5200, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80", category: "Evening Wear" },
      { id: 105, name: "Beaded Cape Ensemble", price: 6800, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", category: "Couture" },
      { id: 106, name: "Structured Bustier Top", price: 1800, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", category: "Tops" },
    ],
  },
  {
    id: 2,
    name: "Maskit",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    bio: "Maskit is an iconic Israeli fashion house founded in 1954, reviving traditional craftsmanship with contemporary design. The brand celebrates Middle Eastern heritage through handwoven textiles, intricate embroidery, and artisanal techniques passed down through generations.",
    established: 1954,
    location: "Tel Aviv, Israel",
    website: "https://maskit.com",
    instagram: "maskitisrael",
    products: [
      { id: 201, name: "Handwoven Kaftan", price: 1200, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80", category: "Traditional" },
      { id: 202, name: "Embroidered Linen Dress", price: 890, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", category: "Day Wear" },
      { id: 203, name: "Heritage Scarf Collection", price: 320, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80", category: "Accessories" },
      { id: 204, name: "Artisan Woven Coat", price: 1650, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80", category: "Outerwear" },
      { id: 205, name: "Traditional Embroidered Blouse", price: 580, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 206, name: "Hand-Dyed Silk Wrap", price: 450, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80", category: "Accessories" },
    ],
  },
  {
    id: 3,
    name: "Shahar Avnet",
    category: "Avant-Garde",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    bio: "Shahar Avnet pushes the boundaries of fashion with experimental silhouettes and unconventional materials. Her designs challenge traditional notions of beauty and form, creating wearable art that has been exhibited in museums alongside fashion runways.",
    established: 2015,
    location: "Tel Aviv, Israel",
    instagram: "shaharavnet",
    products: [
      { id: 301, name: "Deconstructed Blazer", price: 1850, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", category: "Outerwear" },
      { id: 302, name: "Sculptural Shoulder Piece", price: 2200, image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80", category: "Statement" },
      { id: 303, name: "Asymmetric Trousers", price: 780, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 304, name: "Geometric Cut-Out Dress", price: 1450, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", category: "Dresses" },
      { id: 305, name: "Layered Mesh Top", price: 680, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 306, name: "Architectural Harness", price: 920, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Accessories" },
    ],
  },
  {
    id: 4,
    name: "Dorin Frankfurt",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    bio: "Dorin Frankfurt brings minimalist sophistication to Israeli fashion with clean lines and impeccable tailoring. Her eponymous label focuses on timeless pieces that transcend seasonal trends, emphasizing quality materials and versatile design.",
    established: 1996,
    location: "Tel Aviv, Israel",
    website: "https://dorinfrankfurt.com",
    instagram: "dorinfrankfurt",
    products: [
      { id: 401, name: "Tailored Wool Coat", price: 1650, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80", category: "Outerwear" },
      { id: 402, name: "Minimalist Shift Dress", price: 720, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Dresses" },
      { id: 403, name: "Wide-Leg Trousers", price: 480, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 404, name: "Structured Blazer", price: 890, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", category: "Outerwear" },
      { id: 405, name: "Silk Button-Down", price: 420, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 406, name: "Pencil Midi Skirt", price: 380, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj3a?w=400&q=80", category: "Bottoms" },
    ],
  },
  {
    id: 5,
    name: "Yvel",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    bio: "Yvel is a world-renowned Israeli jewelry house specializing in natural pearls and precious gems. Each piece is handcrafted by master artisans, combining ancient techniques with contemporary aesthetics to create unique, museum-quality jewelry.",
    established: 1986,
    location: "Jerusalem, Israel",
    website: "https://yvel.com",
    instagram: "aborjewelry",
    products: [
      { id: 501, name: "Baroque Pearl Necklace", price: 12500, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", category: "Necklaces" },
      { id: 502, name: "Diamond Cluster Earrings", price: 8900, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", category: "Earrings" },
      { id: 503, name: "Gold Statement Ring", price: 4200, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80", category: "Rings" },
      { id: 504, name: "Pearl Drop Earrings", price: 5800, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", category: "Earrings" },
      { id: 505, name: "Sapphire Tennis Bracelet", price: 15000, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80", category: "Bracelets" },
      { id: 506, name: "Emerald Pendant", price: 7200, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", category: "Necklaces" },
    ],
  },
  {
    id: 6,
    name: "Razili",
    category: "Ready-to-Wear",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    bio: "Razili creates effortlessly chic ready-to-wear collections for the modern woman. Known for flattering cuts and luxurious fabrics, the brand offers sophisticated wardrobe essentials that transition seamlessly from day to evening.",
    established: 2008,
    location: "Tel Aviv, Israel",
    instagram: "razili_official",
    products: [
      { id: 601, name: "Silk Wrap Blouse", price: 380, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 602, name: "High-Waisted Palazzo Pants", price: 420, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 603, name: "Cashmere Cardigan", price: 650, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", category: "Knitwear" },
      { id: 604, name: "Pleated Midi Dress", price: 520, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Dresses" },
      { id: 605, name: "Linen Blazer", price: 480, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", category: "Outerwear" },
      { id: 606, name: "Satin Slip Skirt", price: 290, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj3a?w=400&q=80", category: "Bottoms" },
    ],
  },
  {
    id: 7,
    name: "Sasson Kedem",
    category: "Bridal",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    bio: "Sasson Kedem crafts romantic bridal gowns that blend classic elegance with modern sensibility. Each dress is meticulously constructed with hand-sewn details, French lace, and flowing silhouettes that celebrate the beauty of every bride.",
    established: 2010,
    location: "Tel Aviv, Israel",
    website: "https://sassonkedem.com",
    instagram: "sassonkedem",
    products: [
      { id: 701, name: "Lace A-Line Gown", price: 5500, image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80", category: "Bridal" },
      { id: 702, name: "Beaded Mermaid Dress", price: 7200, image: "https://images.unsplash.com/photo-1519657814959-e2c5c0a5e5b5?w=400&q=80", category: "Bridal" },
      { id: 703, name: "Cathedral Veil", price: 890, image: "https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=400&q=80", category: "Accessories" },
      { id: 704, name: "Bohemian Lace Gown", price: 4800, image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80", category: "Bridal" },
      { id: 705, name: "Minimalist Crepe Dress", price: 3900, image: "https://images.unsplash.com/photo-1519657814959-e2c5c0a5e5b5?w=400&q=80", category: "Bridal" },
      { id: 706, name: "Bridal Cape", price: 1200, image: "https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=400&q=80", category: "Accessories" },
    ],
  },
  {
    id: 8,
    name: "Comme Il Faut",
    category: "Dance",
    image: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&q=80",
    bio: "Comme Il Faut revolutionized tango footwear with handcrafted shoes that combine Argentine tradition with Israeli innovation. Each pair is made to order, featuring premium materials and designs that have become iconic in dance halls worldwide.",
    established: 1995,
    location: "Tel Aviv, Israel",
    website: "https://commeilfaut.com",
    instagram: "commeilfaut_shoes",
    products: [
      { id: 801, name: "Classic Tango Heels", price: 420, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", category: "Shoes" },
      { id: 802, name: "Open-Toe Latin Sandals", price: 380, image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400&q=80", category: "Shoes" },
      { id: 803, name: "Practice Dance Shoes", price: 280, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", category: "Shoes" },
      { id: 804, name: "Glitter Evening Heels", price: 450, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", category: "Shoes" },
      { id: 805, name: "Suede Ballroom Shoes", price: 360, image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400&q=80", category: "Shoes" },
      { id: 806, name: "Velvet Dance Pumps", price: 320, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", category: "Shoes" },
    ],
  },
  {
    id: 9,
    name: "Ronen Chen",
    category: "Womenswear",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
    bio: "Ronen Chen designs feminine, figure-flattering collections that celebrate the curves of real women. With a focus on comfort without compromising style, the brand has become a staple for professional women seeking elegant everyday wear.",
    established: 1990,
    location: "Tel Aviv, Israel",
    website: "https://ronenchen.com",
    instagram: "ronenchenofficial",
    products: [
      { id: 901, name: "Wrap Jersey Dress", price: 320, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Dresses" },
      { id: 902, name: "Tailored Blazer", price: 480, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", category: "Outerwear" },
      { id: 903, name: "Pleated Midi Skirt", price: 280, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj3a?w=400&q=80", category: "Bottoms" },
      { id: 904, name: "Ruched Bodycon Dress", price: 350, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Dresses" },
      { id: 905, name: "Ponte Pants", price: 220, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 906, name: "Draped Blouse", price: 260, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
    ],
  },
  {
    id: 10,
    name: "Gideon Oberson",
    category: "Swimwear",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    bio: "Gideon Oberson is Israel's premier swimwear designer, creating luxurious beachwear for over four decades. His collections feature innovative cuts, vibrant prints, and superior craftsmanship that have earned international acclaim.",
    established: 1975,
    location: "Tel Aviv, Israel",
    website: "https://gideonoberson.com",
    instagram: "gideonoberson",
    products: [
      { id: 1001, name: "One-Shoulder Swimsuit", price: 280, image: "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=80", category: "Swimwear" },
      { id: 1002, name: "High-Waisted Bikini", price: 220, image: "https://images.unsplash.com/photo-1520298878034-02946c349ca6?w=400&q=80", category: "Swimwear" },
      { id: 1003, name: "Silk Beach Kaftan", price: 380, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80", category: "Cover-ups" },
      { id: 1004, name: "Cut-Out One Piece", price: 320, image: "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=80", category: "Swimwear" },
      { id: 1005, name: "Printed Sarong", price: 120, image: "https://images.unsplash.com/photo-1520298878034-02946c349ca6?w=400&q=80", category: "Cover-ups" },
      { id: 1006, name: "Triangle Bikini Set", price: 180, image: "https://images.unsplash.com/photo-1520298878034-02946c349ca6?w=400&q=80", category: "Swimwear" },
    ],
  },
  {
    id: 11,
    name: "Hed Mayner",
    category: "Menswear",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    bio: "Hed Mayner redefines contemporary menswear with oversized silhouettes and fluid tailoring. A rising star in Paris Fashion Week, his designs challenge conventional masculinity while maintaining an effortless elegance.",
    established: 2017,
    location: "Tel Aviv, Israel",
    website: "https://hedmayner.com",
    instagram: "hedmayner",
    products: [
      { id: 1101, name: "Oversized Wool Suit", price: 2800, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80", category: "Suits" },
      { id: 1102, name: "Draped Cotton Shirt", price: 480, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", category: "Shirts" },
      { id: 1103, name: "Wide-Leg Pleated Trousers", price: 680, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 1104, name: "Deconstructed Coat", price: 1950, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80", category: "Outerwear" },
      { id: 1105, name: "Relaxed Linen Blazer", price: 890, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", category: "Outerwear" },
      { id: 1106, name: "Cropped Trousers", price: 520, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
    ],
  },
  {
    id: 12,
    name: "Inbal Dror",
    category: "Bridal Couture",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    bio: "Inbal Dror creates breathtaking bridal couture that has become synonymous with red-carpet glamour. Her intricate beadwork, daring silhouettes, and impeccable fit have made her a favorite among celebrities and fashion-forward brides worldwide.",
    established: 2011,
    location: "Tel Aviv, Israel",
    website: "https://inbaldror.com",
    instagram: "inbaldror",
    products: [
      { id: 1201, name: "Crystal-Encrusted Gown", price: 12000, image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80", category: "Bridal" },
      { id: 1202, name: "Plunging Lace Dress", price: 9500, image: "https://images.unsplash.com/photo-1519657814959-e2c5c0a5e5b5?w=400&q=80", category: "Bridal" },
      { id: 1203, name: "Detachable Train", price: 2800, image: "https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=400&q=80", category: "Accessories" },
      { id: 1204, name: "Illusion Back Gown", price: 11000, image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&q=80", category: "Bridal" },
      { id: 1205, name: "Embellished Jumpsuit", price: 7500, image: "https://images.unsplash.com/photo-1519657814959-e2c5c0a5e5b5?w=400&q=80", category: "Bridal" },
      { id: 1206, name: "Pearl Headpiece", price: 1800, image: "https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=400&q=80", category: "Accessories" },
    ],
  },
  {
    id: 13,
    name: "Maya Negri",
    category: "Sustainable",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    bio: "Maya Negri leads Israel's sustainable fashion movement with eco-conscious collections made from organic and recycled materials. Her designs prove that ethical fashion can be both stylish and accessible.",
    established: 2018,
    location: "Tel Aviv, Israel",
    instagram: "mayanegri_",
    products: [
      { id: 1301, name: "Organic Cotton Jumpsuit", price: 320, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80", category: "One-pieces" },
      { id: 1302, name: "Recycled Denim Jacket", price: 280, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80", category: "Outerwear" },
      { id: 1303, name: "Hemp Blend Trousers", price: 220, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 1304, name: "Tencel Wrap Dress", price: 290, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", category: "Dresses" },
      { id: 1305, name: "Upcycled Patchwork Top", price: 180, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 1306, name: "Bamboo Knit Cardigan", price: 240, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", category: "Knitwear" },
    ],
  },
  {
    id: 14,
    name: "Liat Brandel",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    bio: "Liat Brandel creates statement accessories that transform any outfit. Her handcrafted bags and leather goods combine artisanal techniques with bold, contemporary design, earning a cult following among fashion insiders.",
    established: 2014,
    location: "Tel Aviv, Israel",
    instagram: "liatbrandel",
    products: [
      { id: 1401, name: "Sculptural Leather Tote", price: 680, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", category: "Bags" },
      { id: 1402, name: "Woven Clutch", price: 320, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80", category: "Bags" },
      { id: 1403, name: "Statement Belt", price: 180, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Belts" },
      { id: 1404, name: "Mini Crossbody Bag", price: 420, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", category: "Bags" },
      { id: 1405, name: "Leather Bucket Bag", price: 580, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80", category: "Bags" },
      { id: 1406, name: "Chain Link Necklace", price: 220, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", category: "Jewelry" },
    ],
  },
  {
    id: 15,
    name: "Nili Lotan",
    category: "Luxury Basics",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    bio: "Nili Lotan, though now based in New York, brings Israeli sensibility to American luxury fashion. Her eponymous label focuses on perfectly crafted basics—cashmere sweaters, tailored pants, and effortless dresses that form the foundation of a sophisticated wardrobe.",
    established: 2003,
    location: "New York / Tel Aviv",
    website: "https://nililotan.com",
    instagram: "nililotan",
    products: [
      { id: 1501, name: "Cashmere V-Neck Sweater", price: 495, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", category: "Knitwear" },
      { id: 1502, name: "Silk Camisole", price: 275, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", category: "Tops" },
      { id: 1503, name: "Tailored Wool Pants", price: 425, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", category: "Bottoms" },
      { id: 1504, name: "Oversized Cotton Shirt", price: 295, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", category: "Tops" },
      { id: 1505, name: "Cashmere Crewneck", price: 550, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", category: "Knitwear" },
      { id: 1506, name: "Leather Ankle Boots", price: 695, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", category: "Shoes" },
    ],
  },
  {
    id: 16,
    name: "Dodo Bar Or",
    category: "Resort",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    bio: "Dodo Bar Or captures the spirit of endless summer with bohemian-luxe resort wear. Known for flowing silhouettes, romantic prints, and artisanal details, the brand has become synonymous with jet-set style and Mediterranean glamour.",
    established: 2014,
    location: "Tel Aviv, Israel",
    website: "https://dodobaror.com",
    instagram: "dodobaror",
    products: [
      { id: 1601, name: "Printed Maxi Dress", price: 580, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", category: "Dresses" },
      { id: 1602, name: "Embroidered Tunic", price: 420, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80", category: "Tops" },
      { id: 1603, name: "Crochet Beach Set", price: 380, image: "https://images.unsplash.com/photo-1520298878034-02946c349ca6?w=400&q=80", category: "Swimwear" },
      { id: 1604, name: "Tassel Trim Kimono", price: 450, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80", category: "Cover-ups" },
      { id: 1605, name: "Floral Wrap Skirt", price: 320, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj3a?w=400&q=80", category: "Bottoms" },
      { id: 1606, name: "Beaded Sandals", price: 280, image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400&q=80", category: "Shoes" },
    ],
  },
];

export const getDesignerColors = (index: number): [string, string] => {
  return colorSchemes[index % colorSchemes.length];
};
