// Product data for Dark Lux Storefront
// Three tiers: Adventurer ($500-$2,000), Heirloom ($3,000-$10,000), Legendary ($15,000+)

export const collections = {
  adventurer: {
    id: 'adventurer',
    name: 'Adventurer',
    tagline: 'Shadowcraft for the Bold',
    description: 'Heavy sterling silver and 14k gold pieces featuring top-tier black spinel. Complex Rajasthani craftsmanship refined for the modern dark romantic. Your first legendary find.',
    priceRange: '$85 - $650',
    image: '/collections/adventurer.jpg',
  },
  bridal: {
    id: 'bridal',
    name: 'Heirloom',
    tagline: 'Rare Drops for Alternative Souls',
    description: 'Solid 18k gold or platinum. Intricate enamel work hidden inside bands. Large, perfect-cut spinel and exotic gems for those who refuse traditional diamonds.',
    priceRange: '$265 - $4,200',
    image: '/collections/bridal.jpg',
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    tagline: 'Mythic Forge Creations',
    description: 'Bespoke artifacts crafted through private consultation. Heritage Damascus blades, gemstone dice sets, and silk pieces worthy of a dynasty. Not available via cart—by appointment only.',
    priceRange: '$1,800+',
    image: '/collections/legendary.jpg',
  },
};

export const categories = [
  { id: 'all', name: 'All Pieces' },
  { id: 'rings', name: 'Rings' },
  { id: 'pendants', name: 'Pendants & Necklaces' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'bracelets', name: 'Bracelets & Cuffs' },
  { id: 'dice', name: 'Dice & Gaming' },
  { id: 'blades', name: 'Blades' },
  { id: 'textiles', name: 'Silks & Textiles' },
];

