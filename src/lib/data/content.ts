import { products } from './products';

export function brandSlug(brand: string): string {
	return brand.toLowerCase().replace(/\s+/g, '-');
}

export const brands: string[] = [...new Set(products.map((p) => p.brand))];

export const brandBlurbs: Record<string, string> = {
	Nike: 'Performance running and everyday icons — Air cushioning, breathable mesh and silhouettes that work on the track and on the street.',
	Adidas:
		'Boost comfort and clean three-stripe design. Ultraboost and heritage runners that fit true to size for most feet.',
	Jordan:
		'Court-born heritage. High-top leather icons with the Wings logo — a cultural staple that still plays as good as it looks.',
	'New Balance':
		'Retro running DNA with premium suede and ABZORB cushioning. Chunky, comfortable and unmistakably New Balance.',
	ASICS: 'Stability-first running shoes with GEL cushioning — built for long miles and all-day comfort.',
	Puma: 'Bold 80s attitude rebuilt with modern comfort — leather uppers, gum soles and colourways that go with everything.',
	Vans: 'The original skate classic since 1977. Canvas and suede, waffle grip and a fit that has barely changed — because it never needed to.',
	Converse:
		'The 1970s Chuck, rebuilt with heavier organic canvas and vintage details. The silhouette everyone recognises.',
	Reebok: 'Clean 80s leather and a soft gum sole. A wardrobe staple since 1983 — simple, and simply right.',
	Saucony:
		'90s runner energy with modern comfort tech. Premium suede and mesh with a cushioned midsole — a cult favourite.',
	Fila: 'The chunky icon that defined a decade. A bold sculpted sole, crisp leather upper and unmistakable Fila branding.',
	Yeezy: 'Knit slip-on comfort with Boost underfoot. Limited colourways, while stocks last.'
};

export function brandProducts(brand: string) {
	return products.filter((p) => p.brand === brand);
}

