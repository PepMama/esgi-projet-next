"use client";

import { useEffect, useState } from "react";
import {
  FAVORITES_EVENT,
  FavoriteCity,
  getFavorites,
  saveFavorites,
} from "@/lib/favorites";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  city: FavoriteCity;
};

export default function FavoriteButton({ city }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    function updateFavoriteStatus() {
      setIsFavorite(
        getFavorites().some((favoriteCity) => favoriteCity.id === city.id),
      );
    }

    updateFavoriteStatus();
    window.addEventListener(FAVORITES_EVENT, updateFavoriteStatus);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, updateFavoriteStatus);
    };
  }, [city.id]);

  function toggleFavorite() {
    const favorites = getFavorites();

    if (isFavorite) {
      saveFavorites(
        favorites.filter((favoriteCity) => favoriteCity.id !== city.id),
      );
    } else {
      saveFavorites([...favorites, city]);
    }
  }

  return (
    <button
      className={`${styles.button} ${isFavorite ? styles.active : ""}`}
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
    >
      <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
      {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
