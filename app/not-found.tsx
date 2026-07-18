import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span className={styles.weatherIcon} aria-hidden="true">
          🧭
        </span>
        <p className={styles.code}>Erreur 404</p>
        <h1>Cette ville est introuvable</h1>
        <p>
          La page demandée n&apos;existe pas ou ses informations de localisation
          sont incomplètes.
        </p>
        <Link href="/">Rechercher une autre ville</Link>
      </div>
    </main>
  );
}
