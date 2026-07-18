import { getWeatherDescription } from "@/lib/weatherCodes";
import styles from "./DailyForecast.module.css";

type DailyForecastProps = {
  date: string;
  weatherCode: number;
  minimumTemperature: number;
  maximumTemperature: number;
  isToday?: boolean;
};

function formatDate(date: string, isToday: boolean) {
  if (isToday) {
    return "Aujourd'hui";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export default function DailyForecast({
  date,
  weatherCode,
  minimumTemperature,
  maximumTemperature,
  isToday = false,
}: DailyForecastProps) {
  const weather = getWeatherDescription(weatherCode);

  return (
    <article className={styles.card}>
      <p className={styles.date}>{formatDate(date, isToday)}</p>
      <span className={styles.icon} aria-hidden="true">
        {weather.icon}
      </span>
      <p className={styles.description}>{weather.label}</p>
      <div className={styles.temperatures}>
        <strong>{Math.round(maximumTemperature)}°</strong>
        <span>{Math.round(minimumTemperature)}°</span>
      </div>
    </article>
  );
}
