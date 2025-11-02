import { create } from "zustand";
import { isEqual } from "lodash";
import {
  fetchTrainsForType,
  fetchTrainsWithHistory,
  mergeAndPrune,
  type Train,
} from "../services/trainUtils";
import { computeKpis } from "../services/trainKpi";

/* === TYPES === */
interface Filters {
  stations: string[];
  types: ("departure" | "arrival")[];
}

interface TrainState {
  trains: Train[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hasFetchedHistory: boolean;
  debugMode: boolean;

  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  setDebug: (value: boolean) => void;

  refreshAllTrains: (station?: string) => Promise<void>;

  averageDelayNextHour: number | null;
  cancelRateLastThreeHours: number | null;
}

/* === STORE === */
export const useTrainStore = create<TrainState>((set, get) => ({
  trains: [],
  loading: false,
  error: null,
  lastUpdated: null,
  hasFetchedHistory: false,
  debugMode: false,

  averageDelayNextHour: null,
  cancelRateLastThreeHours: null,

  filters: {
    stations: ["Bruxelles", "Brussels", "Charleroi-Central"],
    types: ["departure", "arrival"],
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setDebug: (value) => set({ debugMode: value }),

  /* === LOGIQUE PRINCIPALE === */
  refreshAllTrains: async (station = "Nivelles") => {
    const { hasFetchedHistory, debugMode } = get();

    if (!hasFetchedHistory) set({ loading: true, error: null });

    try {
      // Premier chargement : récupération élargie (-3h à +2h)
      // Ensuite : récupération standard (2h d’avance)
      const [departures, arrivals] = await Promise.all([
        hasFetchedHistory
          ? fetchTrainsForType(station, "departure")
          : fetchTrainsWithHistory(station, "departure"),
        hasFetchedHistory
          ? fetchTrainsForType(station, "arrival")
          : fetchTrainsWithHistory(station, "arrival"),
      ]);

      const oldTrains = get().trains;
      const newTrains = mergeAndPrune(oldTrains, [...departures, ...arrivals]);

      if (isEqual(newTrains, oldTrains)) {
        if (debugMode) console.log("Aucun changement → pas de mise à jour");
        if (!hasFetchedHistory) set({ loading: false });
        return;
      }

      if (debugMode)
        console.log(
          "Trains mis à jour :",
          newTrains.length,
          "éléments",
          newTrains
        );

      set({
        trains: newTrains,
        lastUpdated: new Date(),
        hasFetchedHistory: true,
        loading: false,
      });

      // Calcul KPI différé
      setTimeout(() => {
        const { averageDelayNextHour, cancelRateLastThreeHours } =
          computeKpis(newTrains);
        set({ averageDelayNextHour, cancelRateLastThreeHours });
      }, 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inconnue lors du fetch";
      console.error(message);
      set({ error: message, loading: false });
    }
  },
}));
