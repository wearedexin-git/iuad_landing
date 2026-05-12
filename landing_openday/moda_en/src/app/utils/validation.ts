/**
 * Validazione email con regex completa
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validazione numero di telefono italiano
 * Accetta formati: +39, 0039, 3xx, 0x
 */
export function isValidItalianPhone(phone: string): boolean {
  // Rimuovi spazi, trattini, parentesi
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Pattern per numeri italiani
  const patterns = [
    /^\+39[0-9]{9,10}$/,           // +39 seguito da 9-10 cifre
    /^0039[0-9]{9,10}$/,           // 0039 seguito da 9-10 cifre
    /^3[0-9]{8,9}$/,               // Cellulare che inizia con 3
    /^0[0-9]{9,10}$/,              // Fisso che inizia con 0
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Formatta il numero di telefono per una visualizzazione pulita
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Se inizia con +39 o 0039, rimuovili
  let number = cleaned.replace(/^(\+39|0039)/, '');
  
  // Se è un cellulare (3xx), aggiungi +39
  if (number.startsWith('3')) {
    return '+39 ' + number;
  }
  
  // Se è un fisso (0x), aggiungi +39
  if (number.startsWith('0')) {
    return '+39 ' + number;
  }
  
  return phone;
}

/**
 * Sanitizza una stringa rimuovendo caratteri potenzialmente pericolosi
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Rimuovi < e >
    .substring(0, 200); // Limita lunghezza
}

/**
 * Validazione nome/cognome (solo lettere, spazi, apostrofi, trattini)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'\-]{2,50}$/;
  return nameRegex.test(name);
}

/**
 * Verifica se una stringa contiene solo spazi
 */
export function isNotEmpty(str: string): boolean {
  return str.trim().length > 0;
}

/**
 * Messaggio di errore user-friendly basato sul tipo di validazione fallita
 */
export function getValidationError(field: string, value: string): string | null {
  switch (field) {
    case 'nome':
      if (!isNotEmpty(value)) {
        return 'First name is required.';
      }
      if (!isValidName(value)) {
        return 'First name may only include letters, spaces, apostrophes, and hyphens.';
      }
      return null;
      
    case 'cognome':
      if (!isNotEmpty(value)) {
        return 'Last name is required.';
      }
      if (!isValidName(value)) {
        return 'Last name may only include letters, spaces, apostrophes, and hyphens.';
      }
      return null;
      
    case 'email':
      if (!isNotEmpty(value)) {
        return 'Email address is required.';
      }
      if (!isValidEmail(value)) {
        return 'Please enter a valid email address.';
      }
      return null;
      
    case 'telefono':
      if (!isNotEmpty(value)) {
        return 'Phone number is required.';
      }
      if (!isValidItalianPhone(value)) {
        return 'Please enter a valid phone number (e.g. +39 3xx xxx xxxx).';
      }
      return null;
      
    default:
      return null;
  }
}
