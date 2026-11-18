/**
 * Responsive-image helper (Wave A image optimisation).
 *
 * Every photo in `static/images/` exists as:
 * - the original PNG (source of truth + fallback, untouched)
 * - WebP variants at widths 400 / 800 / 1200 / 1600, quality ~75
 *   (`{basename}-{width}.webp`) — never upscaled past the native width
 * - a 1200px-wide JPEG (`{basename}.jpg`) for og:image / JSON-LD, where
 *   social scrapers fail silently on WebP
 * - a 1200x630 OG composition (`og-{basename}.jpg`) for representative images
 *
 * Data files keep referencing the `.png` path; this helper maps it to the
 * WebP variants at render time, so no data file had to change.
 */

const WIDTHS = [400, 800, 1200, 1600] as const;

/** Native pixel widths below 1600 — these get a shorter ladder (no upscaling). */
const NATIVE_WIDTH: Record<string, number> = {
	'/images/hero-sneaker.png': 1422,
	'/images/cat-premium.png': 1344
};

function webpPath(pngPath: string, width: number): string {
	return pngPath.replace(/\.png$/, `-${width}.webp`);
}

export interface ResponsiveImage {
	/** WebP at the largest available width — the `src` fallback. */
	src: string;
	/** `"<url> 400w, <url> 800w, …"` — pair with a per-context `sizes`. */
	srcset: string;
}

/**
 * Takes a `/images/*.png` path (as stored in the data files) and returns the
 * WebP `src` + `srcset` for it. Each `<img>` supplies its own `sizes` for
 * its display context.
 */
export function responsiveImage(pngPath: string): ResponsiveImage {
	const maxWidth = NATIVE_WIDTH[pngPath] ?? 1600;
	const widths = WIDTHS.filter((w) => w <= maxWidth);
	const largest = widths[widths.length - 1];
	return {
		src: webpPath(pngPath, largest),
		srcset: widths.map((w) => `${webpPath(pngPath, w)} ${w}w`).join(', ')
	};
}

/** 1200px-wide JPEG version of a PNG — for og:image / JSON-LD `image` only. */
export function jpegSrc(pngPath: string): string {
	return pngPath.replace(/\.png$/, '.jpg');
}

/** 1200x630 OG composition (shoe fitted, never cropped, on white) if one exists. */
export function ogSrc(pngPath: string): string {
	return pngPath.replace('/images/', '/images/og-').replace(/\.png$/, '.jpg');
}
