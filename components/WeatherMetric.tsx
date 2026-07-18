import styles from "./WeatherMetric.module.css";

type WeatherMetricProps = {
  icon: string;
  label: string;
  value: string;
};

export default function WeatherMetric({
  icon,
  label,
  value,
}: WeatherMetricProps) {
  return (
    <article className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
