import Link from "next/link";
import { notFound } from "next/navigation";
import DailyForecast from "@/components/DailyForecast";
import WeatherMetric from "@/components/WeatherMetric";
import { getWeatherDescription } from "@/lib/weatherCodes";
import styles from "./page.module.css";

type WeatherPageProps = {
  params: Promise<{ nom: string }>;
  searchParams: Promise<{
    latitude?: string;
    longitude?: string;
    timezone?: string;
    country?: string;
  }>;
};

type WeatherData = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    pressure_msl: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
    uv_index: number;
  };
  current_units: {
    temperature_2m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    pressure_msl: string;
    wind_speed_10m: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

function formatHour(date: string) {
  return date.split("T")[1]?.slice(0, 5) ?? "--:--";
}

async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
) {
  const parameters = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code,is_day,uv_index",
    daily:
      "weather_code,temperature_2m_min,temperature_2m_max,sunrise,sunset,uv_index_max",
    timezone,
    forecast_days: "7",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parameters}`,
    { next: { revalidate: 900 } },
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données météo.");
  }

  return (await response.json()) as WeatherData;
}

export default async function WeatherPage({
  params,
  searchParams,
}: WeatherPageProps) {
  const { nom } = await params;
  const query = await searchParams;
  const latitude = Number(query.latitude);
  const longitude = Number(query.longitude);

  const coordinatesAreValid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  if (!coordinatesAreValid || !query.timezone) {
    notFound();
  }

  const weather = await getWeather(latitude, longitude, query.timezone);
  const current = weather.current;
  const condition = getWeatherDescription(
    current.weather_code,
    current.is_day === 1,
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <span>☀️</span>
          Météo App
        </Link>
        <Link className={styles.backLink} href="/">
          ← Nouvelle recherche
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.currentWeather}>
          <div>
            <p className={styles.locationLabel}>Météo actuelle</p>
            <h1>{nom}</h1>
            {query.country && <p className={styles.country}>{query.country}</p>}
            <p className={styles.updatedAt}>
              Mise à jour à {formatHour(current.time)}
            </p>
          </div>

          <div className={styles.mainCondition}>
            <span className={styles.weatherIcon} aria-hidden="true">
              {condition.icon}
            </span>
            <div>
              <p className={styles.temperature}>
                {Math.round(current.temperature_2m)}
                <span>{weather.current_units.temperature_2m}</span>
              </p>
              <p className={styles.conditionLabel}>{condition.label}</p>
            </div>
          </div>
        </section>

        <section className={styles.details} aria-labelledby="details-title">
          <div className={styles.sectionTitle}>
            <div>
              <p>En détail</p>
              <h2 id="details-title">Conditions météorologiques</h2>
            </div>
            <span>
              {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
            </span>
          </div>

          <div className={styles.metricsGrid}>
            <WeatherMetric
              icon="🌡️"
              label="Température ressentie"
              value={`${Math.round(current.apparent_temperature)} ${weather.current_units.apparent_temperature}`}
            />
            <WeatherMetric
              icon="💧"
              label="Humidité"
              value={`${current.relative_humidity_2m} ${weather.current_units.relative_humidity_2m}`}
            />
            <WeatherMetric
              icon="🧭"
              label="Pression"
              value={`${Math.round(current.pressure_msl)} ${weather.current_units.pressure_msl}`}
            />
            <WeatherMetric
              icon="💨"
              label="Vitesse du vent"
              value={`${Math.round(current.wind_speed_10m)} ${weather.current_units.wind_speed_10m}`}
            />
            <WeatherMetric
              icon="🧴"
              label="Indice UV actuel"
              value={current.uv_index.toFixed(1)}
            />
            <WeatherMetric
              icon="🔆"
              label="Indice UV maximum"
              value={weather.daily.uv_index_max[0]?.toFixed(1) ?? "Indisponible"}
            />
          </div>
        </section>

        <section className={styles.sunSection} aria-labelledby="sun-title">
          <div>
            <p className={styles.sunEyebrow}>Cycle solaire</p>
            <h2 id="sun-title">Lever et coucher du soleil</h2>
            <p>
              Horaires calculés selon la position et le fuseau horaire de la
              ville.
            </p>
          </div>

          <div className={styles.sunTimes}>
            <div>
              <span aria-hidden="true">🌅</span>
              <p>Lever</p>
              <strong>{formatHour(weather.daily.sunrise[0])}</strong>
            </div>
            <div>
              <span aria-hidden="true">🌇</span>
              <p>Coucher</p>
              <strong>{formatHour(weather.daily.sunset[0])}</strong>
            </div>
          </div>
        </section>

        <section className={styles.forecast} aria-labelledby="forecast-title">
          <div className={styles.forecastTitle}>
            <div>
              <p>Cette semaine</p>
              <h2 id="forecast-title">Prévisions sur 7 jours</h2>
            </div>
            <div className={styles.legend}>
              <span>● Maximum</span>
              <span>● Minimum</span>
            </div>
          </div>

          <div className={styles.forecastGrid}>
            {weather.daily.time.map((date, index) => (
              <DailyForecast
                key={date}
                date={date}
                weatherCode={weather.daily.weather_code[index]}
                minimumTemperature={weather.daily.temperature_2m_min[index]}
                maximumTemperature={weather.daily.temperature_2m_max[index]}
                isToday={index === 0}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        Données météorologiques fournies par Open-Meteo
      </footer>
    </div>
  );
}
