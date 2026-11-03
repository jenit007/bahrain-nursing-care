import { useEffect } from "react";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");

function setMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets a unique document title, meta description, Open Graph tags and
 * (optionally) a canonical URL / robots directive for the current page.
 * Canonical and og:url are only emitted when VITE_SITE_URL is configured.
 */
export default function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('meta[property="og:title"]', "property", "og:title", title);
    }
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
    }
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    if (SITE_URL && path) {
      const url = `${SITE_URL}${path}`;
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
      setMeta('meta[property="og:url"]', "property", "og:url", url);
    }
  }, [title, description, path, noindex]);
}
