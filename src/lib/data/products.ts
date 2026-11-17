export interface SizeStock {
	size: string;
	stock: number;
}

export interface ColourOption {
	name: string;
	hex: string;
	/**
	 * Own photo for this colourway (F-16). Only set when the file actually
	 * exists on disk — colourways without one share the default gallery.
	 * Stock/sizes are shared across colourways either way.
	 */
	image?: string;
}

export interface SampleReview {
	author: string;
	rating: number;
	date: string;
	title: string;
	body: string;
}

export interface SampleQA {
	q: string;
	a: string;
}

export interface Product {
	slug: string;
	name: string;
	brand: string;
	price: number;
	oldPrice?: number;
	rating: number;
	reviews: number;
	category: string;
	badge?: 'New' | 'Bestseller' | 'Limited' | 'Deal';
	colors: string[];
	/** Named colour options (parallel to `colors`, kept for backwards compat). */
	colours: ColourOption[];
	sizes: string[];
	/** Per-size stock. Demo numbers; sum equals `stock`. */
	sizeStock: SizeStock[];
	image: string;
	/** All gallery angles: [main, three-quarter back, top-down, sole, detail, on foot]. */
	images: string[];
	/** Optional product video (muted clip). Only set when the file exists. */
	video?: string;
	blurb: string;
	description: string;
	stock: number;
}

export interface Category {
	slug: string;
	name: string;
	tagline: string;
	cta: string;
	image: string;
	bg: string;
	count: number;
}

export const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

export interface SizeRow {
	uk: string;
	eu: string;
	us: string;
	cm: string;
}

/**
 * Single source of truth for UK/EU/US/foot-length conversion (F-06).
 * The PDP modal, /size-guide and /fit-finder all render from this table —
 * the modal used to disagree with the page (EU 40/41/42.5/44/45 vs
 * 40.5/42/43/44.5/45.5). Conversions are approximate, men's sizing.
 */
export const SIZE_TABLE: SizeRow[] = [
	{ uk: 'UK 6', eu: 'EU 39', us: 'US 7', cm: '25.0 cm' },
	{ uk: 'UK 7', eu: 'EU 40.5', us: 'US 8', cm: '25.7 cm' },
	{ uk: 'UK 8', eu: 'EU 42', us: 'US 9', cm: '26.4 cm' },
	{ uk: 'UK 9', eu: 'EU 43', us: 'US 10', cm: '27.1 cm' },
	{ uk: 'UK 10', eu: 'EU 44.5', us: 'US 11', cm: '27.8 cm' },
	{ uk: 'UK 11', eu: 'EU 45.5', us: 'US 12', cm: '28.5 cm' }
];

function ss(stocks: number[]): SizeStock[] {
	return SIZES.map((size, i) => ({ size, stock: stocks[i] }));
}

