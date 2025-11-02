export interface RawTrain {
  time: string;
  station: string;
  delay: string;
  canceled: string;
  vehicle: string;
}

export interface LiveboardResponse {
  departures?: { departure: RawTrain[] | RawTrain };
  arrivals?: { arrival: RawTrain[] | RawTrain };
}

const BASE_URL = "https://api.irail.be";

/**
 * Formate une heure en HHmm pour iRail
 */
const formatTime = (d: Date): string =>
  `${d.getHours().toString().padStart(2, "0")}${d.getMinutes()
    .toString()
    .padStart(2, "0")}`;

/**
 * Appel générique à l'API iRail
 * @param station Nom de la gare
 * @param type "departure" ou "arrival"
 * @param time Heure optionnelle de référence
 */
export async function fetchLiveboard(
  station: string,
  type: "departure" | "arrival",
  time?: Date
): Promise<RawTrain[]> {
  const params = new URLSearchParams({
    station,
    arrdep: type,
    format: "json",
    lang: "fr",
  });

  if (time) params.append("time", formatTime(time));

  const res = await fetch(`${BASE_URL}/liveboard/?${params.toString()}`);
  if (!res.ok) throw new Error(`Erreur API iRail: ${res.status}`);

  const data: LiveboardResponse = await res.json();

  const list =
    type === "departure"
      ? data.departures?.departure
      : data.arrivals?.arrival;

  if (!list) return [];

  return Array.isArray(list) ? list : [list];
}

/**
 * Récupère les trains sur plusieurs heures (par défaut 2h)
 * iRail ne retourne que ~1h de données, donc on fait plusieurs appels espacés.
 */
export async function fetchTrainsWindow(
  station: string,
  type: "departure" | "arrival",
  hoursAhead = 2
): Promise<RawTrain[]> {
  const now = new Date();
  const results: RawTrain[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < hoursAhead; i++) {
    const offset = new Date(now.getTime() + i * 60 * 60 * 1000);
    const batch = await fetchLiveboard(station, type, offset);

    for (const t of batch) {
      const id = `${t.vehicle}-${t.time}`;
      if (!seen.has(id)) {
        seen.add(id);
        results.push(t);
      }
    }
  }

  // Tri chronologique
  results.sort((a, b) => Number(a.time) - Number(b.time));
  return results;
}
