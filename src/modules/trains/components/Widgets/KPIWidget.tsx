import React from "react";
import Widget from "@/layout/Widget/Widget";
import KpiCard from "@/components/ui/KpiCard/KpiCard";
import { useTrainStore } from "../../hooks/useTrainStore";
import delayIcon from "@/assets/delay.png";
import noTransportIcon from "@/assets/no-transport.png";

const KPIWidget: React.FC = () => {
  const averageDelay = useTrainStore((s) => s.averageDelayNextHour);
  const cancelRate = useTrainStore((s) => s.cancelRateLastThreeHours);
  const loading = useTrainStore((s) => s.loading);
  const formatDelay = (delay: number | null): string => {
    if (delay === null) return "–";
    if (delay < 1) {
      const seconds = Math.round(delay * 60);
      return `${seconds} s`;
    }
    return `${delay.toFixed(2)} min`;
  };

  return (
    <Widget title="Statistiques trains">
      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : (
        <div className="kpi-container">
          <KpiCard
            type="basic"
            icon={delayIcon}
            title="Retard moyen"
            value={formatDelay(averageDelay)}
            color="#ff9800"
            subtitle="Prochaine heure"
          />

          <KpiCard
            type="percent"
            icon={noTransportIcon}
            title="Annulations"
            value={cancelRate === null ? "–" : `${cancelRate.toFixed(1)} %`}
            percent={cancelRate ?? 0}
            color="#e91e63"
            subtitle="Trois dernières heures"
          />
        </div>
      )}
    </Widget>
  );
};

export default KPIWidget;