export interface BlogSection {
	heading: string;
	paragraphs: string[];
	bullets?: string[];
}

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	readMinutes: number;
	image: string;
	imageAlt: string;
	sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
	{
		slug: 'how-to-clean-sneakers',
		title: 'How to Clean Your Sneakers',
		excerpt:
			'A step-by-step routine for mesh, leather and suede — what to wash, what to leave alone, and how to dry them without damage.',
		date: '2026-11-10',
		readMinutes: 5,
		image: '/images/prod-vans.png',
		imageAlt: 'Vans Old Skool — black and white canvas skate shoe',
		sections: [
			{
				heading: 'Before you start',
				paragraphs: [
					'Take out the laces and insoles first — they clean better separately, and you can reach the tongue and collar properly with them out of the way. Knock the soles together outside to drop loose dirt, then brush the uppers with a soft, dry brush. A soft toothbrush works for seams and stitching.',
					'Check the material before you pick a cleaner. Mesh and canvas take soap and water happily. Leather wants a gentle wipe, not a soak. Suede should stay as dry as possible — water stains it, and a suede brush does most of the work.'
				]
			},
			{
				heading: 'Laces and insoles',
				paragraphs: [
					'Soak laces in warm water with a drop of mild laundry detergent for 15–20 minutes, then rinse and air-dry. White laces that have gone grey usually come back with a second soak. Insoles can be wiped with a damp cloth and a little soap; if they smell, a light sprinkle of baking soda left overnight, then shaken out, helps.'
				]
			},
			{
				heading: 'Mesh and knit uppers',
				paragraphs: [
					'Mix a few drops of mild dish soap or laundry detergent into warm water. Work it in with a soft brush in small circles, then wipe away the suds with a clean damp cloth. Repeat on stubborn spots rather than scrubbing harder — knit can pill if you attack it.',
					'Never put mesh trainers in a hot wash. Heat can warp the shape and weaken the glue holding the sole. If you must machine-wash canvas shoes, use a cold gentle cycle inside a laundry bag, and skip the spin dry.'
				]
			},
			{
				heading: 'Leather and suede',
				paragraphs: [
					'Wipe smooth leather with a damp cloth and a little soap, then dry it with a clean towel. A leather conditioner every few months keeps it from cracking. For suede, let mud dry completely first, then brush it off with a suede brush — brushing wet suede pushes the dirt in.',
					'Scuffs on suede often lift with a suede eraser or a clean pencil eraser. Water marks are the hardest to fix, so keep suede away from rain where you can, or spray it with a suede protector before the first wear.'
				]
			},
			{
				heading: 'Soles and drying',
				paragraphs: [
					'White midsoles come back with a paste of baking soda and water, worked in with an old toothbrush and wiped off. For the outsole tread, a stiff brush and soapy water clears packed-in dirt.',
					'Stuff shoes with newspaper or plain paper towels while they dry — it holds the shape and pulls moisture out. Air-dry at room temperature, away from radiators and direct sun. Heat is the fastest way to warp a shoe and yellow a white sole.'
				],
				bullets: [
					'Never tumble-dry trainers',
					'Change the stuffing paper once if the shoes were very wet',
					'Wait until fully dry before wearing — damp shoes crease and smell'
				]
			},
			{
				heading: 'What to avoid',
				paragraphs: [
					'Bleach, harsh solvents and stiff wire brushes will damage almost every sneaker material. Skip the washing machine for leather, suede and glued soles. And clean little and often — ten minutes after a muddy run beats an hour of rescue work a month later.'
				]
			}
		]
	},
	{
		slug: 'running-shoe-fit-guide',
		title: 'Running Shoe Fit Guide',
		excerpt:
			'How a running shoe should actually fit — toe room, heel hold, width — and when to size up half a size.',
		date: '2026-11-12',
		readMinutes: 6,
		image: '/images/prod-asics.png',
		imageAlt: 'ASICS GEL-KAYANO 31 — beige and pink stability running shoe',
		sections: [
			{
				heading: 'The thumb test',
				paragraphs: [
					'Stand up in the shoes, laced as you would run. Press your thumb across the front: there should be about a thumb’s width (roughly 1 cm) between your longest toe and the end of the shoe. Feet swell and slide forward when you run, so a shoe that fits exactly in the shop will feel short at kilometre eight.',
					'Your toes should be able to wiggle and spread. If they feel pinched side to side, the shoe is too narrow for you — going up a length will not fix width.'
				]
			},
			{
				heading: 'Heel and midfoot',
				paragraphs: [
					'The heel should feel held, not clamped. A little lift on the first wear is normal while the collar softens, but your heel should not slip with every step — that causes blisters. The midfoot should feel snug and secure without pressure on the top of the foot.',
					'Use the runner’s loop (the extra top eyelet) if your heel slips: lace through it and cross the laces over to lock the ankle down without tightening the whole shoe.'
				]
			},
			{
				heading: 'When to size up',
				paragraphs: [
					'Most runners go up half a size from their everyday shoe. Size up if you run long distances, run in hot weather, or wear thicker socks. Some brands run short or narrow by design — check the fit notes on the product page and our size guide before ordering.',
					'If you are between sizes, the safer choice for running is usually the larger one. A shoe that is slightly long is far more comfortable than one that is slightly short.'
				],
				bullets: [
					'Try shoes on in the afternoon — feet are slightly bigger later in the day',
					'Wear the socks you run in',
					'Walk, then jog a few steps — fit is felt in motion, not standing still'
				]
			},
			{
				heading: 'Width matters',
				paragraphs: [
					'Length is only half the story. If the widest part of your foot spills over the edge of the midsole, or the upper bulges hard at the sides, you need a wider fit, not a longer shoe. Some models come in wide versions — look for a “Wide” or “2E” option.',
					'Narrow feet have the opposite problem: a shoe that is too wide lets the foot slide, which causes hot spots. A secure midfoot lace lock matters more than length here.'
				]
			},
			{
				heading: 'Break-in is a myth (mostly)',
				paragraphs: [
					'A running shoe should feel right on the first run. The upper softens a little over the first week, but pain, numb toes or heel slip will not fix themselves. If something hurts in the first kilometre, it will hurt at kilometre ten — try a different size or model.',
					'Not sure of your size? Try our fit finder, or measure your foot and check the conversion table on the size guide page.'
				]
			}
		]
	},
	{
		slug: 'sneaker-care-101',
		title: 'Sneaker Care 101',
		excerpt:
			'Rotation, storage, weatherproofing and the small habits that keep your favourite pairs looking new for years.',
		date: '2026-11-14',
		readMinutes: 4,
		image: '/images/prod-jordan.png',
		imageAlt: 'Air Jordan 1 Mid — white and red high-top sneaker',
		sections: [
			{
				heading: 'Rotate your pairs',
				paragraphs: [
					'The single best thing you can do for a shoe is not wear it every day. Foam midsoles need about 24 hours to spring back after a run, and leather and knit need time to dry out fully. Two pairs in rotation last far longer than two pairs worn one after the other.',
					'Keep a beater pair for rain and muddy days, and save your favourites for dry weather. Your shoes will thank you, and so will your feet.'
				]
			},
			{
				heading: 'Store them properly',
				paragraphs: [
					'Keep shoes in a cool, dry place out of direct sunlight — UV fades colours and yellows white soles. Stuff them with paper or use shoe trees to hold their shape, especially high-tops and leather pairs that crease easily.',
					'Boxes protect against dust, but sealed plastic traps moisture. If you store shoes in their box, leave the lid slightly open in humid weather, or add a silica gel pack.'
				]
			},
			{
				heading: 'Weatherproof before you need it',
				paragraphs: [
					'Spray suede and canvas with a water-repellent protector before the first wear, not after the first stain. Reapply every few months or after a deep clean. Smooth leather benefits from a conditioner that keeps it supple and water-resistant.',
					'Always test a protector on a small hidden spot first — some sprays darken light suede slightly.'
				]
			},
			{
				heading: 'Creases and odour',
				paragraphs: [
					'Toe-box creases are normal on leather shoes, but you can slow them down with crease protectors or by stuffing shoes after wear. Never iron a shoe — heat damages glue and foam.',
					'For odour, air shoes out after every wear and remove the insoles to dry. Baking soda overnight absorbs smells; cedar shoe trees do the same while holding the shape. Persistent smell usually means the shoes never fully dried — give them a full day in moving air.'
				]
			},
			{
				heading: 'Know when to let go',
				paragraphs: [
					'Running shoes generally last 500–800 km before the cushioning gives up — long before the upper looks worn. If your knees or shins start aching in an old pair, the foam is done, even if the shoes still look fine. For everyday sneakers, cracked midsoles, peeling glue or a collapsed heel counter mean it is time to retire them.'
				]
			}
		]
	}
];

