import CitySearch from "@/components/CitySearch";
import FavoritesList from "@/components/FavoritesList";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.logo} href="#">
          <span className={styles.logoIcon}>☀️</span>
          Météo App
        </a>

        <nav className={styles.navigation} aria-label="Navigation principale">
          <a href="#recherche">Rechercher</a>
          <a href="#favoris">Mes favoris</a>
          <a href="/comparaison">Comparer</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>La météo en un coup d&apos;œil</p>
            <h1>Quel temps fait-il chez vous&nbsp;?</h1>
            <p className={styles.introduction}>
              Recherchez une ville pour découvrir la météo actuelle et les
              prévisions des prochains jours.
            </p>

            <div id="recherche">
              <CitySearch />
            </div>
          </div>

          <div className={styles.weatherCard} aria-hidden="true">
            <div className={styles.weatherCardTop}>
              <div>
                <p>Aujourd&apos;hui</p>
                <strong>Votre ville</strong>
              </div>
              <span>☀️</span>
            </div>
            <p className={styles.temperature}>--°</p>
            <p className={styles.weatherText}>La météo apparaîtra ici</p>
            <div className={styles.cardDetails}>
              <span>💧 Humidité</span>
              <span>💨 Vent</span>
            </div>
          </div>
        </section>

        <section className={styles.favorites} id="favoris">
          <FavoritesList />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Météo App — Mini-projet Next.js</p>
        <p>Données météorologiques fournies par Open-Meteo</p>
      </footer>
    </div>
  );
}
