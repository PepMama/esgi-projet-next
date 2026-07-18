import styles from "./loading.module.css";

export default function WeatherLoading() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>☀️ Météo App</div>
        <div className={styles.smallLine} />
      </header>

      <main className={styles.main} aria-busy="true" aria-live="polite">
        <p className={styles.accessibleText}>
          Chargement des informations météo...
        </p>

        <section className={styles.hero}>
          <div>
            <div className={styles.label} />
            <div className={styles.title} />
            <div className={styles.text} />
          </div>
          <div className={styles.temperature} />
        </section>

        <section className={styles.details}>
          <div className={styles.sectionTitle} />
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div className={styles.card} key={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
