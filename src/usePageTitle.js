import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | 아가몽` : "아가몽 | 전국 강아지·고양이 분양";
  }, [title]);
}