export const products: Product[] = [
	{
		slug: 'nike-air-max-dn',
		name: 'Nike Air Max DN',
		brand: 'Nike',
		price: 189,
		rating: 4.9,
		reviews: 2314,
		category: 'running',
		badge: 'Bestseller',
		colors: ['#16130f', '#f5f2ef', '#ff6b1a'],
		colours: [
			{ name: 'Black', hex: '#16130f' },
			{ name: 'White', hex: '#f5f2ef', image: '/images/prod-airmax-alt-white.png' },
			{ name: 'Ember Orange', hex: '#ff6b1a' }
		],
		sizes: SIZES,
		sizeStock: ss([3, 2, 4, 0, 3, 2]),
		image: '/images/prod-airmax.png',
		images: ['/images/prod-airmax.png', '/images/prod-airmax-angle2.png', '/images/prod-airmax-angle3.png', '/images/prod-airmax-angle4.png', '/images/prod-airmax-angle5.png', '/images/prod-airmax-onfoot.png'],
		video: '/videos/airmax-360.mp4',
		blurb: 'Dynamic Air cushioning with a futuristic all-day ride.',
		description:
			'The Air Max DN pairs a Dynamic Air unit with a breathable mesh upper for a ride that feels alive with every step. Built for the street, tuned for all-day comfort.',
		stock: 14
	},
	{
		slug: 'adidas-ultraboost-5',
		name: 'Adidas Ultraboost 5',
		brand: 'Adidas',
		price: 199,
		rating: 4.8,
		reviews: 1876,
		category: 'running',
		badge: 'New',
		colors: ['#16130f', '#c8102e', '#f5f2ef'],
		colours: [
			{ name: 'Black', hex: '#16130f' },
			{ name: 'Crimson', hex: '#c8102e', image: '/images/prod-ultraboost-alt-crimson.png' },
			{ name: 'White', hex: '#f5f2ef' }
		],
		sizes: SIZES,
		sizeStock: ss([4, 5, 3, 4, 3, 2]),
		image: '/images/prod-ultraboost.png',
		images: ['/images/prod-ultraboost.png', '/images/prod-ultraboost-angle2.png', '/images/prod-ultraboost-angle3.png', '/images/prod-ultraboost-angle4.png', '/images/prod-ultraboost-angle5.png', '/images/prod-ultraboost-onfoot.png'],
		blurb: 'Energy-returning Boost foam in a sock-like knit fit.',
		description:
			'Ultraboost 5 wraps your foot in a primeknit upper and returns energy with every stride thanks to its full-length Boost midsole. Light, fast, unmistakably Adidas.',
		stock: 21
	},
	{
		slug: 'new-balance-9060r',
		name: 'New Balance 9060R',
		brand: 'New Balance',
		price: 179,
		rating: 4.9,
		reviews: 1204,
		category: 'lifestyle',
		colors: ['#c8102e', '#16130f', '#f5f2ef'],
		colours: [
			{ name: 'Crimson', hex: '#c8102e' },
			{ name: 'Black', hex: '#16130f', image: '/images/prod-newbalance-alt-black.png' },
			{ name: 'White', hex: '#f5f2ef' }
		],
		sizes: SIZES,
		sizeStock: ss([2, 1, 3, 0, 2, 1]),
		image: '/images/prod-newbalance.png',
		images: ['/images/prod-newbalance.png', '/images/prod-newbalance-angle2.png', '/images/prod-newbalance-angle3.png', '/images/prod-newbalance-angle4.png', '/images/prod-newbalance-angle5.png', '/images/prod-newbalance-onfoot.png'],
		blurb: 'Retro 90s running DNA with a chunky modern sole.',
		description:
			'The 9060R reworks classic New Balance running heritage with exaggerated proportions, premium suede and ABZORB cushioning. A statement sneaker that still walks easy.',
		stock: 9
	},
	{
		slug: 'asics-gel-kayano-31',
		name: 'ASICS GEL-KAYANO 31',
		brand: 'ASICS',
		price: 199,
		rating: 4.7,
		reviews: 986,
		category: 'running',
		colors: ['#d9c7b2', '#e8a0a8', '#f5f2ef'],
		colours: [
			{ name: 'Sand', hex: '#d9c7b2' },
			{ name: 'Blush', hex: '#e8a0a8', image: '/images/prod-asics-alt-blush.png' },
			{ name: 'White', hex: '#f5f2ef' }
		],
		sizes: SIZES,
		sizeStock: ss([3, 4, 2, 3, 3, 2]),
		image: '/images/prod-asics.png',
		images: ['/images/prod-asics.png', '/images/prod-asics-angle2.png', '/images/prod-asics-angle3.png', '/images/prod-asics-angle4.png', '/images/prod-asics-angle5.png', '/images/prod-asics-onfoot.png'],
		blurb: 'Stability and softness in perfect balance.',
		description:
			'GEL-KAYANO 31 brings three decades of stability know-how into a lighter, softer package with PureGEL cushioning and a breathable engineered mesh upper.',
		stock: 17
	},
	{
		slug: 'puma-rs-x',
		name: 'Puma RS-X Reinvention',
		brand: 'Puma',
		price: 129,
		oldPrice: 159,
		rating: 4.6,
		reviews: 743,
		category: 'lifestyle',
		badge: 'Deal',
		colors: ['#f5f2ef', '#16130f', '#c8a06a'],
		colours: [
			{ name: 'White', hex: '#f5f2ef' },
			{ name: 'Black', hex: '#16130f', image: '/images/prod-puma-alt-black.png' },
			{ name: 'Tan', hex: '#c8a06a' }
		],
		sizes: SIZES,
		sizeStock: ss([5, 4, 6, 4, 4, 3]),
		image: '/images/prod-puma.png',
		images: ['/images/prod-puma.png', '/images/prod-puma-angle2.png', '/images/prod-puma-angle3.png', '/images/prod-puma-angle4.png', '/images/prod-puma-angle5.png', '/images/prod-puma-onfoot.png'],
		blurb: 'Bold 80s RS attitude with a clean leather finish.',
		description:
			'The RS-X Reinvention takes the extreme cushioning story of the 80s RS series and rebuilds it with premium leather, a gum sole and a silhouette that goes with everything.',
		stock: 26
	},
	{
		slug: 'air-jordan-1-mid',
		name: 'Air Jordan 1 Mid',
		brand: 'Jordan',
		price: 249,
		oldPrice: 309,
		rating: 5.0,
		reviews: 3120,
		category: 'basketball',
		badge: 'Bestseller',
		colors: ['#f5f2ef', '#c8102e', '#16130f'],
		colours: [
			{ name: 'White', hex: '#f5f2ef' },
			{ name: 'Crimson', hex: '#c8102e', image: '/images/prod-jordan-alt-crimson.png' },
			{ name: 'Black', hex: '#16130f' }
		],
		sizes: SIZES,
		sizeStock: ss([1, 2, 1, 0, 2, 1]),
		image: '/images/prod-jordan.png',
		images: ['/images/prod-jordan.png', '/images/prod-jordan-angle2.png', '/images/prod-jordan-angle3.png', '/images/prod-jordan-angle4.png', '/images/prod-jordan-angle5.png', '/images/prod-jordan-onfoot.png'],
		blurb: 'The icon. White and red leather, court-born heritage.',
		description:
			'The Air Jordan 1 Mid keeps the original 1985 DNA alive — premium leather, the Wings logo and a high-top cut that turned a basketball shoe into a cultural icon.',
		stock: 7
	},
	{
		slug: 'vans-old-skool',
		name: 'Vans Old Skool',
		brand: 'Vans',
		price: 89,
		rating: 4.8,
		reviews: 4210,
		category: 'skate',
		colors: ['#16130f', '#f5f2ef'],
		colours: [
			{ name: 'Black', hex: '#16130f' },
			{ name: 'White', hex: '#f5f2ef', image: '/images/prod-vans-alt-white.png' }
		],
		sizes: SIZES,
		sizeStock: ss([6, 5, 6, 5, 5, 5]),
		image: '/images/prod-vans.png',
		images: ['/images/prod-vans.png', '/images/prod-vans-angle2.png', '/images/prod-vans-angle3.png', '/images/prod-vans-angle4.png', '/images/prod-vans-angle5.png', '/images/prod-vans-onfoot.png'],
		blurb: 'The original checkerboard skate classic since 1977.',
		description:
			'Old Skool was the first Vans shoe to feature the Sidestripe. Durable canvas and suede, waffle grip and a fit that has barely changed in decades — because it never needed to.',
		stock: 32
	},
	{
		slug: 'converse-chuck-70',
		name: 'Converse Chuck 70',
		brand: 'Converse',
		price: 99,
		rating: 4.7,
		reviews: 2890,
		category: 'lifestyle',
		colors: ['#f5f2ef', '#16130f'],
		colours: [
			{ name: 'White', hex: '#f5f2ef' },
			{ name: 'Black', hex: '#16130f', image: '/images/prod-converse-alt-black.png' }
		],
		sizes: SIZES,
		sizeStock: ss([4, 4, 5, 4, 4, 3]),
		image: '/images/prod-converse.png',
		images: ['/images/prod-converse.png', '/images/prod-converse-angle2.png', '/images/prod-converse-angle3.png', '/images/prod-converse-angle4.png', '/images/prod-converse-angle5.png', '/images/prod-converse-onfoot.png'],
		blurb: 'The 1970s Chuck, rebuilt with premium canvas.',
		description:
			'Chuck 70 takes the 1970s original and upgrades it — heavier organic canvas, higher rubber foxing and vintage details, with the same silhouette everyone recognises.',
		stock: 24
	},
	{
		slug: 'reebok-classic-leather',
		name: 'Reebok Classic Leather',
		brand: 'Reebok',
		price: 109,
		oldPrice: 129,
		rating: 4.6,
		reviews: 1150,
		category: 'lifestyle',
		badge: 'Deal',
		colors: ['#f5f2ef', '#c8a06a'],
		colours: [
			{ name: 'White', hex: '#f5f2ef' },
			{ name: 'Tan', hex: '#c8a06a', image: '/images/prod-reebok-alt-tan.png' }
		],
		sizes: SIZES,
		sizeStock: ss([3, 4, 3, 0, 5, 4]),
		image: '/images/prod-reebok.png',
		images: ['/images/prod-reebok.png', '/images/prod-reebok-angle2.png', '/images/prod-reebok-angle3.png', '/images/prod-reebok-angle4.png', '/images/prod-reebok-angle5.png', '/images/prod-reebok-onfoot.png'],
		blurb: 'Clean 80s leather with a soft gum sole.',
		description:
			'The Classic Leather has been a wardrobe staple since 1983. Supple garment leather, a cushioned die-cut sockliner and a gum outsole — simple, and simply right.',
		stock: 19
	},
	{
		slug: 'saucony-shadow-6000',
		name: 'Saucony Shadow 6000',
		brand: 'Saucony',
		price: 139,
		rating: 4.8,
		reviews: 864,
		category: 'running',
		badge: 'New',
		colors: ['#0f766e', '#2563eb', '#f5f2ef'],
		colours: [
			{ name: 'Teal', hex: '#0f766e' },
			{ name: 'Royal Blue', hex: '#2563eb', image: '/images/prod-saucony-alt-royal-blue.png' },
			{ name: 'White', hex: '#f5f2ef' }
		],
		sizes: SIZES,
		sizeStock: ss([2, 3, 2, 1, 2, 2]),
		image: '/images/prod-saucony.png',
		images: ['/images/prod-saucony.png', '/images/prod-saucony-angle2.png', '/images/prod-saucony-angle3.png', '/images/prod-saucony-angle4.png', '/images/prod-saucony-angle5.png', '/images/prod-saucony-onfoot.png'],
		blurb: '90s runner energy with modern comfort tech.',
		description:
			'Shadow 6000 blends premium suede and mesh with a cushioned midsole for a retro runner that feels as good as it looks. A cult favourite, back in fresh colourways.',
		stock: 12
	},
	{
		slug: 'fila-disruptor-2',
		name: 'Fila Disruptor II',
		brand: 'Fila',
		price: 119,
		oldPrice: 149,
		rating: 4.5,
		reviews: 692,
		category: 'lifestyle',
		badge: 'Deal',
		colors: ['#f5f2ef', '#1e3a8a'],
		colours: [
			{ name: 'White', hex: '#f5f2ef' },
			{ name: 'Navy', hex: '#1e3a8a', image: '/images/prod-fila-alt-navy.png' }
		],
		sizes: SIZES,
		sizeStock: ss([3, 2, 3, 3, 0, 5]),
		image: '/images/prod-fila.png',
		images: ['/images/prod-fila.png', '/images/prod-fila-angle2.png', '/images/prod-fila-angle3.png', '/images/prod-fila-angle4.png', '/images/prod-fila-angle5.png', '/images/prod-fila-onfoot.png'],
		blurb: 'The chunky icon that defined a decade.',
		description:
			'Disruptor II is the chunky trainer that became a streetwear icon. Bold sculpted sole, crisp leather upper and unmistakable Fila branding.',
		stock: 16
	},
	{
		slug: 'yeezy-boost-350',
		name: 'Yeezy Boost 350',
		brand: 'Yeezy',
		price: 219,
		rating: 4.9,
		reviews: 1540,
		category: 'lifestyle',
		badge: 'Limited',
		colors: ['#d9c7b2', '#c8b89a'],
		colours: [
			{ name: 'Sand', hex: '#d9c7b2' },
			{ name: 'Bone', hex: '#c8b89a', image: '/images/prod-yeezy-alt-bone.png' }
		],
		sizes: SIZES,
		sizeStock: ss([1, 1, 0, 1, 1, 1]),
		image: '/images/prod-yeezy.png',
		images: ['/images/prod-yeezy.png', '/images/prod-yeezy-angle2.png', '/images/prod-yeezy-angle3.png', '/images/prod-yeezy-angle4.png', '/images/prod-yeezy-angle5.png', '/images/prod-yeezy-onfoot.png'],
		blurb: 'Knit slip-on comfort with Boost underfoot.',
		description:
			'The Boost 350 pairs a Primeknit upper with full-length Boost cushioning for a slip-on that disappears on your foot. Limited colourways, while stocks last.',
		stock: 5
	}
];

