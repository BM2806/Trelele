/** Product-specific swipe threshold, not Tinder's internal implementation.
 * A distance-only decision avoids treating a short fast tap as a preference.
 * The UI must call this only on a successful primary-pointer up; pointercancel
 * and lost capture must reset the card without submitting a decision.
 */
export function classifySwipe({ dx, dy, width, durationMs }) {
  if (![dx, dy, width, durationMs].every(Number.isFinite) || width <= 0 || durationMs < 0) return 'cancel';
  const threshold = Math.max(72, width * 0.24);
  if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.35) return 'cancel';
  return dx > 0 ? 'like' : 'pass';
}
