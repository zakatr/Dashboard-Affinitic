import React from "react";
import "./Banner.css";
import homeCover from "../../assets/home_cover.png";
import { Clock } from "@/components/ui/Clock/Clock";

const Banner: React.FC = () => {
  return (
    <section className="banner">
      <img src={homeCover} alt="banner" className="banner-image" />
      <div className="banner-clock">
        <Clock />
      </div>
    </section>
  );
};

export default Banner;
