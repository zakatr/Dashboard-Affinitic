import React from "react";
import "./Widget.css";

interface WidgetProps {
  title?: string;
  children: React.ReactNode;
  type?: "default" | "table" | "kpi" | "chart";
  highlight?: boolean;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  children,
  type = "default",
  highlight,
}) => {
  return (
    <div
      className={`widget widget-${type} ${highlight ? "widget-highlight" : ""}`}
    >
      <div className="widget-header">
        <h2>{title}</h2>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
};

export default Widget;
