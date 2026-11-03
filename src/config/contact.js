/**
 * Single source of truth for public company contact details.
 *
 * The phone number is read from VITE_CONTACT_PHONE (e.g. "+973 1234 5678").
 * Until a real number is configured, no phone number is displayed and no
 * `tel:` link is rendered, so visitors are never shown a placeholder number.
 */
const rawPhone = String(import.meta.env.VITE_CONTACT_PHONE || "").trim();

export const CONTACT_EMAIL = "nooralafiyahomecare@gmail.com";
export const CONTACT_PHONE_DISPLAY = rawPhone;
export const CONTACT_PHONE_HREF = rawPhone
  ? `tel:${rawPhone.replace(/[^\d+]/g, "")}`
  : "";
export const HAS_CONTACT_PHONE = Boolean(CONTACT_PHONE_HREF);
