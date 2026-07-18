type WeatherDescription = {
  label: string;
  dayIcon: string;
  nightIcon: string;
};

const weatherDescriptions: Record<number, WeatherDescription> = {
  0: { label: "Ciel dégagé", dayIcon: "☀️", nightIcon: "🌙" },
  1: { label: "Plutôt dégagé", dayIcon: "🌤️", nightIcon: "🌙" },
  2: { label: "Partiellement nuageux", dayIcon: "⛅", nightIcon: "☁️" },
  3: { label: "Couvert", dayIcon: "☁️", nightIcon: "☁️" },
  45: { label: "Brouillard", dayIcon: "🌫️", nightIcon: "🌫️" },
  48: { label: "Brouillard givrant", dayIcon: "🌫️", nightIcon: "🌫️" },
  51: { label: "Bruine légère", dayIcon: "🌦️", nightIcon: "🌧️" },
  53: { label: "Bruine modérée", dayIcon: "🌦️", nightIcon: "🌧️" },
  55: { label: "Bruine forte", dayIcon: "🌧️", nightIcon: "🌧️" },
  56: { label: "Bruine verglaçante", dayIcon: "🌧️", nightIcon: "🌧️" },
  57: { label: "Bruine verglaçante", dayIcon: "🌧️", nightIcon: "🌧️" },
  61: { label: "Pluie légère", dayIcon: "🌦️", nightIcon: "🌧️" },
  63: { label: "Pluie modérée", dayIcon: "🌧️", nightIcon: "🌧️" },
  65: { label: "Pluie forte", dayIcon: "🌧️", nightIcon: "🌧️" },
  66: { label: "Pluie verglaçante", dayIcon: "🌧️", nightIcon: "🌧️" },
  67: { label: "Pluie verglaçante", dayIcon: "🌧️", nightIcon: "🌧️" },
  71: { label: "Neige légère", dayIcon: "🌨️", nightIcon: "🌨️" },
  73: { label: "Neige modérée", dayIcon: "🌨️", nightIcon: "🌨️" },
  75: { label: "Neige forte", dayIcon: "❄️", nightIcon: "❄️" },
  77: { label: "Grains de neige", dayIcon: "🌨️", nightIcon: "🌨️" },
  80: { label: "Averses légères", dayIcon: "🌦️", nightIcon: "🌧️" },
  81: { label: "Averses modérées", dayIcon: "🌧️", nightIcon: "🌧️" },
  82: { label: "Averses violentes", dayIcon: "⛈️", nightIcon: "⛈️" },
  85: { label: "Averses de neige", dayIcon: "🌨️", nightIcon: "🌨️" },
  86: { label: "Fortes averses de neige", dayIcon: "❄️", nightIcon: "❄️" },
  95: { label: "Orage", dayIcon: "⛈️", nightIcon: "⛈️" },
  96: { label: "Orage avec grêle", dayIcon: "⛈️", nightIcon: "⛈️" },
  99: { label: "Fort orage avec grêle", dayIcon: "⛈️", nightIcon: "⛈️" },
};

export function getWeatherDescription(code: number, isDay = true) {
  const weather = weatherDescriptions[code] ?? {
    label: "Conditions inconnues",
    dayIcon: "🌡️",
    nightIcon: "🌡️",
  };

  return {
    label: weather.label,
    icon: isDay ? weather.dayIcon : weather.nightIcon,
  };
}