export const products = [
  // === ADVENTURER COLLECTION ($500 - $2,000) ===
  {
    id: 'adventurer-001',
    name: 'Obsidian Signet',
    collection: 'adventurer',
    category: 'rings',
    price: 385,
    images: ['/products/obsidian-signet-1.jpg', '/products/obsidian-signet-2.jpg'],
    shortDescription: 'Heavy sterling silver signet ring with 2ct black spinel',
    description: `A commanding signet ring forged in heavy sterling silver (925), featuring a masterfully cut 2-carat black spinel set in a bezel inspired by Rajasthani fortress architecture. The band carries subtle geometric etchings drawn from centuries-old metalwork traditions.

Each piece is hand-finished by artisans whose families have worked precious metals for seven generations. The black spinel—sourced directly from our partner mines—exhibits the deep, mirror-like finish that collectors prize above common onyx.`,
    materials: ['Sterling Silver (925)', 'Natural Black Spinel (2ct)'],
    dimensions: 'Band width: 12mm at crown, 6mm at base',
    weight: '18g',
    craftsmanship: 'Hand-forged and finished over 40+ hours',
    provenance: 'Crafted in Jaipur by master artisan lineage (7th generation)',
    inStock: true,
    featured: true,
  },
  {
    id: 'adventurer-002',
    name: 'Midnight Drop Pendant',
    collection: 'adventurer',
    category: 'pendants',
    price: 520,
    images: ['/products/midnight-drop-1.jpg', '/products/midnight-drop-2.jpg'],
    shortDescription: '14k white gold pendant with cushion-cut black spinel',
    description: `Suspended in 14k white gold, this cushion-cut 3-carat black spinel seems to absorb light itself. The setting employs a centuries-old Kundan technique—each gold wall hand-pressed to cradle the stone without modern prongs.

The reverse reveals a hidden detail: a miniature lotus pattern in recessed enamel, visible only to the wearer. A secret between you and the craftsman who placed it there.`,
    materials: ['14k White Gold', 'Natural Black Spinel (3ct)', 'Traditional Enamel'],
    dimensions: 'Pendant: 18mm x 22mm, Chain: 20" adjustable',
    weight: '8g (pendant), 4g (chain)',
    craftsmanship: 'Kundan setting technique, hand-enameled reverse',
    provenance: 'Crafted in Jaipur using techniques preserved since the Mughal era',
    inStock: true,
    featured: true,
  },
  {
    id: 'adventurer-003',
    name: 'Carved Bone Band',
    collection: 'adventurer',
    category: 'rings',
    price: 245,
    images: ['/products/carved-bone-1.jpg'],
    shortDescription: 'Oxidized sterling silver band with skeletal lattice motif',
    description: `A substantial band in oxidized sterling silver, featuring a continuous pattern rendered in the Rajasthani "jali" (lattice) technique. The deliberate oxidation creates depth in the recesses while polished highlights catch light on the raised elements.

This ring speaks to those who find beauty in contrast—light against dark, polish against patina. The memento mori tradition rendered in precious metal by hands that have shaped silver for generations.`,
    materials: ['Sterling Silver (925)', 'Oxidized Finish'],
    dimensions: 'Band width: 8mm uniform',
    weight: '12g',
    craftsmanship: 'Jali lattice work, controlled oxidation',
    provenance: 'Hand-carved in Jaipur silversmith workshop',
    inStock: true,
    featured: false,
  },
  {
    id: 'adventurer-004',
    name: 'Sacred Geometry Cuff',
    collection: 'adventurer',
    category: 'bracelets',
    price: 650,
    images: ['/products/geometry-cuff-1.jpg', '/products/geometry-cuff-2.jpg'],
    shortDescription: 'Sterling silver cuff with geometric patterns and spinel accents',
    description: `A substantial cuff bracelet in heavy sterling silver, its surface an intricate map of interlocking geometric forms—hexagons, circles, and spirals that seem to shift as light moves across the metal.

Five black spinels are set at key intersection points. The interior is polished smooth for comfortable daily wear, while the exterior tells a story written in silver and stone by artisans who learned these patterns from their fathers, who learned from theirs.`,
    materials: ['Sterling Silver (925)', 'Natural Black Spinel (5 x 0.5ct)'],
    dimensions: 'Width: 35mm, Inner circumference: adjustable 6.5"-7.5"',
    weight: '65g',
    craftsmanship: 'Hand-engraved geometry, bezel-set stones',
    provenance: 'Crafted by Jaipur master engraver',
    inStock: true,
    featured: true,
  },
  {
    id: 'adventurer-005',
    name: 'Teardrop Spinel Earrings',
    collection: 'adventurer',
    category: 'earrings',
    price: 295,
    images: ['/products/teardrop-earrings-1.jpg'],
    shortDescription: 'Sterling silver drop earrings with black spinel teardrops',
    description: `Elegant drop earrings in sterling silver, each featuring a pear-cut black spinel that catches and holds light. The setting employs a minimalist tension design—the stones appear to float, held by invisible forces.

For those who prefer their luxury understated. These speak quietly but carry weight.`,
    materials: ['Sterling Silver (925)', 'Natural Black Spinel (2 x 1.5ct pear cut)'],
    dimensions: 'Total drop: 32mm',
    weight: '6g per pair',
    craftsmanship: 'Tension setting, hand-polished',
    provenance: 'Crafted in Jaipur',
    inStock: true,
    featured: false,
  },
  {
    id: 'adventurer-006',
    name: 'Polyhedral Set - Blackened Bronze',
    collection: 'adventurer',
    category: 'dice',
    price: 185,
    images: ['/products/bronze-dice-1.jpg', '/products/bronze-dice-2.jpg'],
    shortDescription: 'Complete 7-piece dice set in blackened bronze',
    description: `A complete set of polyhedral dice (D4, D6, D8, D10, D10%, D12, D20) cast in solid bronze with a controlled blackened patina. Each die is hand-finished to ensure proper balance while maintaining the warmth and weight that only real metal provides.

The numbers are hand-engraved and filled with silver for contrast. These are heirloom pieces that will outlast their owner—dice worthy of being passed down.`,
    materials: ['Solid Bronze', 'Silver Inlay', 'Blackened Patina'],
    dimensions: 'Standard polyhedral sizes, weighted for fair rolls',
    weight: 'Set total: 95g',
    craftsmanship: 'Hand-cast, hand-engraved, balanced',
    provenance: 'Cast and finished in Jaipur metalwork studio',
    inStock: true,
    featured: true,
  },
  {
    id: 'adventurer-007',
    name: 'Sterling D20 Pendant',
    collection: 'adventurer',
    category: 'pendants',
    price: 145,
    images: ['/products/d20-pendant-1.jpg'],
    shortDescription: 'Wearable sterling silver D20 on chain',
    description: `A perfectly balanced D20 in sterling silver, small enough to wear but substantial enough to roll. Suspended on a 24" sterling chain, it rests at the chest—a quiet declaration of who you are.

Each face is hand-engraved with numerals in a style drawn from medieval manuscripts. The "20" face features a small black spinel inset.`,
    materials: ['Sterling Silver (925)', 'Natural Black Spinel accent'],
    dimensions: 'D20: 15mm diameter, Chain: 24"',
    weight: '18g total',
    craftsmanship: 'Hand-engraved faces, precision balanced',
    provenance: 'Crafted in Jaipur',
    inStock: true,
    featured: false,
  },
  {
    id: 'adventurer-008',
    name: 'Silk Pocket Square - Midnight',
    collection: 'adventurer',
    category: 'textiles',
    price: 85,
    images: ['/products/silk-square-1.jpg'],
    shortDescription: 'Hand-woven Rajasthani silk with subtle geometric border',
    description: `Pure mulberry silk, hand-woven in the traditional Rajasthani style. Deep black with a subtle geometric border pattern in charcoal—visible only in certain light.

This is the silk that once dressed royalty. Now it dresses you.`,
    materials: ['100% Mulberry Silk', 'Natural Dyes'],
    dimensions: '17" x 17"',
    weight: '25g',
    craftsmanship: 'Hand-woven on traditional loom',
    provenance: 'Woven in Rajasthan by heritage textile family',
    inStock: true,
    featured: false,
  },

  // === HEIRLOOM COLLECTION ($3,000 - $10,000) ===
  {
    id: 'bridal-001',
    name: 'The Dark Covenant',
    collection: 'bridal',
    category: 'rings',
    price: 2800,
    images: ['/products/dark-covenant-1.jpg', '/products/dark-covenant-2.jpg', '/products/dark-covenant-3.jpg'],
    shortDescription: '18k white gold ring with 3ct black spinel and hidden enamel',
    description: `The anti-diamond ring for those who chose each other outside the light. A flawless 3-carat black spinel—cut to maximize its mirror-like depth—set in 18k white gold with a halo of micro-pavé black diamonds.

The true detail lies within: lift the ring and discover hidden enamel work inside the band. A private symbol known only to you and yours. Each ring is unique—share your story, and our artisans will encode it in enamel.`,
    materials: ['18k White Gold', 'Natural Black Spinel (3ct center)', 'Black Diamond Pavé (0.5ct total)', 'Custom Enamel Interior'],
    dimensions: 'Center stone: 9mm, Band: 2.5mm',
    weight: '6g',
    craftsmanship: 'Kundan setting, micro-pavé, custom meenakari enamel',
    provenance: 'Crafted by master jeweler in Jaipur, 80+ hours per piece',
    inStock: true,
    featured: true,
    customizable: true,
  },
  {
    id: 'bridal-002',
    name: 'Storm Within',
    collection: 'bridal',
    category: 'rings',
    price: 4200,
    images: ['/products/storm-within-1.jpg', '/products/storm-within-2.jpg'],
    shortDescription: 'Platinum ring with rare grey spinel and black diamond accents',
    description: `For those who find traditional rings insufferably bright. This platinum setting cradles a rare 4-carat grey spinel—the color of storm clouds before thunder—flanked by channel-set black diamonds that fade into the metal.

The band features a knife-edge profile for modern minimalism, while the setting employs centuries-old techniques. It looks like a simple, expensive band—until light catches the stone and reveals depths within.`,
    materials: ['Platinum (950)', 'Natural Grey Spinel (4ct)', 'Black Diamonds (1ct total)'],
    dimensions: 'Center stone: 10mm, Band: 2mm knife-edge',
    weight: '8g',
    craftsmanship: 'Channel setting, knife-edge band, hand-polished',
    provenance: 'Platinum work finished in Jaipur by certified master',
    inStock: true,
    featured: true,
    customizable: true,
  },
  {
    id: 'bridal-003',
    name: 'Serpent Coil',
    collection: 'bridal',
    category: 'rings',
    price: 3400,
    images: ['/products/serpent-coil-1.jpg'],
    shortDescription: '18k yellow gold snake ring with ruby eyes and spinel',
    description: `A serpent coiled around your finger, its scales individually hand-engraved in 18k yellow gold. The head features cabochon ruby eyes and holds a round black spinel in its jaws—the eternal ouroboros rendered in gold.

This piece draws from both Rajasthani naga imagery and Victorian mourning traditions. For those who understand that beauty often carries an edge.`,
    materials: ['18k Yellow Gold', 'Natural Black Spinel (1.5ct)', 'Cabochon Rubies (eyes)'],
    dimensions: 'Serpent head: 12mm, Band: 4mm tapering',
    weight: '9g',
    craftsmanship: 'Hand-engraved scales, cabochon setting',
    provenance: 'Naga tradition interpreted by Jaipur master goldsmith',
    inStock: true,
    featured: false,
    customizable: true,
  },
  {
    id: 'bridal-004',
    name: 'Cabochon Statement Necklace',
    collection: 'bridal',
    category: 'pendants',
    price: 1850,
    images: ['/products/cabochon-necklace-1.jpg'],
    shortDescription: '18k rose gold necklace with large cabochon black spinel',
    description: `A substantial cabochon black spinel—cut to maximize mysterious depth rather than sparkle—set in warm 18k rose gold. The setting features delicate hand-carved motifs that cradle the stone.

The contrast of warm rose gold against the cool void of black spinel creates tension that draws the eye. Worn close to the heart, it becomes something more than jewelry.`,
    materials: ['18k Rose Gold', 'Natural Black Spinel (5ct cabochon)'],
    dimensions: 'Pendant: 22mm diameter, Chain: 18" with 2" extender',
    weight: '12g total',
    craftsmanship: 'Cabochon setting, hand-carved details',
    provenance: 'Crafted in Jaipur',
    inStock: true,
    featured: true,
    customizable: false,
  },
  {
    id: 'bridal-005',
    name: 'Damascus Letter Opener',
    collection: 'bridal',
    category: 'blades',
    price: 485,
    images: ['/products/letter-opener-1.jpg', '/products/letter-opener-2.jpg'],
    shortDescription: 'Hand-forged Damascus steel with sterling silver handle',
    description: `A functional letter opener forged from Damascus steel using traditional pattern-welding techniques. The blade displays the distinctive flowing patterns that made Damascus legendary—no two pieces identical.

The handle is sterling silver with controlled oxidation, fitted with a black spinel pommel cap. Practical enough for daily use, beautiful enough to display.`,
    materials: ['Damascus Steel (pattern-welded)', 'Sterling Silver Handle', 'Black Spinel Pommel'],
    dimensions: 'Blade: 4", Overall: 8"',
    weight: '85g',
    craftsmanship: 'Traditional Damascus forging, silver handle work',
    provenance: 'Blade forged by master smith, handle finished in Jaipur',
    inStock: true,
    featured: false,
  },
  {
    id: 'bridal-006',
    name: 'Silk Scarf - Void',
    collection: 'bridal',
    category: 'textiles',
    price: 265,
    images: ['/products/silk-scarf-1.jpg'],
    shortDescription: 'Hand-woven pure silk scarf with hidden pattern',
    description: `A generous silk scarf in deepest black, hand-woven with a tone-on-tone pattern visible only when light catches it at certain angles. The pattern draws from traditional Rajasthani textile motifs—geometry that has meaning to those who know.

Finished with hand-rolled edges. The silk has weight and drape that synthetic fabrics cannot replicate.`,
    materials: ['100% Mulberry Silk', 'Natural Dyes'],
    dimensions: '70" x 20"',
    weight: '65g',
    craftsmanship: 'Hand-woven, hand-rolled edges',
    provenance: 'Woven in Rajasthan by heritage textile family',
    inStock: true,
    featured: false,
  },

  // === LEGENDARY SHOWCASE (Display Only - $15,000+) ===
  {
    id: 'legendary-001',
    name: 'The Complete Gemstone Set',
    collection: 'legendary',
    category: 'dice',
    price: 4500,
    images: ['/products/gemstone-dice-1.jpg', '/products/gemstone-dice-2.jpg'],
    shortDescription: 'Full polyhedral set in solid 18k gold with gemstone inlays',
    description: `A complete set of polyhedral dice (D4, D6, D8, D10, D10%, D12, D20) cast in solid 18k gold. Each die features hand-inlaid gemstone number faces—black spinel for standard numbers, ruby for the highest value on each die.

Presented in a handcrafted rosewood chest lined with silk. These are functional dice, properly balanced despite their materials. For the collector who wants their tools to match their dedication.

**This piece is displayed as an example of our Legendary capabilities. All Legendary pieces begin with a private consultation.**`,
    materials: ['18k Gold', 'Black Spinel Inlays', 'Ruby Inlays (high numbers)', 'Rosewood Presentation Box'],
    dimensions: 'Standard polyhedral sizes',
    weight: 'Set total: approximately 180g',
    craftsmanship: 'Precision casting, gem inlay, balance calibration',
    provenance: 'Created through Legendary process',
    inStock: false,
    featured: true,
    isShowpiece: true,
  },
  {
    id: 'legendary-002',
    name: 'Damascus Short Blade',
    collection: 'legendary',
    category: 'blades',
    price: 1800,
    images: ['/products/damascus-blade-1.jpg'],
    shortDescription: 'Functional Damascus dagger with jeweled hilt',
    description: `A functional blade that bridges the gap between weapon and art. Hand-forged Damascus steel using traditional Wootz methods—the same technique that created legendary blades centuries ago. The pattern in the steel is unique to this piece alone.

The hilt is solid silver wrapped in ray skin, with a pommel set with a 3-carat black spinel. This is not decorative. This is a functional blade created by master smiths and jewelers working together.

**This piece is displayed as an example of our Legendary capabilities. All Legendary pieces begin with a private consultation.**`,
    materials: ['Damascus Steel (Wootz method)', 'Sterling Silver Hilt', 'Ray Skin Wrap', 'Black Spinel Pommel (3ct)'],
    dimensions: 'Blade: 8", Overall: 13"',
    weight: '280g',
    craftsmanship: 'Traditional Wootz forging, jeweler hilt work',
    provenance: 'Collaboration between blade smith and jeweler',
    inStock: false,
    featured: true,
    isShowpiece: true,
  },
  {
    id: 'legendary-003',
    name: 'Ceremonial Silk Robe',
    collection: 'legendary',
    category: 'textiles',
    price: 2400,
    images: ['/products/silk-robe-1.jpg', '/products/silk-robe-2.jpg'],
    shortDescription: 'Hand-woven black silk robe with gold thread detailing',
    description: `A full-length robe in hand-woven black silk, detailed with real gold thread in patterns drawn from historical Rajasthani royal garments. The silk alone takes weeks to weave; the gold thread embroidery adds months more.

This is the kind of garment that was once reserved for ceremony and court. Now it can be yours—worn or displayed, it commands any room it enters.

**This piece is displayed as an example of our Legendary capabilities. All Legendary pieces begin with a private consultation.**`,
    materials: ['100% Mulberry Silk', 'Real Gold Thread', 'Silk Lining'],
    dimensions: 'Custom fitted to measurements',
    weight: 'Approximately 800g',
    craftsmanship: 'Hand-woven silk, hand-embroidered gold thread',
    provenance: 'Created by heritage textile artisans in Rajasthan',
    inStock: false,
    featured: false,
    isShowpiece: true,
  },
  {
    id: 'legendary-004',
    name: 'Damascus Longsword',
    collection: 'legendary',
    category: 'blades',
    price: 3500,
    images: ['/products/longsword-1.jpg', '/products/longsword-2.jpg'],
    shortDescription: 'Full-length Damascus blade with gold and gemstone fittings',
    description: `A full-length sword forged in Damascus steel, the blade displaying the flowing water patterns that made these weapons legendary. The crossguard and pommel are 18k gold, set with black spinels and deep red garnets.

The grip is wrapped in ray skin and wire for authentic feel and function. This blade is balanced for actual use—though most will display it. Either way, it represents the pinnacle of what metal and gemstone can become together.

**This piece is displayed as an example of our Legendary capabilities. All Legendary pieces begin with a private consultation.**`,
    materials: ['Damascus Steel', '18k Gold Fittings', 'Black Spinels', 'Garnets', 'Ray Skin Grip'],
    dimensions: 'Blade: 32", Overall: 42"',
    weight: 'Approximately 1.2kg',
    craftsmanship: 'Master smith forging, goldsmith fittings, 300+ hours',
    provenance: 'Created through collaboration of master craftsmen',
    inStock: false,
    featured: true,
    isShowpiece: true,
  },
];

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductsByCollection = (collectionId) => products.filter(p => p.collection === collectionId);
export const getProductsByCategory = (categoryId) => categoryId === 'all' ? products : products.filter(p => p.category === categoryId);
export const getProductById = (id) => products.find(p => p.id === id);
export const getRelatedProducts = (product, limit = 4) => {
  return products
    .filter(p => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
    .slice(0, limit);
};
