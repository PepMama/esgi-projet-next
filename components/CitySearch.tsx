"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CitySearch.module.css";

export type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  admin1?: string;
};

type GeocodingResponse = {
  results?: City[];
};

type CitySearchProps = {
  label?: string;
  placeholder?: string;
  onSelect?: (city: City) => void;
};

export default function CitySearch({
  label = "Rechercher une ville",
  placeholder = "Exemple : Paris, Lyon, Marseille...",
  onSelect,
}: CitySearchProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 3) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        const parameters = new URLSearchParams({
          name: trimmedQuery,
          count: "5",
          language: "fr",
          format: "json",
        });

        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?${parameters}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("La recherche a échoué");
        }

        const data: GeocodingResponse = await response.json();
        setCities(data.results ?? []);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name !== "AbortError") {
          setCities([]);
          setError("Impossible de rechercher une ville pour le moment.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  function selectCity(city: City) {
    if (onSelect) {
      setQuery(city.name);
      setCities([]);
      onSelect(city);
      return;
    }

    const parameters = new URLSearchParams({
      latitude: city.latitude.toString(),
      longitude: city.longitude.toString(),
      timezone: city.timezone,
      country: city.country ?? "",
    });

    router.push(`/ville/${encodeURIComponent(city.name)}?${parameters}`);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setCities([]);
    setError("");
    setIsLoading(value.trim().length >= 3);
  }

  const showNoResult =
    trimmedQuery.length >= 3 && !isLoading && !error && cities.length === 0;

  return (
    <div className={styles.searchBox}>
      <label htmlFor={inputId}>{label}</label>

      <div className={styles.searchRow}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input
          id={inputId}
          name="city"
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby="search-help"
        />
        <span className={styles.loading} aria-live="polite">
          {isLoading ? "Recherche..." : ""}
        </span>
      </div>

      <p id="search-help" className={styles.help}>
        Saisissez au moins 3 caractères.
      </p>

      {(cities.length > 0 || showNoResult || error) && (
        <div className={styles.results} aria-live="polite">
          {error && <p className={styles.message}>{error}</p>}

          {showNoResult && (
            <p className={styles.message}>
              Aucune ville trouvée pour «&nbsp;{trimmedQuery}&nbsp;».
            </p>
          )}

          {cities.map((city) => (
            <button
              className={styles.result}
              type="button"
              key={city.id}
              onClick={() => selectCity(city)}
            >
              <span className={styles.pin} aria-hidden="true">
                📍
              </span>
              <span>
                <strong>{city.name}</strong>
                <small>
                  {[city.admin1, city.country].filter(Boolean).join(", ")}
                </small>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
