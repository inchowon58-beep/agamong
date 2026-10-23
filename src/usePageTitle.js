import { useEffect } from "react";
import { SITE_TITLE } from "./data/site.js";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | 아가몽` : SITE_TITLE;
  }, [title]);
}
