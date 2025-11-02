import React from "react";
import "./TrainTable.css";
import type { Train } from "../../services/trainUtils";

interface TrainTableProps {
  trains: Train[];
  type: "departure" | "arrival";
  loading?: boolean;
  error?: string | null;
}

const TrainTable: React.FC<TrainTableProps> = ({
  trains,
  type,
  loading,
  error,
}) => {
  if (loading) {
    return <p className="train-status">Chargement des trains...</p>;
  }

  if (error) {
    return <p className="train-status error">{error}</p>;
  }

  const isDeparture = type === "departure";

  const renderTrainStatus = (train: Train): React.ReactNode => {
    if (train.canceled) {
      return "Supprimé";
    }
    if (train.delay > 0) {
      return <span className="delay">+{train.delay} min</span>;
    }
    return "À l'heure";
  };

  return (
    <div className="train-table-wrapper">
      <table className="train-table">
        <thead>
          <tr>
            <th>Heure</th>
            <th>{isDeparture ? "Destination" : "Provenance"}</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {trains.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty">
                Aucun train à afficher
              </td>
            </tr>
          ) : (
            trains.map((t) => (
              <tr key={t.id} className={t.canceled ? "canceled" : ""}>
                <td>
                  {t.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{t.station}</td>
                <td>{renderTrainStatus(t)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrainTable;