export interface Drop {
	name: string;
	brand: string;
	date: string;
	price: number;
	image: string;
	note: string;
}

export const drops: Drop[] = [
	{
		name: 'Yeezy Boost 350 — “Bone White” restock',
		brand: 'Yeezy',
		date: '2026-11-28',
		price: 219,
		image: '/images/prod-yeezy.png',
		note: 'Limited pairs. One per customer while stocks last.'
	},
	{
		name: 'Air Jordan 1 Mid — “Chicago” colourway',
		brand: 'Jordan',
		date: '2026-12-05',
		price: 249,
		image: '/images/prod-jordan.png',
		note: 'High-top leather. The colourway everyone asks for.'
	},
	{
		name: 'New Balance 9060R — winter suede pack',
		brand: 'New Balance',
		date: '2026-12-12',
		price: 179,
		image: '/images/prod-newbalance.png',
		note: 'Premium suede in seasonal colours.'
	},
	{
		name: 'Nike Air Max DN — “Volt” edition',
		brand: 'Nike',
		date: '2026-12-19',
		price: 189,
		image: '/images/prod-airmax.png',
		note: 'Dynamic Air cushioning in a bright new colourway.'
	},
	{
		name: 'Saucony Shadow 6000 — “Trail Mix”',
		brand: 'Saucony',
		date: '2027-01-09',
		price: 139,
		image: '/images/prod-saucony.png',
		note: 'Retro runner, fresh for the new year.'
	}
];
