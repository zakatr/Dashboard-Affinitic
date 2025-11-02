import React from "react";
import "./KpiCard.css"; // le CSS doit être séparé

interface KpiCardProps {
  type?: "percent" | "basic";
  icon?: string;
  title: string;
  value: string | number;
  percent?: number;
  color?: string;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  type = "basic",
  icon,
  title,
  value,
  percent = 0,
  color = "#1877f2",
  subtitle = "",
}) => {
  const circleRadius = 36;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`kpi-card ${type === "basic" ? "basic" : ""}`}>
      {icon && (
        <div className="kpi-icon" style={{ background: `${color}20` }}>
          <img src={icon} alt={title} />
        </div>
      )}

      <div className="kpi-middle">
        <div className="kpi-left">
          <h3>{title}</h3>
          <h1>{value}</h1>
        </div>

        {type === "percent" && (
          <div className="kpi-progress">
            <svg>
              <circle cx="38" cy="38" r={circleRadius} />
              <circle
                className="progress"
                cx="38"
                cy="38"
                r={circleRadius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  stroke: color,
                }}
              />
            </svg>
            <div className="number">
              <p>{percent.toFixed(0)}%</p>
            </div>
          </div>
        )}
      </div>

      {subtitle && <small className="text-muted">{subtitle}</small>}
    </div>
  );
};

export default KpiCard;
