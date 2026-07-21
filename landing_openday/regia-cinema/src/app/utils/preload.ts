/**
 * Preload della pagina di ringraziamento quando l'utente inizia a interagire con il form.
 * Questo migliora la percezione di velocità dopo il submit.
 */

let isPreloaded = false;

export function preloadThankYouPage() {
  if (isPreloaded || typeof window === 'undefined') return;
  
  const base = import.meta.env.BASE_URL;
  const thankYouUrl = `${base}grazie-per-aver-compilato-il-form.html`;
  
  // Crea un link preload
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = thankYouUrl;
  link.as = 'document';
  
  document.head.appendChild(link);
  isPreloaded = true;
}

/**
 * Analytics helper per tracciare eventi del form
 */
export function trackFormEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
  
  // Google Tag Manager (dataLayer)
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }

  /* Google tag gtag.js (disattivato — gestito via GTM)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
  */
}

// Type declarations per gli analytics
declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
