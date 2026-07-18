"use client";

import Link from "next/link";
import styles from "./error.module.css";

type WeatherErrorProps = {
  reset: () => void;
};

export default function WeatherError({ reset }: WeatherErrorProps) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          🌧️
        </span>
        <p className={styles.eyebrow}>Erreur météo</p>
        <h1>La météo est momentanément indisponible</h1>
        <p className={styles.description}>
          L&apos;API ne répond pas ou votre connexion a été interrompue. Vous
          pouvez réessayer dans quelques instants.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={reset}>
            Réessayer
          </button>
          <Link href="/">Revenir à l&apos;accueil</Link>
        </div>
      </div>
    </main>
  );
}
