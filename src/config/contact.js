/**
 * Single source of truth for public company contact details.
 *
 * Uses VITE_CONTACT_PHONE if overridden in the environment, falling back to
 * the official NOOR AL AFIYA business phone number (+973 37225221).
 */
const DEFAULT_CONTACT_PHONE = "+973 37225221";
const rawPhone = String(
  import.meta.env.VITE_CONTACT_PHONE || DEFAULT_CONTACT_PHONE
).trim();

export const CONTACT_EMAIL = "nooralafiyahomecare@gmail.com";
export const CONTACT_PHONE_DISPLAY = rawPhone;
export const CONTACT_PHONE_HREF = rawPhone
  ? `tel:${rawPhone.replace(/[^\d+]/g, "")}`
  : "";
export const HAS_CONTACT_PHONE = Boolean(CONTACT_PHONE_HREF);
