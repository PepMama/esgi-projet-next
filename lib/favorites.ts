export type FavoriteCity = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

const STORAGE_KEY = "meteo-app-favorites";
export const FAVORITES_EVENT = "favorites-updated";

function isFavoriteCity(value: unknown): value is FavoriteCity {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const city = value as Record<string, unknown>;

  return (
    typeof city.id === "string" &&
    typeof city.name === "string" &&
    typeof city.country === "string" &&
    typeof city.latitude === "number" &&
    typeof city.longitude === "number" &&
    typeof city.timezone === "string"
  );
}

export function getFavorites(): FavoriteCity[] {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);

    if (!savedFavorites) {
      return [];
    }

    const parsedFavorites: unknown = JSON.parse(savedFavorites);

    return Array.isArray(parsedFavorites)
      ? parsedFavorites.filter(isFavoriteCity)
      : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteCity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}
