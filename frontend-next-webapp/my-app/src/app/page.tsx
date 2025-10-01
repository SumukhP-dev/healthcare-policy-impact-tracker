"use client";

import React, { useEffect } from "react";
import MapChart from "../../components/MapChart";
import LawSelectors from "../../components/LawSelectors";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import TimeLine from "../../components/TimeLine";
import DetailsWidget from "../../components/DetailsWidget";
import Header from "../../components/Header";

export default function App() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <Header />
      <div className="flex h-screen w-screen grid cols-5">
        <LawSelectors />
        <MapChart />
        <DetailsWidget />
        <TimeLine />
      </div>
    </>
  );
}
