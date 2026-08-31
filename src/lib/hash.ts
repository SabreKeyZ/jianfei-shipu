import type { TabId } from "../types";

export interface Route {
  tab: TabId;
  recipeId: string | null;
  dateKey: string | null;
}

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/today";
  const [path, query = ""] = raw.split("?");
  const params = new URLSearchParams(query);
  const dateKey = params.get("d");
  const parts = path.split("/").filter(Boolean);

  if (parts[0] === "recipe" && parts[1]) {
    return { tab: "today", recipeId: parts[1], dateKey };
  }
  if (
    parts[0] === "week" ||
    parts[0] === "grocery" ||
    parts[0] === "today" ||
    parts[0] === "library"
  ) {
    return { tab: parts[0], recipeId: null, dateKey };
  }
  return { tab: "today", recipeId: null, dateKey };
}

export function toHash(route: Route): string {
  if (route.recipeId) {
    const query = route.dateKey ? `?d=${route.dateKey}` : "";
    return `#/recipe/${route.recipeId}${query}`;
  }
  return `#/${route.tab}`;
}

export function navigate(route: Route): void {
  const next = toHash(route);
  if (window.location.hash !== next) {
    window.location.hash = next.slice(1);
  }
}
