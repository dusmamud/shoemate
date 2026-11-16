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
	sizes: string[];
	image: string;
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
		sizes: SIZES,
		image: '/images/prod-airmax.png',
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
		sizes: SIZES,
		image: '/images/prod-ultraboost.png',
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
		sizes: SIZES,
		image: '/images/prod-newbalance.png',
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
		sizes: SIZES,
		image: '/images/prod-asics.png',
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
		sizes: SIZES,
		image: '/images/prod-puma.png',
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
		sizes: SIZES,
		image: '/images/prod-jordan.png',
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
		sizes: SIZES,
		image: '/images/prod-vans.png',
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
		sizes: SIZES,
		image: '/images/prod-converse.png',
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
		sizes: SIZES,
		image: '/images/prod-reebok.png',
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
		sizes: SIZES,
		image: '/images/prod-saucony.png',
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
		sizes: SIZES,
		image: '/images/prod-fila.png',
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
		sizes: SIZES,
		image: '/images/prod-yeezy.png',
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
