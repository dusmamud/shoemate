/**
 * Compare specs, keyed by product slug.
 *
 * These are indicative spec values written for the compare table (labelled
 * as specs on the page) — they are plausible per-model figures, not
 * manufacturer-certified measurements. Weight is per shoe (UK 9), drop is
 * heel-to-toe offset.
 */

export interface ProductSpecs {
	weight: string;
	drop: string;
	materials: string;
	cushioning: string;
}

export const specs: Record<string, ProductSpecs> = {
	'nike-air-max-dn': {
		weight: '310 g',
		drop: '10 mm',
		materials: 'Engineered mesh upper, synthetic overlays',
		cushioning: 'Dynamic Air unit + Cushlon foam'
	},
	'adidas-ultraboost-5': {
		weight: '298 g',
		drop: '10 mm',
		materials: 'Primeknit textile upper, recycled yarn',
		cushioning: 'Full-length Boost foam + LEP torsion system'
	},
	'new-balance-9060r': {
		weight: '385 g',
		drop: '8 mm',
		materials: 'Suede + mesh upper, leather overlays',
		cushioning: 'ABZORB SBS midsole + SBS heel cushioning'
	},
	'asics-gel-kayano-31': {
		weight: '303 g',
		drop: '10 mm',
		materials: 'Engineered mesh upper, recycled content',
		cushioning: 'PureGEL + FF BLAST PLUS ECO foam'
	},
	'puma-rs-x': {
		weight: '372 g',
		drop: '10 mm',
		materials: 'Leather upper, mesh underlays',
		cushioning: 'RS foam midsole, rubber outsole'
	},
	'air-jordan-1-mid': {
		weight: '402 g',
		drop: '8 mm',
		materials: 'Full-grain leather upper, perforated toe',
		cushioning: 'Encapsulated Air-Sole heel unit'
	},
	'vans-old-skool': {
		weight: '365 g',
		drop: '6 mm',
		materials: 'Canvas + suede upper, vulcanised sole',
		cushioning: 'UltraCush foam insole'
	},
	'converse-chuck-70': {
		weight: '398 g',
		drop: '5 mm',
		materials: 'Organic canvas upper, rubber foxing',
		cushioning: 'OrthoLite insole'
	},
	'reebok-classic-leather': {
		weight: '355 g',
		drop: '8 mm',
		materials: 'Garment leather upper, suede overlays',
		cushioning: 'Die-cut EVA sockliner, gum rubber outsole'
	},
	'saucony-shadow-6000': {
		weight: '348 g',
		drop: '8 mm',
		materials: 'Suede + mesh upper, leather overlays',
		cushioning: 'EVA midsole + heel cushioning'
	},
	'fila-disruptor-2': {
		weight: '415 g',
		drop: '9 mm',
		materials: 'Leather upper, mesh tongue',
		cushioning: 'Moulded EVA midsole'
	},
	'yeezy-boost-350': {
		weight: '289 g',
		drop: '10 mm',
		materials: 'Primeknit textile upper, suede heel tab',
		cushioning: 'Full-length Boost foam'
	}
};

export function getSpecs(slug: string): ProductSpecs | undefined {
	return specs[slug];
}