export const categories: Category[] = [
	{
		slug: 'premium-sneakers',
		name: 'Premium Sneakers',
		tagline: 'Shop the latest styles',
		cta: 'View Collection',
		image: '/images/cat-premium.png',
		bg: '#fbe9e2',
		count: 48
	},
	{
		slug: 'top-picks',
		name: 'Top Picks in Sneakers',
		tagline: 'Shop Now',
		cta: 'Shop Now',
		image: '/images/cat-toppicks.png',
		bg: '#e9e9ea',
		count: 36
	},
	{
		slug: 'selling-sneakers',
		name: 'Selling Sneakers',
		tagline: 'Shop Now',
		cta: 'Shop Now',
		image: '/images/cat-selling.png',
		bg: '#f4f4f4',
		count: 52
	},
	{
		slug: 'sneaker-drops',
		name: 'Sneaker Drops',
		tagline: 'Shop the latest styles',
		cta: 'Shop Now',
		image: '/images/cat-drops.png',
		bg: '#fbe3d3',
		count: 24
	}
];

export const heroProduct = {
	name: 'Velocity Runner X1',
	price: 189,
	image: '/images/hero-sneaker.png',
	slug: 'nike-air-max-dn'
};

export function getProduct(slug: string): Product | undefined {
	return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, n = 4): Product[] {
	const current = getProduct(slug);
	return products
		.filter((p) => p.slug !== slug && (!current || p.category === current.category))
		.concat(products.filter((p) => p.slug !== slug && (!current || p.category !== current.category)))
		.slice(0, n);
}

