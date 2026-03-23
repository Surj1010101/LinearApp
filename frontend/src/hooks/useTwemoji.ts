import { useEffect, useRef } from 'react';
import twemoji from 'twemoji';

const TWEMOJI_OPTIONS: TwemojiOptions = {
  folder: 'svg',
  ext: '.svg',
  base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
};

/**
 * Replaces every native Unicode emoji inside a container with
 * Twemoji SVG images (the same emoji set Figma uses).
 *
 * A MutationObserver watches for any DOM changes inside the container
 * so dynamically-rendered emojis (loading states, expanded rows, etc.)
 * are automatically converted too.
 *
 * Usage:
 *   const ref = useTwemoji<HTMLDivElement>();
 *   return <div ref={ref}>😊</div>;
 */
export function useTwemoji<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial parse
    twemoji.parse(el, TWEMOJI_OPTIONS);

    // Watch for any child changes and re-parse new nodes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            twemoji.parse(node as HTMLElement, TWEMOJI_OPTIONS);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            twemoji.parse(node.parentElement, TWEMOJI_OPTIONS);
          }
        });
      }
    });

    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default useTwemoji;
