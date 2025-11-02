import React from "react";
import "./Panel.css";

interface PanelProps {
  title?: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <div className="panel">
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="panel-content">{children}</div>
    </div>
  );
};

export default Panel;