/**
 * "Complete the look": cross-category pairings (different category than the
 * current shoe, highest rated first), so this row is curated, not the same
 * generic same-category related row.
 */
export function completeTheLook(slug: string, n = 3): Product[] {
	const current = getProduct(slug);
	if (!current) return [];
	const others = products.filter((p) => p.slug !== slug);
	const cross = others.filter((p) => p.category !== current.category).sort((a, b) => b.rating - a.rating);
	const same = others.filter((p) => p.category === current.category).sort((a, b) => b.rating - a.rating);
	return [...cross, ...same].slice(0, n);
}

/** 5★→1★ distribution derived deterministically from the product's average rating. */
export function ratingDistribution(product: Product): { stars: number; pct: number; count: number }[] {
	const r = product.rating;
	let p5 = Math.round(55 + (r - 4.5) * 60);
	let p4 = Math.round(30 - (r - 4.5) * 30);
	const p2 = 2;
	const p1 = 1;
	let p3 = Math.max(1, 100 - p5 - p4 - p2 - p1);
	const total = p5 + p4 + p3 + p2 + p1;
	p5 += 100 - total; // keep the bars summing to 100%
	return [5, 4, 3, 2, 1].map((stars) => {
		const pct = stars === 5 ? p5 : stars === 4 ? p4 : stars === 3 ? p3 : stars === 2 ? p2 : p1;
		return { stars, pct, count: Math.round((pct / 100) * product.reviews) };
	});
}

