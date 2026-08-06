/** Margin reading marker.
 *
 *  Fills a hairline in the page margin to match how far through the document you are.
 *  It reports real state and nothing else, no scroll hijacking, no reveal animations.
 *  Without JavaScript the rail simply never appears, and nothing is hidden waiting on it.
 */
export function initReadMarker(): void {
  const fill = document.getElementById('readMarkerFill');
  if (!fill) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      fill.style.height = '0%';
      return;
    }
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    fill.style.height = `${(progress * 100).toFixed(2)}%`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}
