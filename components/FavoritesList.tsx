"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FAVORITES_EVENT,
  FavoriteCity,
  getFavorites,
  saveFavorites,
} from "@/lib/favorites";
import styles from "./FavoritesList.module.css";

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    function updateFavorites() {
      setFavorites(getFavorites());
    }

    updateFavorites();
    window.addEventListener(FAVORITES_EVENT, updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  function removeFavorite(cityId: string) {
    saveFavorites(favorites.filter((city) => city.id !== cityId));
  }

  return (
    <>
      <div className={styles.sectionTitle}>
        <div>
          <p>Accès rapide</p>
          <h2>Mes villes favorites</h2>
        </div>
        <span className={styles.favoriteCount}>
          {favorites.length} {favorites.length > 1 ? "villes" : "ville"}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">☆</span>
          <h3>Aucune ville favorite</h3>
          <p>
            Ajoutez une ville depuis sa page météo pour la retrouver rapidement
            ici.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.map((city) => {
            const parameters = new URLSearchParams({
              latitude: city.latitude.toString(),
              longitude: city.longitude.toString(),
              timezone: city.timezone,
              country: city.country,
            });

            return (
              <article className={styles.card} key={city.id}>
                <Link
                  href={`/ville/${encodeURIComponent(city.name)}?${parameters}`}
                >
                  <span className={styles.pin} aria-hidden="true">
                    📍
                  </span>
                  <div>
                    <h3>{city.name}</h3>
                    <p>{city.country || "Pays non renseigné"}</p>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavorite(city.id)}
                  aria-label={`Retirer ${city.name} des favoris`}
                  title="Retirer des favoris"
                >
                  ★
                </button>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
