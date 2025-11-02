import { useLiveDate } from "@/hooks/useLiveDate";
import "./Clock.css";

export const Clock = () => {
  const now = useLiveDate();

  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  const formattedDate = `${dayName} ${day} ${monthName} ${year}`;

  return (
    <div className="clock">
      <div className="time">
        {hour}:{minute}:{second}
      </div>
      <div className="date">{formattedDate}</div>
    </div>
  );
};