/** Demo/sample content pool — clearly labelled "Sample review" wherever shown. */
export const SAMPLE_REVIEWS: SampleReview[] = [
	{
		author: 'Sam R.',
		rating: 5,
		date: 'Nov 2026',
		title: 'All-day comfort, zero break-in',
		body: 'Wore them straight out of the box for a full day on my feet. No rubbing, no hot spots — the cushioning is exactly as described.'
	},
	{
		author: 'Jordan M.',
		rating: 5,
		date: 'Nov 2026',
		title: 'True to size, great fit',
		body: 'Ordered my usual UK 9 and the fit is spot on. Heel lock is solid and the toe box has just enough room.'
	},
	{
		author: 'Alex T.',
		rating: 4,
		date: 'Oct 2026',
		title: 'Looks even better in person',
		body: 'The colour is richer than the photos and the materials feel premium. Docked one star because they run a touch narrow.'
	},
	{
		author: 'Priya K.',
		rating: 5,
		date: 'Oct 2026',
		title: 'My daily driver now',
		body: 'Comfortable enough for long walks, clean enough for the office. Already thinking about a second pair.'
	},
	{
		author: 'Dan W.',
		rating: 4,
		date: 'Oct 2026',
		title: 'Solid, with one nitpick',
		body: 'Great shoe overall. The laces are a little long and the sole picks up dust, but nothing a quick wipe does not fix.'
	},
	{
		author: 'Maya S.',
		rating: 5,
		date: 'Sep 2026',
		title: 'Worth every penny',
		body: 'Was on the fence at this price, but the build quality and comfort sold me within a week.'
	},
	{
		author: 'Chris B.',
		rating: 5,
		date: 'Sep 2026',
		title: 'Light on the foot',
		body: 'Surprisingly light for how sturdy they feel. No break-in period at all.'
	},
	{
		author: 'Taylor L.',
		rating: 4,
		date: 'Sep 2026',
		title: 'Good, runs slightly small',
		body: 'Quality is excellent, but if you are between sizes I would go half a size up.'
	},
	{
		author: 'Noor A.',
		rating: 5,
		date: 'Aug 2026',
		title: 'Gets compliments every time',
		body: 'The design turns heads and the comfort backs it up. Easy favourite in my rotation.'
	}
];

