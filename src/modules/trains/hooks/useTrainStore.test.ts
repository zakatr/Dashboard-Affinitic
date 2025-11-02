import { describe, it, expect, beforeEach } from "@jest/globals";
import { useTrainStore } from "./useTrainStore";
import type { Train } from "./useTrainStore";

function resetStore() {
  useTrainStore.setState({
    trains: [],
    loading: false,
    error: null,
    lastUpdated: null,
    hasFetchedHistory: false,
    averageDelayNextHour: null,
    cancelRateLastThreeHours: null,
  });
}

describe("useTrainStore – computeKPIs", () => {
  beforeEach(() => resetStore());

  it("calcule correctement les KPI à partir d’un temps fixe", () => {
    const refDate = new Date("2025-01-01T12:00:00Z");

    const trains: Train[] = [
      // Trains dans la prochaine heure
      {
        id: "T1",
        time: new Date(refDate.getTime() + 10 * 60 * 1000),
        station: "Nivelles",
        delay: 0,
        canceled: false,
        type: "departure",
      },
      {
        id: "T2",
        time: new Date(refDate.getTime() + 30 * 60 * 1000),
        station: "Nivelles",
        delay: 5,
        canceled: false,
        type: "arrival",
      },
      {
        id: "T3",
        time: new Date(refDate.getTime() + 55 * 60 * 1000),
        station: "Nivelles",
        delay: 10,
        canceled: false,
        type: "departure",
      },
      // Trains passés
      {
        id: "T4",
        time: new Date(refDate.getTime() - 60 * 60 * 1000),
        station: "Nivelles",
        delay: 0,
        canceled: true,
        type: "arrival",
      },
      {
        id: "T5",
        time: new Date(refDate.getTime() - 2 * 60 * 60 * 1000),
        station: "Nivelles",
        delay: 2,
        canceled: false,
        type: "departure",
      },
    ];

    useTrainStore.setState({ trains });
    useTrainStore.getState().computeKPIs(refDate);

    const { averageDelayNextHour, cancelRateLastThreeHours } =
      useTrainStore.getState();

    expect(averageDelayNextHour).toBeCloseTo(5, 1); // (0 + 5 + 10) / 3
    expect(cancelRateLastThreeHours).toBeCloseTo(50, 1); // 1 annulé sur 2
  });
});
