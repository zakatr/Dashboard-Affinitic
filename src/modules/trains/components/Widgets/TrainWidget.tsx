import React from "react";
import { useTrainStore } from "../../hooks/useTrainStore";
import { useFilteredTrains } from "../../hooks/useFilteredTrains";
import Widget from "@/layout/Widget/Widget";
import TrainTable from "../TrainTable/TrainTable";

interface TrainWidgetProps {
  type: "departure" | "arrival";
  title: string;
}

const TrainWidget: React.FC<TrainWidgetProps> = ({ type, title }) => {
  const loading = useTrainStore((s) => s.loading);
  const error = useTrainStore((s) => s.error);

  const trains = useFilteredTrains(type);

  return (
    <Widget title={title}>
      <TrainTable trains={trains} type={type} loading={loading} error={error} />
    </Widget>
  );
};

export default TrainWidget;