/** Deterministic 3 sample reviews per product, rotated by product index. */
export function sampleReviewsFor(slug: string): SampleReview[] {
	const idx = products.findIndex((p) => p.slug === slug);
	if (idx < 0) return SAMPLE_REVIEWS.slice(0, 3);
	return [0, 3, 6].map((off) => SAMPLE_REVIEWS[(idx + off) % SAMPLE_REVIEWS.length]);
}

/** Demo/sample Q&A pool — clearly labelled "Sample Q&A" wherever shown. */
export const SAMPLE_QAS: SampleQA[] = [
	{
		q: 'Do these run true to size?',
		a: "Most wearers find them true to size. If you are between sizes, go half a size up — see the size guide for foot measurements."
	},
	{
		q: 'Are they good for wide feet?',
		a: 'The fit is standard width. Wide-foot wearers usually go half a size up or choose a wider model.'
	},
	{
		q: 'Can I machine-wash them?',
		a: 'We recommend spot-cleaning with a soft brush and mild soap, then air-drying. Machine washing can damage the cushioning.'
	},
	{
		q: 'Are they suitable for running?',
		a: "They are built for everyday wear and light runs. For serious mileage, look at our dedicated running category."
	},
	{
		q: 'How long does delivery take?',
		a: 'Orders ship within 24 hours. Standard delivery is 2–4 business days; express (1–2 days) is available at checkout.'
	},
	{
		q: "What's the returns policy?",
		a: 'Unworn shoes can be returned within 30 days for a full refund or a free size exchange.'
	}
];

/** Deterministic 3 sample Q&As per product, rotated by product index. */
export function sampleQaFor(slug: string): SampleQA[] {
	const idx = products.findIndex((p) => p.slug === slug);
	if (idx < 0) return SAMPLE_QAS.slice(0, 3);
	return [0, 2, 4].map((off) => SAMPLE_QAS[(idx + off) % SAMPLE_QAS.length]);
}

/** Demo store list, shared by About and the PDP in-store check. Addresses are placeholders. */
export const DEMO_STORES = [
	{ city: 'Portland, OR', address: '214 Runner Street', hours: 'Mon–Sat · 9am–9pm' },
	{ city: 'New York, NY', address: '88 Marathon Avenue', hours: 'Mon–Sun · 10am–10pm' },
	{ city: 'Los Angeles, CA', address: '7 Sunset Strip', hours: 'Mon–Sat · 10am–9pm' }
];
