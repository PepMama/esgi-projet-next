"use client";

import Link from "next/link";
import { useState } from "react";
import CitySearch, { City } from "@/components/CitySearch";
import { getWeatherDescription } from "@/lib/weatherCodes";
import styles from "./page.module.css";

type CurrentWeather = {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  is_day: number;
};

type WeatherResponse = {
  current: CurrentWeather;
};

type ComparedCity = {
  city: City;
  weather: CurrentWeather;
};

async function getCurrentWeather(city: City) {
  const parameters = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    timezone: city.timezone,
    forecast_days: "1",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parameters}`,
  );

  if (!response.ok) {
    throw new Error("La météo est indisponible.");
  }

  const data = (await response.json()) as WeatherResponse;
  return data.current;
}

export default function ComparisonPage() {
  const [firstCity, setFirstCity] = useState<City | null>(null);
  const [secondCity, setSecondCity] = useState<City | null>(null);
  const [comparison, setComparison] = useState<ComparedCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function compareCities() {
    if (!firstCity || !secondCity) {
      setError("Sélectionnez deux villes dans les listes de suggestions.");
      return;
    }

    if (firstCity.id === secondCity.id) {
      setError("Choisissez deux villes différentes.");
      return;
    }

    setIsLoading(true);
    setError("");
    setComparison([]);

    try {
      const [firstWeather, secondWeather] = await Promise.all([
        getCurrentWeather(firstCity),
        getCurrentWeather(secondCity),
      ]);

      setComparison([
        { city: firstCity, weather: firstWeather },
        { city: secondCity, weather: secondWeather },
      ]);
    } catch {
      setError("Impossible de comparer ces villes pour le moment.");
    } finally {
      setIsLoading(false);
    }
  }

  const warmestTemperature =
    comparison.length === 2
      ? Math.max(
          comparison[0].weather.temperature_2m,
          comparison[1].weather.temperature_2m,
        )
      : null;

  const lowestWind =
    comparison.length === 2
      ? Math.min(
          comparison[0].weather.wind_speed_10m,
          comparison[1].weather.wind_speed_10m,
        )
      : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <span>☀️</span>
          Météo App
        </Link>
        <Link className={styles.backLink} href="/">
          ← Retour à l&apos;accueil
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.introduction}>
          <p>Fonctionnalité originale</p>
          <h1>Comparer deux villes</h1>
          <span>
            Choisissez deux destinations pour comparer leur météo actuelle.
          </span>
        </section>

        <section className={styles.selection} aria-label="Choix des villes">
          <div className={styles.picker}>
            <span className={styles.number}>1</span>
            <CitySearch
              label="Première ville"
              placeholder="Exemple : Paris..."
              onSelect={(city) => {
                setFirstCity(city);
                setComparison([]);
              }}
            />
            {firstCity && (
              <p className={styles.selected}>
                ✓ {firstCity.name}, {firstCity.country}
              </p>
            )}
          </div>

          <div className={styles.versus}>VS</div>

          <div className={styles.picker}>
            <span className={styles.number}>2</span>
            <CitySearch
              label="Deuxième ville"
              placeholder="Exemple : Londres..."
              onSelect={(city) => {
                setSecondCity(city);
                setComparison([]);
              }}
            />
            {secondCity && (
              <p className={styles.selected}>
                ✓ {secondCity.name}, {secondCity.country}
              </p>
            )}
          </div>
        </section>

        <div className={styles.action}>
          <button type="button" onClick={compareCities} disabled={isLoading}>
            {isLoading ? "Comparaison en cours..." : "Comparer la météo"}
          </button>
          {error && <p role="alert">{error}</p>}
        </div>

        {comparison.length === 2 && (
          <section className={styles.results} aria-label="Résultat">
            {comparison.map(({ city, weather }) => {
              const condition = getWeatherDescription(
                weather.weather_code,
                weather.is_day === 1,
              );

              return (
                <article className={styles.weatherCard} key={city.id}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h2>{city.name}</h2>
                      <p>
                        {[city.admin1, city.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <span aria-hidden="true">{condition.icon}</span>
                  </div>

                  <div className={styles.mainTemperature}>
                    <strong>{Math.round(weather.temperature_2m)}°C</strong>
                    <p>{condition.label}</p>
                    {weather.temperature_2m === warmestTemperature && (
                      <span>🔥 Ville la plus chaude</span>
                    )}
                  </div>

                  <dl className={styles.details}>
                    <div>
                      <dt>Ressenti</dt>
                      <dd>{Math.round(weather.apparent_temperature)}°C</dd>
                    </div>
                    <div>
                      <dt>Humidité</dt>
                      <dd>{weather.relative_humidity_2m}%</dd>
                    </div>
                    <div>
                      <dt>Vent</dt>
                      <dd>{Math.round(weather.wind_speed_10m)} km/h</dd>
                    </div>
                  </dl>

                  {weather.wind_speed_10m === lowestWind && (
                    <p className={styles.windWinner}>
                      🍃 Ville la moins venteuse
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        Données météorologiques fournies par Open-Meteo
      </footer>
    </div>
  );
}
