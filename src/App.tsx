import { useEffect } from "react";
import "./App.css";

import Banner from "./layout/Banner/Banner";
import Panel from "./layout/Panel/Panel";
import TrainWidget from "./modules/trains/components/Widgets/TrainWidget";
import KPIWidget from "./modules/trains/components/Widgets/KPIWidget";
import { useTrainStore } from "./modules/trains/hooks/useTrainStore";

const App: React.FC = () => {
  const refresh = useTrainStore((s) => s.refreshAllTrains);
  const setFilters = useTrainStore((s) => s.setFilters);

  useEffect(() => {
    // Définir les filtres globaux (stations concernées et types)
    setFilters({
      stations: ["Bruxelles", "Brussels", "Charleroi-Central"],
      types: ["departure", "arrival"],
    });

    // Chargement initial
    refresh("Nivelles");

    // Rafraîchissement des données toutes les 30 secondes
    const interval = setInterval(() => {
      console.log("Rafraîchissement des données trains...");
      refresh("Nivelles");
    }, 30_000);

    return () => clearInterval(interval);
  }, [refresh, setFilters]);

  return (
    <div className="App">
      <Banner />
      <Panel title="Trains – Nivelles">
        <TrainWidget type="departure" title="Départs" />
        <TrainWidget type="arrival" title="Arrivées" />
        <KPIWidget />
      </Panel>
    </div>
  );
};

export default App;
