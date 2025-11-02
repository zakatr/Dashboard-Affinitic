import { keyBy } from "lodash";
import { fetchLiveboard, fetchTrainsWindow, type RawTrain } from "./trainAPI";

export interface Train {
  id: string;
  time: Date;
  station: string;
  delay: number;
  canceled: boolean;
  type: "departure" | "arrival";
}

/* === FORMATTERS === */
export function formatRawTrains(
  raw: RawTrain[],
  type: "departure" | "arrival"
): Train[] {
  return raw.map((t) => {
    const isBus = /BUS/i.test(t.vehicle);
    return {
      id: `${t.vehicle}-${t.time}`,
      time: new Date(Number(t.time) * 1000),
      station: isBus ? `${t.station} (BUS)` : t.station,
      delay: Number(t.delay) / 60,
      canceled: t.canceled === "1",
      type,
    };
  });
}

/* === FETCH HELPERS === */
export async function fetchTrainsForType(
  station: string,
  type: "departure" | "arrival",
  hoursAhead = 2
): Promise<Train[]> {
  const raw = await fetchTrainsWindow(station, type, hoursAhead);
  return formatRawTrains(raw, type);
}

/**
 * Récupère un historique plus large (-3h à +2h) pour le premier chargement.
 */
export async function fetchTrainsWithHistory(
  station: string,
  type: "departure" | "arrival"
): Promise<Train[]> {
  const now = new Date();
  const promises: Promise<RawTrain[]>[] = [];

  for (let i = -3; i < 2; i++) {
    const offset = new Date(now.getTime() + i * 60 * 60 * 1000);
    promises.push(fetchLiveboard(station, type, offset));
  }

  const batches = await Promise.all(promises);
  const raw = batches.flat();
  const formatted = formatRawTrains(raw, type);

  // Déduplication
  const seen = new Set<string>();
  const unique = formatted.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  return unique.sort((a, b) => a.time.getTime() - b.time.getTime());
}

/* === MERGE & PRUNE === */
export function mergeAndPrune(existing: Train[], incoming: Train[]): Train[] {
  const now = Date.now();
  const min = now - 3 * 60 * 60 * 1000;
  const max = now + 2 * 60 * 60 * 1000;

  const merged = { ...keyBy(existing, "id"), ...keyBy(incoming, "id") };

  return Object.values(merged)
    .filter((t) => {
      const time = t.time.getTime();
      return time >= min && time <= max;
    })
    .sort((a, b) => a.time.getTime() - b.time.getTime());
}
