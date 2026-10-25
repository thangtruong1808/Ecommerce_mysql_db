import { useEffect } from "react";

const SITE = "Badminton Stores";
const DEFAULT_DESCRIPTION =
  "Shop badminton racquets, shoes, apparel, and accessories at Badminton Stores.";

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function usePageTitle(title: string, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE}`;
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", window.location.href);
    return () => {
      document.title = SITE;
      upsertMeta('meta[name="description"]', "name", "description", DEFAULT_DESCRIPTION);
      upsertMeta('meta[property="og:title"]', "property", "og:title", SITE);
      upsertMeta('meta[property="og:description"]', "property", "og:description", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
