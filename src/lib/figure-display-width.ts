/** Max display widths for documentation figures (support.keet.io). */
const MAX_WIDE = 563;
const MAX_MEDIUM = 492;
const MAX_TALL = 375;

/**
 * Scale high-DPI screenshots to a comfortable reading size (typically 50%,
 * with caps and one 75% tier for wide shots).
 */
export function figureDisplayWidth(
  naturalWidth: number,
  naturalHeight: number,
): number {
  if (naturalWidth <= 320) return naturalWidth;

  const aspect = naturalHeight / naturalWidth;

  if (aspect > 1) {
    return Math.min(Math.round(naturalWidth / 2), MAX_TALL);
  }

  if (aspect > 0.9) {
    return Math.min(Math.round(naturalWidth / 2), MAX_TALL);
  }

  if (naturalWidth >= 900 && aspect <= 0.65) {
    return Math.min(Math.round(naturalWidth / 2), MAX_WIDE);
  }

  if (naturalWidth >= 650 && naturalWidth < 900 && aspect <= 0.75) {
    return Math.min(Math.round(naturalWidth * 0.75), MAX_MEDIUM);
  }

  return Math.min(Math.round(naturalWidth / 2), MAX_WIDE);
}
