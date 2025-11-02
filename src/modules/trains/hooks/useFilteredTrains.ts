import type { Train } from "../services/trainUtils";
import { useTrainStore } from "./useTrainStore";
import { useMemo } from "react";

/**
 * Hook de filtrage automatique des trains selon
 * les filtres globaux définis dans le store Zustand.
 */
export function useFilteredTrains(type: "departure" | "arrival"): Train[] {
  const trains = useTrainStore((s) => s.trains);
  const filters = useTrainStore((s) => s.filters);

  const filtered = useMemo(() => {
    return trains.filter((t) => {
      if (t.type !== type) return false;

      // On applique le filtre global de stations s'il est défini
      if (filters?.stations?.length) {
        const normalizedStation = t.station.toLowerCase();
        return filters.stations.some((s) =>
          normalizedStation.includes(s.toLowerCase())
        );
      }

      return true;
    });
  }, [trains, type, filters]);

  return filtered;
}
