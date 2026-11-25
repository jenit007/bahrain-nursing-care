/**
 * Single source of truth for public company contact details.
 *
 * Uses VITE_CONTACT_PHONE if overridden in the environment, falling back to
 * the official NOOR AL AFIYA business phone number (+973 13644221).
 * Note: Old number +973 37225221 is strictly deprecated and not displayed.
 */
const DEFAULT_CONTACT_PHONE = "+973 13644221";
const rawPhone = String(
  import.meta.env.VITE_CONTACT_PHONE || DEFAULT_CONTACT_PHONE
).trim();

// Alt phone is optional. Do not display old number +973 37225221, and do not invent a replacement number.
const DEFAULT_ALT_PHONE = "";
const rawAltPhone = String(
  import.meta.env.VITE_CONTACT_ALT_PHONE || DEFAULT_ALT_PHONE
).trim();

export const CONTACT_EMAIL = "nooralafiyahomecare@gmail.com";
export const CONTACT_PHONE_DISPLAY = rawPhone;
export const CONTACT_PHONE_HREF = rawPhone
  ? `tel:${rawPhone.replace(/[^\d+]/g, "")}`
  : "";
export const HAS_CONTACT_PHONE = Boolean(CONTACT_PHONE_HREF);

// Strictly forbid displaying the deprecated number +973 37225221
const isOldAltNumber = rawAltPhone.replace(/[^\d+]/g, "").endsWith("37225221");
const safeAltPhone = isOldAltNumber ? "" : rawAltPhone;

export const CONTACT_ALT_PHONE_DISPLAY = safeAltPhone;
export const CONTACT_ALT_PHONE_HREF = safeAltPhone
  ? `tel:${safeAltPhone.replace(/[^\d+]/g, "")}`
  : "";
export const HAS_CONTACT_ALT_PHONE = Boolean(CONTACT_ALT_PHONE_HREF);

export const NHRA_REGISTRATION_NO = "900100-0025";
