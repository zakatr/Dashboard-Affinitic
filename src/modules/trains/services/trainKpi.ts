import { meanBy } from "lodash";
import type { Train } from "./trainUtils";

export interface TrainKpis {
  averageDelayNextHour: number | null;
  cancelRateLastThreeHours: number | null;
}

export function computeKpis(
  trains: Train[],
  now: Date = new Date()
): TrainKpis {
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  const nextHourTrains = trains.filter(
    (t) => t.time > now && t.time <= nextHour && !t.canceled
  );
  const lastThreeHoursTrains = trains.filter(
    (t) => t.time < now && t.time >= threeHoursAgo
  );

  const averageDelayNextHour =
    nextHourTrains.length > 0 ? meanBy(nextHourTrains, "delay") : null;

  const cancelRateLastThreeHours =
    lastThreeHoursTrains.length > 0
      ? (lastThreeHoursTrains.filter((t) => t.canceled).length /
          lastThreeHoursTrains.length) *
        100
      : null;

  return { averageDelayNextHour, cancelRateLastThreeHours };
}
