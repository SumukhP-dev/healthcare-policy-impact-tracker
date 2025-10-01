"use client";

import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import React, { memo, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { useSelector, useDispatch } from "react-redux";
import { setCounty } from "../src/app/store/features/countySlice";
import { setPercent } from "../src/app/store/features/percentSlice";
import { RootState } from "../src/app/store/store.tsx";

const getMortalityDataColor = (percentChange: number) => {
  let color = "#000000"; // Default color

  if (percentChange < 0) {
    if (percentChange <= -75) {
      color = "#0b6a3c";
    } else if (percentChange <= -50) {
      color = "#239b5d";
    } else if (percentChange <= -25) {
      color = "#34be76";
    } else if (percentChange < 0) {
      color = "#79d2a0";
    }
  } else if (percentChange > 0) {
    if (percentChange >= 75) {
      color = "#820000";
    } else if (percentChange >= 50) {
      color = "#B30000";
    } else if (percentChange >= 25) {
      color = "#E70000";
    } else if (percentChange > 0) {
      color = "#FF1818";
    }
  } else {
    color = "#d2d2d292";
  }

  return color;
};

const getInfantMortalityDataColor = (percentChange: number) => {
  let color = "#000000"; // Default color

  if (percentChange < 0) {
    if (percentChange <= -75) {
      color = "#0b6a3c";
    } else if (percentChange <= -50) {
      color = "#239b5d";
    } else if (percentChange <= -25) {
      color = "#34be76";
    } else if (percentChange < 0) {
      color = "#79d2a0";
    }
  } else if (percentChange > 0) {
    if (percentChange >= 75) {
      color = "#820000";
    } else if (percentChange >= 50) {
      color = "#B30000";
    } else if (percentChange >= 25) {
      color = "#E70000";
    } else if (percentChange > 0) {
      color = "#FF1818";
    }
  } else {
    color = "#d2d2d292";
  }

  return color;
};

const getCohsDataColor = (percentChange: number) => {
  let color = "#000000"; // Default color

  if (percentChange < 0) {
    if (percentChange <= -75) {
      color = "#820000";
    } else if (percentChange <= -50) {
      color = "#B30000";
    } else if (percentChange <= -25) {
      color = "#E70000";
    } else if (percentChange < 0) {
      color = "#FF1818";
    }
  } else if (percentChange > 0) {
    if (percentChange >= 75) {
      color = "#0b6a3c";
    } else if (percentChange >= 50) {
      color = "#239b5d";
    } else if (percentChange >= 25) {
      color = "#34be76";
    } else if (percentChange > 0) {
      color = "#79d2a0";
    }
  } else {
    color = "#d2d2d292";
  }

  return color;
};

const MapChart = () => {
  const [mortalityData] = useState(getMortalityDataDetails());
  const [infantMortalityData] = useState(getInfantMortalityDataDetails());
  const [cohsData] = useState(getCohsDataDetails());
  const statistics: string = useSelector(
    (state: RootState) => state.statistics.value
  );
  const year = useSelector((state: RootState) => state.year.value);

  useEffect(() => {
    console.log("Fetching mortality data: " + statistics);
  }, [statistics]);

  const fillColor = (
    geo,
    mortalityData,
    infantMortalityData,
    cohsData,
    statistics
  ) => {
    console.log("Geo properties name:", geo.properties.name);

    const countyName = geo.properties.name;
    let color = "#000000"; // Default color

    console.log("Selected year:", year);

    console.log("Statistics value:", statistics);

    if (statistics === "Mortality") {
      console.log("Mortality data:", mortalityData);

      let value = null;
      mortalityData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          console.log("Found county in mortality data:", countyName);

          d[countyName].find((item) => {
            if (item.Years == year) {
              value = item;
              console.log(
                "Mortality value for",
                countyName,
                "in year",
                year,
                ":",
                value
              );
            }
          });
        }
      });
      console.log("Mortality value for", countyName, ":", value);

      const percentChange = value ? value["% Change"] : null;
      if (percentChange !== null) {
        color = getMortalityDataColor(percentChange);
      }
    } else if (statistics === "InfantMortality") {
      console.log("InfantMortality data:", infantMortalityData);

      let value = null;
      infantMortalityData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          console.log("Found county in InfantMortality data:", countyName);

          d[countyName].find((item) => {
            if (item.Years == year) {
              value = item;
              console.log(
                "InfantMortality value for",
                countyName,
                "in year",
                year,
                ":",
                value
              );
            }
          });
        }
      });
      console.log("InfantMortality value for", countyName, ":", value);

      const percentChange = value ? value["% Change"] : null;
      if (percentChange !== null) {
        color = getInfantMortalityDataColor(percentChange);
      }
    } else if (statistics === "CountyOrganizedHealthSystem") {
      console.log("CountyOrganizedHealthSystem data:", cohsData);

      let value = null;
      cohsData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          console.log(
            "Found county in CountyOrganizedHealthSystem data:",
            countyName
          );

          d[countyName].find((item) => {
            if (item.Years == year) {
              value = item;
              console.log(
                "CountyOrganizedHealthSystem value for",
                countyName,
                "in year",
                year,
                ":",
                value
              );
            }
          });
        }
      });
      console.log(
        "CountyOrganizedHealthSystem value for",
        countyName,
        ":",
        value
      );

      const percentChange = value ? value["% Change"] : null;
      if (percentChange !== null) {
        color = getCohsDataColor(percentChange);
      }
    }

    if (color == "#000000") {
      dispatch(setPercent("null"));
    }

    return color;
  };

  const setCountyData = (geo, dispatch) => {
    const countyName: string = geo.properties.name;
    console.log("Setting county data for: ", countyName);

    dispatch(setCounty(countyName));

    console.log("County set to:", countyName);
  };

  const setPercentChange = (
    geo,
    dispatch,
    mortalityData,
    infantMortalityData,
    cohsData,
    statistics
  ) => {
    const countyName: string = geo.properties.name;
    console.log("Setting percent data for: ", countyName);

    if (statistics === "Mortality") {
      let countySelected: boolean = false;

      mortalityData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          countySelected = true;

          console.log("Found county in Mortality data:", countyName);

          d[countyName].find((item) => {
            if (item.Years == year) {
              console.log(
                "Mortality value for",
                countyName,
                "in year",
                year,
                ":",
                item
              );

              dispatch(
                setPercent(
                  item != null && item["% Change"] != null
                    ? item["% Change"]
                    : null
                )
              );
            }
          });
        }
      });

      if (!countySelected) {
        dispatch(setPercent(null));
      }
    } else if (statistics === "InfantMortality") {
      let countySelected: boolean = false;

      infantMortalityData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          countySelected = true;
          console.log("Found county in InfantMortality data:", countyName);

          d[countyName].find((item) => {
            if (item.Years == year) {
              console.log(
                "InfantMortality value for",
                countyName,
                "in year",
                year,
                ":",
                item
              );

              dispatch(
                setPercent(
                  item != null && item["% Change"] != null
                    ? item["% Change"]
                    : null
                )
              );
            }
          });
        }
      });

      if (!countySelected) {
        dispatch(setPercent(null));
      }
    } else if (statistics === "CountyOrganizedHealthSystem") {
      let countySelected: boolean = false;

      cohsData.find((d) => {
        if (d.hasOwnProperty(countyName)) {
          countySelected = true;
          console.log(
            "Found county in CountyOrganizedHealthSystem data:",
            countyName
          );

          d[countyName].find((item) => {
            if (item.Years == year) {
              console.log(
                "CountyOrganizedHealthSystem value for",
                countyName,
                "in year",
                year,
                ":",
                item
              );

              dispatch(
                setPercent(
                  item != null && item["% Change"] != null
                    ? item["% Change"]
                    : null
                )
              );
            }
          });
        }
      });

      if (!countySelected) {
        dispatch(setPercent(null));
      }
    }
    console.log("County set to:", countyName);
  };

  const dispatch = useDispatch();

  return (
    <div className="flex col-start-2 col-end-3 mt-5">
      <ComposableMap
        width={800}
        height={900}
        projectionConfig={{
          scale: 5500,
          center: [-117, 36.7783], // Centering on California
        }}
      >
        <ZoomableGroup>
          <Geographies geography="/features.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setCountyData(geo, dispatch);
                      setPercentChange(
                        geo,
                        dispatch,
                        mortalityData,
                        infantMortalityData,
                        cohsData,
                        statistics
                      );
                    }}
                    onMouseLeave={() => {}}
                    style={{
                      default: {
                        fill: fillColor(
                          geo,
                          mortalityData,
                          infantMortalityData,
                          cohsData,
                          statistics
                        ),
                        outline: "none",
                      },
                      hover: {
                        fill: "#0EA5E9",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

const getMortalityDataDetails = () => {
  const data = [
    {
      Mendocino: [
        { Years: 2018, predicted_mean: 1732.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 61.5863111024,
          "% Change": -96.4442083659,
        },
        {
          Years: 2020,
          predicted_mean: 48.0080801585,
          "% Change": -22.0474821447,
        },
        {
          Years: 2021,
          predicted_mean: 27.0740465092,
          "% Change": -43.6052297451,
        },
        {
          Years: 2022,
          predicted_mean: 37.8195621982,
          "% Change": 39.6893596432,
        },
        {
          Years: 2024,
          predicted_mean: 47.7502725834,
          "% Change": 26.258131528,
        },
        {
          Years: 2025,
          predicted_mean: 54.7151460767,
          "% Change": 14.5860392338,
        },
        { Years: 2026, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 54.7151460767, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 54.7151460767, "% Change": 0.0 },
      ],
    },
    {
      Tehama: [
        { Years: 2018, predicted_mean: 48.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 40.9626435891,
          "% Change": -14.6611591894,
        },
        {
          Years: 2020,
          predicted_mean: 35.2537719251,
          "% Change": -13.9367754711,
        },
        {
          Years: 2021,
          predicted_mean: 22.2528428606,
          "% Change": -36.8781221257,
        },
        {
          Years: 2024,
          predicted_mean: 35.7437228712,
          "% Change": 60.6254225364,
        },
        {
          Years: 2025,
          predicted_mean: 38.1375793813,
          "% Change": 6.6972780611,
        },
        { Years: 2026, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 38.1375793813, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 38.1375793813, "% Change": 0.0 },
      ],
    },
    {
      Amador: [
        { Years: 2018, predicted_mean: 478.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 27.8497533783,
          "% Change": -94.1736917619,
        },
        {
          Years: 2020,
          predicted_mean: 29.3952870672,
          "% Change": 5.5495417423,
        },
        {
          Years: 2021,
          predicted_mean: 9.3979762192,
          "% Change": -68.0289694137,
        },
        {
          Years: 2022,
          predicted_mean: 13.2820849197,
          "% Change": 41.3292033298,
        },
        {
          Years: 2024,
          predicted_mean: 29.8514134188,
          "% Change": 124.7494546175,
        },
        {
          Years: 2025,
          predicted_mean: 28.7498072168,
          "% Change": -3.6902983004,
        },
        { Years: 2026, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 28.7498072168, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 28.7498072168, "% Change": 0.0 },
      ],
    },
    {
      Marin: [
        { Years: 2018, predicted_mean: 12.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 277.9548733265,
          "% Change": 2216.2906110543,
        },
        {
          Years: 2020,
          predicted_mean: 245.228482995,
          "% Change": -11.7739940803,
        },
        {
          Years: 2021,
          predicted_mean: 127.9762478173,
          "% Change": -47.8134651186,
        },
        {
          Years: 2022,
          predicted_mean: 121.8629736892,
          "% Change": -4.7768818296,
        },
        {
          Years: 2024,
          predicted_mean: 260.1509403288,
          "% Change": 113.4782472914,
        },
        {
          Years: 2025,
          predicted_mean: 261.2716712805,
          "% Change": 0.4308002693,
        },
        { Years: 2026, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 261.2716712805, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 261.2716712805, "% Change": 0.0 },
      ],
    },
    {
      "San Bernardino": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 2664.4411746278, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 2588.8972261134,
          "% Change": -2.8352642661,
        },
        {
          Years: 2021,
          predicted_mean: 1533.7098001095,
          "% Change": -40.7581813353,
        },
        {
          Years: 2022,
          predicted_mean: 1914.6169184282,
          "% Change": 24.8356708871,
        },
        {
          Years: 2024,
          predicted_mean: 2626.7705106033,
          "% Change": 37.195617845,
        },
        {
          Years: 2025,
          predicted_mean: 2626.7797163077,
          "% Change": 0.0003504571,
        },
        { Years: 2026, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2626.7797163077, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2626.7797163077, "% Change": 0.0 },
      ],
    },
    {
      "San Joaquin": [
        { Years: 2018, predicted_mean: 1088.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 663.2472176299,
          "% Change": -39.0397777914,
        },
        {
          Years: 2020,
          predicted_mean: 793.4102622357,
          "% Change": 19.6251173237,
        },
        {
          Years: 2021,
          predicted_mean: 438.8905593112,
          "% Change": -44.6830246341,
        },
        {
          Years: 2024,
          predicted_mean: 789.9152396877,
          "% Change": 79.9800025153,
        },
        {
          Years: 2025,
          predicted_mean: 728.3307202708,
          "% Change": -7.7963452688,
        },
        { Years: 2026, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 728.3307202708, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 728.3307202708, "% Change": 0.0 },
      ],
    },
    {
      Humboldt: [
        { Years: 2018, predicted_mean: 22.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 154.7022433235,
          "% Change": 603.192015107,
        },
        {
          Years: 2020,
          predicted_mean: 127.9314427107,
          "% Change": -17.3047268338,
        },
        {
          Years: 2021,
          predicted_mean: 115.9559663122,
          "% Change": -9.3608546458,
        },
        {
          Years: 2022,
          predicted_mean: 93.6221481086,
          "% Change": -19.2606028943,
        },
        {
          Years: 2024,
          predicted_mean: 127.8988481749,
          "% Change": 36.6117427967,
        },
        {
          Years: 2025,
          predicted_mean: 141.4667130382,
          "% Change": 10.6082776013,
        },
        { Years: 2026, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 141.4667130382, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 141.4667130382, "% Change": 0.0 },
      ],
    },
    {
      Napa: [
        { Years: 2018, predicted_mean: 78.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 187.2577988704,
          "% Change": 140.0741011159,
        },
        {
          Years: 2020,
          predicted_mean: 139.4444855696,
          "% Change": -25.5334162792,
        },
        {
          Years: 2021,
          predicted_mean: 126.8321231672,
          "% Change": -9.0447193741,
        },
        {
          Years: 2022,
          predicted_mean: 105.0259910009,
          "% Change": -17.1929095104,
        },
        {
          Years: 2024,
          predicted_mean: 163.4807045863,
          "% Change": 55.6573787386,
        },
        {
          Years: 2025,
          predicted_mean: 163.513635932,
          "% Change": 0.0201438731,
        },
        { Years: 2026, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 163.513635932, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 163.513635932, "% Change": 0.0 },
      ],
    },
    {
      Monterey: [
        { Years: 2018, predicted_mean: 1354.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 528.7423436605,
          "% Change": -60.9496053427,
        },
        {
          Years: 2020,
          predicted_mean: 495.8417766928,
          "% Change": -6.2224195513,
        },
        {
          Years: 2021,
          predicted_mean: 226.5422171745,
          "% Change": -54.3115913537,
        },
        {
          Years: 2022,
          predicted_mean: 247.9944146217,
          "% Change": 9.4694038554,
        },
        {
          Years: 2024,
          predicted_mean: 510.3845878444,
          "% Change": 105.8048721069,
        },
        {
          Years: 2025,
          predicted_mean: 512.2617593291,
          "% Change": 0.3677954878,
        },
        { Years: 2026, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 512.2617593291, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 512.2617593291, "% Change": 0.0 },
      ],
    },
    {
      "Del Norte": [
        { Years: 2018, predicted_mean: 2.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 48.3395934097,
          "% Change": 2316.9796704858,
        },
        {
          Years: 2020,
          predicted_mean: 25.5440750427,
          "% Change": -47.1570337255,
        },
        {
          Years: 2021,
          predicted_mean: 28.2213580359,
          "% Change": 10.4810332286,
        },
        {
          Years: 2022,
          predicted_mean: 29.9766623635,
          "% Change": 6.2197727175,
        },
        {
          Years: 2024,
          predicted_mean: 25.6163822609,
          "% Change": -14.5455823257,
        },
        {
          Years: 2025,
          predicted_mean: 36.8791699006,
          "% Change": 43.9671282423,
        },
        { Years: 2026, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 36.8791699006, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 36.8791699006, "% Change": 0.0 },
      ],
    },
    {
      "Los Angeles": [
        { Years: 2018, predicted_mean: 152.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 13020.7610487822,
          "% Change": 8466.2901636725,
        },
        {
          Years: 2020,
          predicted_mean: 13004.666931036,
          "% Change": -0.1236035105,
        },
        {
          Years: 2021,
          predicted_mean: 6724.0845247092,
          "% Change": -48.2948347669,
        },
        {
          Years: 2022,
          predicted_mean: 8544.6499701766,
          "% Change": 27.0752909006,
        },
        {
          Years: 2024,
          predicted_mean: 13012.4279431161,
          "% Change": 52.2874311825,
        },
        {
          Years: 2025,
          predicted_mean: 13012.4282566014,
          "% Change": 2.4091e-6,
        },
        { Years: 2026, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 13012.4282566014, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 13012.4282566014, "% Change": 0.0 },
      ],
    },
    {
      Riverside: [
        { Years: 2018, predicted_mean: 150.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 2555.8134125358,
          "% Change": 1603.8756083572,
        },
        {
          Years: 2020,
          predicted_mean: 2606.1799155093,
          "% Change": 1.9706643187,
        },
        {
          Years: 2021,
          predicted_mean: 1373.3316771346,
          "% Change": -47.3048016002,
        },
        {
          Years: 2022,
          predicted_mean: 1766.5717294187,
          "% Change": 28.6340189214,
        },
        {
          Years: 2024,
          predicted_mean: 2606.0844440866,
          "% Change": 47.5221413706,
        },
        {
          Years: 2025,
          predicted_mean: 2580.710699469,
          "% Change": -0.9736347828,
        },
        { Years: 2026, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2580.710699469, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2580.710699469, "% Change": 0.0 },
      ],
    },
    {
      "San Mateo": [
        { Years: 2018, predicted_mean: 12.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 867.9958545086,
          "% Change": 7133.2987875717,
        },
        {
          Years: 2020,
          predicted_mean: 862.3178845876,
          "% Change": -0.6541471243,
        },
        {
          Years: 2021,
          predicted_mean: 514.0957419327,
          "% Change": -40.3821083708,
        },
        {
          Years: 2024,
          predicted_mean: 863.0823133276,
          "% Change": 67.883575554,
        },
        {
          Years: 2025,
          predicted_mean: 865.0123752266,
          "% Change": 0.2236243136,
        },
        { Years: 2026, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 865.0123752266, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 865.0123752266, "% Change": 0.0 },
      ],
    },
    {
      Madera: [
        { Years: 2018, predicted_mean: 978.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 23.1117192946,
          "% Change": -97.6368385179,
        },
        {
          Years: 2020,
          predicted_mean: 30.9387524126,
          "% Change": 33.8660790146,
        },
        {
          Years: 2021,
          predicted_mean: 25.0188147865,
          "% Change": -19.1343773244,
        },
        {
          Years: 2022,
          predicted_mean: 33.9349713249,
          "% Change": 35.6378054457,
        },
        {
          Years: 2024,
          predicted_mean: 29.783376106,
          "% Change": -12.233972969,
        },
        {
          Years: 2025,
          predicted_mean: 26.9595044634,
          "% Change": -9.4813685075,
        },
        { Years: 2026, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 26.9595044634, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 26.9595044634, "% Change": 0.0 },
      ],
    },
    {
      Calaveras: [
        { Years: 2018, predicted_mean: 116.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 5.2768898156,
          "% Change": -95.4509570555,
        },
        {
          Years: 2020,
          predicted_mean: 8.3823614951,
          "% Change": 58.8504173483,
        },
        {
          Years: 2021,
          predicted_mean: 6.1513814263,
          "% Change": -26.6151736609,
        },
        {
          Years: 2022,
          predicted_mean: 7.8318024264,
          "% Change": 27.3177825202,
        },
        {
          Years: 2024,
          predicted_mean: 7.1061164588,
          "% Change": -9.2658870591,
        },
        { Years: 2025, predicted_mean: 6.9457415664, "% Change": -2.256857081 },
        { Years: 2026, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6.9457415664, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 6.9457415664, "% Change": 0.0 },
      ],
    },
    {
      Tulare: [
        { Years: 2018, predicted_mean: 12.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 612.2247614779,
          "% Change": 5001.8730123158,
        },
        {
          Years: 2020,
          predicted_mean: 536.9174726879,
          "% Change": -12.3005950638,
        },
        {
          Years: 2021,
          predicted_mean: 328.7807868803,
          "% Change": -38.7651168746,
        },
        {
          Years: 2024,
          predicted_mean: 536.8470035233,
          "% Change": 63.2841774659,
        },
        {
          Years: 2025,
          predicted_mean: 574.3376647245,
          "% Change": 6.9834908186,
        },
        { Years: 2026, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 574.3376647245, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 574.3376647245, "% Change": 0.0 },
      ],
    },
    {
      Siskiyou: [
        { Years: 2018, predicted_mean: 6.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 23.3261745809,
          "% Change": 288.7695763485,
        },
        { Years: 2020, predicted_mean: 24.967804643, "% Change": 7.0377166061 },
        {
          Years: 2021,
          predicted_mean: 17.3504229393,
          "% Change": -30.5088165042,
        },
        {
          Years: 2024,
          predicted_mean: 24.3409379038,
          "% Change": 40.2901703834,
        },
        {
          Years: 2025,
          predicted_mean: 24.3028403237,
          "% Change": -0.1565164835,
        },
        { Years: 2026, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 24.3028403237, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 24.3028403237, "% Change": 0.0 },
      ],
    },
    {
      "San Francisco": [
        { Years: 2018, predicted_mean: 11670.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1499.9443614093,
          "% Change": -87.147006329,
        },
        {
          Years: 2020,
          predicted_mean: 1403.5187983892,
          "% Change": -6.4286093205,
        },
        {
          Years: 2021,
          predicted_mean: 744.9293161279,
          "% Change": -46.9241653918,
        },
        {
          Years: 2024,
          predicted_mean: 1451.4287983506,
          "% Change": 94.8411435725,
        },
        {
          Years: 2025,
          predicted_mean: 1451.7240582404,
          "% Change": 0.0203427058,
        },
        { Years: 2026, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1451.7240582404, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1451.7240582404, "% Change": 0.0 },
      ],
    },
    {
      Sonoma: [
        { Years: 2018, predicted_mean: 20.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 576.8541248337,
          "% Change": 2784.2706241685,
        },
        {
          Years: 2020,
          predicted_mean: 606.3270097626,
          "% Change": 5.109244029,
        },
        {
          Years: 2021,
          predicted_mean: 289.2296972397,
          "% Change": -52.298068108,
        },
        {
          Years: 2024,
          predicted_mean: 593.134937074,
          "% Change": 105.0740095968,
        },
        {
          Years: 2025,
          predicted_mean: 591.8244519178,
          "% Change": -0.2209421624,
        },
        { Years: 2026, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 591.8244519178, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 591.8244519178, "% Change": 0.0 },
      ],
    },
    {
      Merced: [
        { Years: 2018, predicted_mean: 192.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 92.1413101733,
          "% Change": -52.0097342848,
        },
        {
          Years: 2020,
          predicted_mean: 138.3676170104,
          "% Change": 50.1689272165,
        },
        {
          Years: 2021,
          predicted_mean: 49.0587080915,
          "% Change": -64.5446607006,
        },
        {
          Years: 2022,
          predicted_mean: 91.4931578582,
          "% Change": 86.4972833926,
        },
        {
          Years: 2024,
          predicted_mean: 115.0764399587,
          "% Change": 25.7760062639,
        },
        {
          Years: 2025,
          predicted_mean: 115.0505566038,
          "% Change": -0.0224923147,
        },
        { Years: 2026, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 115.0505566038, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 115.0505566038, "% Change": 0.0 },
      ],
    },
    {
      Butte: [
        { Years: 2018, predicted_mean: 2.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 471.2079630749,
          "% Change": 23460.3981537452,
        },
        {
          Years: 2020,
          predicted_mean: 511.8454091107,
          "% Change": 8.6241000196,
        },
        {
          Years: 2021,
          predicted_mean: 246.1563785538,
          "% Change": -51.9080616584,
        },
        {
          Years: 2022,
          predicted_mean: 304.5363125416,
          "% Change": 23.7166041891,
        },
        {
          Years: 2024,
          predicted_mean: 511.3208629871,
          "% Change": 67.9014429247,
        },
        {
          Years: 2025,
          predicted_mean: 491.6422803354,
          "% Change": -3.8485780801,
        },
        { Years: 2026, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 491.6422803354, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 491.6422803354, "% Change": 0.0 },
      ],
    },
    {
      Lassen: [
        { Years: 2018, predicted_mean: 66.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 14.5553105759,
          "% Change": -77.9464991274,
        },
        {
          Years: 2020,
          predicted_mean: 8.1847102122,
          "% Change": -43.7682200631,
        },
        {
          Years: 2021,
          predicted_mean: 13.1443620384,
          "% Change": 60.5965476807,
        },
        {
          Years: 2022,
          predicted_mean: 11.7813068142,
          "% Change": -10.369884976,
        },
        {
          Years: 2024,
          predicted_mean: 11.2690501752,
          "% Change": -4.3480459939,
        },
        {
          Years: 2025,
          predicted_mean: 11.2692101417,
          "% Change": 0.0014195201,
        },
        { Years: 2026, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 11.2692101417, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 11.2692101417, "% Change": 0.0 },
      ],
    },
    {
      "Santa Clara": [
        { Years: 2018, predicted_mean: 102.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 2156.3352684851,
          "% Change": 2014.0541847893,
        },
        {
          Years: 2020,
          predicted_mean: 1900.3587680901,
          "% Change": -11.8709044988,
        },
        {
          Years: 2021,
          predicted_mean: 1159.254834224,
          "% Change": -38.9981063739,
        },
        {
          Years: 2024,
          predicted_mean: 1901.5340037002,
          "% Change": 64.0307159015,
        },
        {
          Years: 2025,
          predicted_mean: 2028.7013844932,
          "% Change": 6.687620655,
        },
        { Years: 2026, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2028.7013844932, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2028.7013844932, "% Change": 0.0 },
      ],
    },
    {
      Nevada: [
        { Years: 2018, predicted_mean: 4.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 53.6518932346,
          "% Change": 1241.297330865,
        },
        {
          Years: 2020,
          predicted_mean: 58.9308666234,
          "% Change": 9.8393049536,
        },
        {
          Years: 2021,
          predicted_mean: 28.6034518889,
          "% Change": -51.4626993835,
        },
        {
          Years: 2022,
          predicted_mean: 39.4844388678,
          "% Change": 38.0408176651,
        },
        {
          Years: 2024,
          predicted_mean: 55.9751728946,
          "% Change": 41.7651472315,
        },
        {
          Years: 2025,
          predicted_mean: 55.9726479979,
          "% Change": -0.0045107438,
        },
        { Years: 2026, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 55.9726479979, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 55.9726479979, "% Change": 0.0 },
      ],
    },
    {
      Trinity: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 4.2413650644, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 3.809375029,
          "% Change": -10.1851651253,
        },
        {
          Years: 2021,
          predicted_mean: 2.0651536719,
          "% Change": -45.7875988534,
        },
        {
          Years: 2024,
          predicted_mean: 4.0461384466,
          "% Change": 95.9243276517,
        },
        { Years: 2025, predicted_mean: 4.0502501706, "% Change": 0.1016209409 },
        { Years: 2026, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 4.0502501706, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 4.0502501706, "% Change": 0.0 },
      ],
    },
    {
      Colusa: [
        { Years: 2018, predicted_mean: 402.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 8.0005844299,
          "% Change": -98.0098048682,
        },
        {
          Years: 2020,
          predicted_mean: 7.9960627174,
          "% Change": -0.0565172773,
        },
        {
          Years: 2021,
          predicted_mean: 6.000268722,
          "% Change": -24.9597091212,
        },
        { Years: 2022, predicted_mean: 6.0034836769, "% Change": 0.053580182 },
        {
          Years: 2024,
          predicted_mean: 7.6996518887,
          "% Change": 28.2530661042,
        },
        { Years: 2025, predicted_mean: 7.7047682538, "% Change": 0.0664493037 },
        { Years: 2026, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 7.7047682538, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 7.7047682538, "% Change": 0.0 },
      ],
    },
    {
      "San Luis Obispo": [
        { Years: 2018, predicted_mean: 198.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 279.8076455659,
          "% Change": 41.3169927101,
        },
        {
          Years: 2020,
          predicted_mean: 276.4724014731,
          "% Change": -1.1919774694,
        },
        {
          Years: 2021,
          predicted_mean: 151.289285511,
          "% Change": -45.2787024293,
        },
        {
          Years: 2024,
          predicted_mean: 277.8256243296,
          "% Change": 83.6386650853,
        },
        { Years: 2025, predicted_mean: 277.8256456911, "% Change": 7.6888e-6 },
        { Years: 2026, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 277.8256456911, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 277.8256456911, "% Change": 0.0 },
      ],
    },
    {
      Lake: [
        { Years: 2018, predicted_mean: 68.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 21.6834935323,
          "% Change": -68.1125095113,
        },
        {
          Years: 2020,
          predicted_mean: 18.7546181593,
          "% Change": -13.5073961611,
        },
        {
          Years: 2021,
          predicted_mean: 10.8996570731,
          "% Change": -41.8828099804,
        },
        {
          Years: 2022,
          predicted_mean: 12.5083732526,
          "% Change": 14.7593283782,
        },
        {
          Years: 2024,
          predicted_mean: 19.6299672772,
          "% Change": 56.9346139644,
        },
        {
          Years: 2025,
          predicted_mean: 20.1708417889,
          "% Change": 2.7553510609,
        },
        { Years: 2026, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 20.1708417889, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 20.1708417889, "% Change": 0.0 },
      ],
    },
    {
      Imperial: [
        { Years: 2018, predicted_mean: 3562.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 127.4080330361,
          "% Change": -96.4231321438,
        },
        {
          Years: 2020,
          predicted_mean: 170.095329414,
          "% Change": 33.5043994956,
        },
        {
          Years: 2021,
          predicted_mean: 84.4957695396,
          "% Change": -50.3244622702,
        },
        {
          Years: 2022,
          predicted_mean: 114.5214179854,
          "% Change": 35.535090821,
        },
        {
          Years: 2024,
          predicted_mean: 170.0538559246,
          "% Change": 48.4908752582,
        },
        {
          Years: 2025,
          predicted_mean: 148.7841636511,
          "% Change": -12.5076212814,
        },
        { Years: 2026, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 148.7841636511, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 148.7841636511, "% Change": 0.0 },
      ],
    },
    {
      "Santa Barbara": [
        { Years: 2018, predicted_mean: 520.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 638.4510689448,
          "% Change": 22.7790517201,
        },
        {
          Years: 2020,
          predicted_mean: 569.8812581246,
          "% Change": -10.7400260029,
        },
        {
          Years: 2021,
          predicted_mean: 279.519054863,
          "% Change": -50.951351553,
        },
        {
          Years: 2024,
          predicted_mean: 597.2705667184,
          "% Change": 113.6779429979,
        },
        {
          Years: 2025,
          predicted_mean: 604.5501991729,
          "% Change": 1.2188165398,
        },
        { Years: 2026, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 604.5501991729, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 604.5501991729, "% Change": 0.0 },
      ],
    },
    {
      "San Diego": [
        { Years: 2018, predicted_mean: 2.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 4029.3842970841,
          "% Change": 201369.2148542074,
        },
        {
          Years: 2020,
          predicted_mean: 3873.5774563894,
          "% Change": -3.866765471,
        },
        {
          Years: 2021,
          predicted_mean: 1915.1808003915,
          "% Change": -50.5578287267,
        },
        {
          Years: 2022,
          predicted_mean: 1977.0853889241,
          "% Change": 3.2323104179,
        },
        {
          Years: 2024,
          predicted_mean: 3945.6348099703,
          "% Change": 99.5682549714,
        },
        {
          Years: 2025,
          predicted_mean: 3951.4227722389,
          "% Change": 0.1466928022,
        },
        { Years: 2026, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 3951.4227722389, "% Change": -0.0 },
        { Years: 2030, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 3951.4227722389, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 3951.4227722389, "% Change": 0.0 },
      ],
    },
    {
      Plumas: [
        { Years: 2018, predicted_mean: 2464.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 3.6997837261,
          "% Change": -99.8498464397,
        },
        {
          Years: 2020,
          predicted_mean: 1.3112839788,
          "% Change": -64.5578207827,
        },
        {
          Years: 2021,
          predicted_mean: 5.9390358892,
          "% Change": 352.9175971779,
        },
        {
          Years: 2022,
          predicted_mean: 3.1213886018,
          "% Change": -47.4428398811,
        },
        {
          Years: 2024,
          predicted_mean: 1.8675917131,
          "% Change": -40.1679203909,
        },
        { Years: 2025, predicted_mean: 1.8681439013, "% Change": 0.0295668586 },
        { Years: 2026, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1.8681439013, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1.8681439013, "% Change": 0.0 },
      ],
    },
    {
      Kings: [
        { Years: 2018, predicted_mean: 2596.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 124.6123028283,
          "% Change": -95.1998342516,
        },
        {
          Years: 2020,
          predicted_mean: 135.6640079383,
          "% Change": 8.8688715794,
        },
        {
          Years: 2021,
          predicted_mean: 67.6877020298,
          "% Change": -50.1063671504,
        },
        {
          Years: 2022,
          predicted_mean: 78.5355253469,
          "% Change": 16.0262839362,
        },
        {
          Years: 2024,
          predicted_mean: 130.3921320008,
          "% Change": 66.0294897434,
        },
        {
          Years: 2025,
          predicted_mean: 130.3920548306,
          "% Change": -5.91831e-5,
        },
        { Years: 2026, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 130.3920548306, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 130.3920548306, "% Change": 0.0 },
      ],
    },
    {
      Mariposa: [
        { Years: 2018, predicted_mean: 28.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1.8782792159,
          "% Change": -93.2918599433,
        },
        { Years: 2020, predicted_mean: 2.064210121, "% Change": 9.8990024237 },
        {
          Years: 2021,
          predicted_mean: 1.0252607471,
          "% Change": -50.3315705738,
        },
        {
          Years: 2022,
          predicted_mean: 0.9717915914,
          "% Change": -5.2151763219,
        },
        {
          Years: 2024,
          predicted_mean: 2.1360752528,
          "% Change": 119.8079579653,
        },
        {
          Years: 2025,
          predicted_mean: 2.1360443011,
          "% Change": -0.0014489963,
        },
        { Years: 2026, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2.1360443011, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2.1360443011, "% Change": 0.0 },
      ],
    },
    {
      Glenn: [
        { Years: 2018, predicted_mean: 2162.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1.1144236974,
          "% Change": -99.948454038,
        },
        {
          Years: 2020,
          predicted_mean: 0.5931311684,
          "% Change": -46.7768704337,
        },
        {
          Years: 2021,
          predicted_mean: 1.373364834,
          "% Change": 131.5448769413,
        },
        {
          Years: 2022,
          predicted_mean: 0.6194106126,
          "% Change": -54.8983200008,
        },
        {
          Years: 2024,
          predicted_mean: 0.6104483514,
          "% Change": -1.4469014671,
        },
        {
          Years: 2025,
          predicted_mean: 1.0402681821,
          "% Change": 70.4105154397,
        },
        { Years: 2026, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1.0402681821, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1.0402681821, "% Change": 0.0 },
      ],
    },
    {
      "El Dorado": [
        { Years: 2018, predicted_mean: 3870.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 63.4147167454,
          "% Change": -98.3613768283,
        },
        {
          Years: 2020,
          predicted_mean: 63.5059180303,
          "% Change": 0.1438172234,
        },
        {
          Years: 2021,
          predicted_mean: 39.7316207115,
          "% Change": -37.4363493296,
        },
        {
          Years: 2022,
          predicted_mean: 49.0589837073,
          "% Change": 23.4759187487,
        },
        {
          Years: 2024,
          predicted_mean: 63.896739024,
          "% Change": 30.2447262367,
        },
        {
          Years: 2025,
          predicted_mean: 63.8959527213,
          "% Change": -0.0012305835,
        },
        { Years: 2026, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 63.8959527213, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 63.8959527213, "% Change": 0.0 },
      ],
    },
    {
      "Santa Cruz": [
        { Years: 2018, predicted_mean: 1682.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 216.5430514035,
          "% Change": -87.1258590129,
        },
        {
          Years: 2020,
          predicted_mean: 178.2432616978,
          "% Change": -17.6869169699,
        },
        {
          Years: 2021,
          predicted_mean: 110.8247986171,
          "% Change": -37.8238495181,
        },
        {
          Years: 2024,
          predicted_mean: 191.8150521768,
          "% Change": 73.0795404733,
        },
        {
          Years: 2025,
          predicted_mean: 197.454164532,
          "% Change": 2.9398695729,
        },
        { Years: 2026, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 197.454164532, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 197.454164532, "% Change": 0.0 },
      ],
    },
    {
      "Contra Costa": [
        { Years: 2018, predicted_mean: 752.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1117.8857117415,
          "% Change": 48.6550148592,
        },
        {
          Years: 2020,
          predicted_mean: 1165.8407636822,
          "% Change": 4.2897991661,
        },
        {
          Years: 2021,
          predicted_mean: 672.200063605,
          "% Change": -42.3420346461,
        },
        {
          Years: 2022,
          predicted_mean: 784.9976441349,
          "% Change": 16.7803585029,
        },
        {
          Years: 2024,
          predicted_mean: 1141.7723455388,
          "% Change": 45.4491429458,
        },
        {
          Years: 2025,
          predicted_mean: 1141.7564770275,
          "% Change": -0.001389814,
        },
        { Years: 2026, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1141.7564770275, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1141.7564770275, "% Change": 0.0 },
      ],
    },
    {
      "San Benito": [
        { Years: 2018, predicted_mean: 246.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 18.6720021001,
          "% Change": -92.4097552439,
        },
        {
          Years: 2020,
          predicted_mean: 18.170954633,
          "% Change": -2.6834158671,
        },
        {
          Years: 2021,
          predicted_mean: 12.5831998001,
          "% Change": -30.7510251704,
        },
        {
          Years: 2022,
          predicted_mean: 14.6719081771,
          "% Change": 16.5991831182,
        },
        {
          Years: 2024,
          predicted_mean: 17.7576572433,
          "% Change": 21.0316819666,
        },
        { Years: 2025, predicted_mean: 17.865559213, "% Change": 0.6076362901 },
        { Years: 2026, predicted_mean: 17.8655594613, "% Change": 1.39e-6 },
        { Years: 2027, predicted_mean: 17.8655589646, "% Change": -2.78e-6 },
        { Years: 2028, predicted_mean: 17.865559213, "% Change": 1.39e-6 },
        { Years: 2029, predicted_mean: 17.865559213, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 17.865559213, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 17.865559213, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 17.865559213, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 17.865559213, "% Change": 0.0 },
      ],
    },
    {
      Stanislaus: [
        { Years: 2018, predicted_mean: 828.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 973.4436261675,
          "% Change": 17.5656553342,
        },
        {
          Years: 2020,
          predicted_mean: 1084.2017980535,
          "% Change": 11.3779749447,
        },
        {
          Years: 2021,
          predicted_mean: 633.9795256122,
          "% Change": -41.525689521,
        },
        {
          Years: 2024,
          predicted_mean: 1028.9282500733,
          "% Change": 62.2967633032,
        },
        {
          Years: 2025,
          predicted_mean: 1028.9269740872,
          "% Change": -0.0001240112,
        },
        { Years: 2026, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1028.9269740872, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1028.9269740872, "% Change": 0.0 },
      ],
    },
    {
      Orange: [
        { Years: 2018, predicted_mean: 560.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 3751.1780928251,
          "% Change": 569.8532308616,
        },
        {
          Years: 2020,
          predicted_mean: 3517.5319044601,
          "% Change": -6.2286082554,
        },
        {
          Years: 2021,
          predicted_mean: 1949.1948244031,
          "% Change": -44.5862929649,
        },
        {
          Years: 2022,
          predicted_mean: 2231.8726016309,
          "% Change": 14.5022844145,
        },
        {
          Years: 2024,
          predicted_mean: 3527.3464897819,
          "% Change": 58.0442578669,
        },
        {
          Years: 2025,
          predicted_mean: 3634.2265035056,
          "% Change": 3.0300401175,
        },
        { Years: 2026, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 3634.2265035056, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 3634.2265035056, "% Change": 0.0 },
      ],
    },
    {
      Inyo: [
        { Years: 2018, predicted_mean: 2012.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 9.9880821366,
          "% Change": -99.5035744465,
        },
        {
          Years: 2020,
          predicted_mean: 6.9397408087,
          "% Change": -30.5197863437,
        },
        {
          Years: 2021,
          predicted_mean: 6.014379528,
          "% Change": -13.3342340325,
        },
        {
          Years: 2022,
          predicted_mean: 3.4807398228,
          "% Change": -42.1263688707,
        },
        {
          Years: 2024,
          predicted_mean: 7.8992562167,
          "% Change": 126.9418749725,
        },
        { Years: 2025, predicted_mean: 8.690992923, "% Change": 10.0229272804 },
        { Years: 2026, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 8.690992923, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 8.690992923, "% Change": 0.0 },
      ],
    },
    {
      Yuba: [
        { Years: 2018, predicted_mean: 164.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 233.3501045747,
          "% Change": 42.2866491309,
        },
        {
          Years: 2020,
          predicted_mean: 186.4883917516,
          "% Change": -20.0821477704,
        },
        {
          Years: 2021,
          predicted_mean: 117.8370632698,
          "% Change": -36.8126551133,
        },
        {
          Years: 2024,
          predicted_mean: 210.1954081417,
          "% Change": 78.3780096933,
        },
        {
          Years: 2025,
          predicted_mean: 210.1956445081,
          "% Change": 0.0001124508,
        },
        { Years: 2026, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 210.1956445081, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 210.1956445081, "% Change": 0.0 },
      ],
    },
    {
      Tuolumne: [
        { Years: 2018, predicted_mean: 528.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 71.5395534981,
          "% Change": -86.4508421405,
        },
        {
          Years: 2020,
          predicted_mean: 86.5316573875,
          "% Change": 20.9563844843,
        },
        {
          Years: 2021,
          predicted_mean: 41.5429921377,
          "% Change": -51.9909898967,
        },
        {
          Years: 2024,
          predicted_mean: 86.4861997244,
          "% Change": 108.1848111414,
        },
        {
          Years: 2025,
          predicted_mean: 79.1553721051,
          "% Change": -8.4762975395,
        },
        { Years: 2026, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 79.1553721051, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 79.1553721051, "% Change": 0.0 },
      ],
    },
    {
      Placer: [
        { Years: 2018, predicted_mean: 28.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 592.7750779267,
          "% Change": 2017.0538497384,
        },
        {
          Years: 2020,
          predicted_mean: 627.1993413097,
          "% Change": 5.8073061208,
        },
        {
          Years: 2021,
          predicted_mean: 329.4761031019,
          "% Change": -47.4686783928,
        },
        {
          Years: 2022,
          predicted_mean: 446.2702100398,
          "% Change": 35.448430353,
        },
        {
          Years: 2024,
          predicted_mean: 610.3895858021,
          "% Change": 36.7757856272,
        },
        {
          Years: 2025,
          predicted_mean: 610.3848494536,
          "% Change": -0.000775955,
        },
        { Years: 2026, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 610.3848494536, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 610.3848494536, "% Change": 0.0 },
      ],
    },
    {
      Fresno: [
        { Years: 2018, predicted_mean: 576.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1596.419873702,
          "% Change": 177.1562280733,
        },
        {
          Years: 2020,
          predicted_mean: 1400.7712791727,
          "% Change": -12.2554597166,
        },
        {
          Years: 2021,
          predicted_mean: 845.379230227,
          "% Change": -39.6490174523,
        },
        {
          Years: 2022,
          predicted_mean: 979.4697711352,
          "% Change": 15.8615844953,
        },
        {
          Years: 2024,
          predicted_mean: 1400.7983836387,
          "% Change": 43.0159893567,
        },
        {
          Years: 2025,
          predicted_mean: 1498.4844640008,
          "% Change": 6.9736003056,
        },
        { Years: 2026, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1498.4844640008, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1498.4844640008, "% Change": 0.0 },
      ],
    },
    {
      Kern: [
        { Years: 2018, predicted_mean: 508.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1026.1124974923,
          "% Change": 101.9906491127,
        },
        {
          Years: 2020,
          predicted_mean: 1034.5631506551,
          "% Change": 0.8235601051,
        },
        {
          Years: 2021,
          predicted_mean: 536.7764251545,
          "% Change": -48.1156442877,
        },
        {
          Years: 2022,
          predicted_mean: 669.4952028524,
          "% Change": 24.7251502634,
        },
        {
          Years: 2024,
          predicted_mean: 1033.034224251,
          "% Change": 54.3004669563,
        },
        {
          Years: 2025,
          predicted_mean: 1030.326815866,
          "% Change": -0.2620831258,
        },
        { Years: 2026, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1030.326815866, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1030.326815866, "% Change": 0.0 },
      ],
    },
    {
      Solano: [
        { Years: 2018, predicted_mean: 876.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 570.2442828005,
          "% Change": -34.9036206849,
        },
        {
          Years: 2020,
          predicted_mean: 602.3007265272,
          "% Change": 5.6215282982,
        },
        {
          Years: 2021,
          predicted_mean: 319.3271614909,
          "% Change": -46.9821058772,
        },
        {
          Years: 2024,
          predicted_mean: 587.5784140851,
          "% Change": 84.0051473673,
        },
        {
          Years: 2025,
          predicted_mean: 586.5779374389,
          "% Change": -0.170271171,
        },
        { Years: 2026, predicted_mean: 586.577941662, "% Change": 7.2e-7 },
        { Years: 2027, predicted_mean: 586.5779395505, "% Change": -3.6e-7 },
        { Years: 2028, predicted_mean: 586.5779395505, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 586.5779395505, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 586.5779395505, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 586.5779395505, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 586.5779395505, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 586.5779395505, "% Change": 0.0 },
      ],
    },
    {
      Ventura: [
        { Years: 2018, predicted_mean: 20.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 903.2360866159,
          "% Change": 4416.1804330794,
        },
        {
          Years: 2020,
          predicted_mean: 767.2250911334,
          "% Change": -15.0581888277,
        },
        {
          Years: 2021,
          predicted_mean: 473.7548848456,
          "% Change": -38.2508614068,
        },
        {
          Years: 2024,
          predicted_mean: 833.6680082727,
          "% Change": 75.9703245159,
        },
        {
          Years: 2025,
          predicted_mean: 834.9838880212,
          "% Change": 0.1578421788,
        },
        { Years: 2026, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 834.9838880212, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 834.9838880212, "% Change": 0.0 },
      ],
    },
    {
      Modoc: [
        { Years: 2018, predicted_mean: 2.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 2.9026221076,
          "% Change": 45.1311053825,
        },
        {
          Years: 2020,
          predicted_mean: 2.4552215177,
          "% Change": -15.4136698937,
        },
        {
          Years: 2021,
          predicted_mean: 3.1991876148,
          "% Change": 30.3013838764,
        },
        {
          Years: 2022,
          predicted_mean: 3.1241758056,
          "% Change": -2.3447142918,
        },
        {
          Years: 2024,
          predicted_mean: 2.7385926825,
          "% Change": -12.3419150223,
        },
        { Years: 2025, predicted_mean: 2.7579095361, "% Change": 0.7053569418 },
        { Years: 2026, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2.7579095361, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2.7579095361, "% Change": 0.0 },
      ],
    },
    {
      Mono: [
        { Years: 2018, predicted_mean: 554.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 0.8147506026,
          "% Change": -99.8529331042,
        },
        {
          Years: 2020,
          predicted_mean: 1.6676242315,
          "% Change": 104.679103784,
        },
        {
          Years: 2021,
          predicted_mean: 1.1717640967,
          "% Change": -29.7345244454,
        },
        {
          Years: 2022,
          predicted_mean: 1.6041174379,
          "% Change": 36.8976436817,
        },
        {
          Years: 2024,
          predicted_mean: 1.4288823526,
          "% Change": -10.9240808142,
        },
        {
          Years: 2025,
          predicted_mean: 1.3456965371,
          "% Change": -5.8217400047,
        },
        { Years: 2026, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1.3456965371, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1.3456965371, "% Change": 0.0 },
      ],
    },
    {
      Yolo: [
        { Years: 2018, predicted_mean: 46.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 54.5395815285,
          "% Change": 18.5643076706,
        },
        {
          Years: 2020,
          predicted_mean: 64.5164691234,
          "% Change": 18.2929302266,
        },
        {
          Years: 2021,
          predicted_mean: 31.1745517373,
          "% Change": -51.6796995235,
        },
        {
          Years: 2024,
          predicted_mean: 64.0497421863,
          "% Change": 105.4552146448,
        },
        {
          Years: 2025,
          predicted_mean: 59.6165186174,
          "% Change": -6.9215322617,
        },
        { Years: 2026, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 59.6165186174, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 59.6165186174, "% Change": 0.0 },
      ],
    },
    {
      Shasta: [
        { Years: 2018, predicted_mean: 774.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 506.9571439508,
          "% Change": -34.5016609883,
        },
        {
          Years: 2020,
          predicted_mean: 594.6116090289,
          "% Change": 17.2903106553,
        },
        {
          Years: 2021,
          predicted_mean: 339.5913782806,
          "% Change": -42.8885388169,
        },
        {
          Years: 2024,
          predicted_mean: 594.6064859379,
          "% Change": 75.094694379,
        },
        {
          Years: 2025,
          predicted_mean: 550.8801889154,
          "% Change": -7.353821066,
        },
        { Years: 2026, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 550.8801889154, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 550.8801889154, "% Change": 0.0 },
      ],
    },
    {
      Alameda: [
        { Years: 2018, predicted_mean: 46.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1991.9886452912,
          "% Change": 4230.4100984592,
        },
        {
          Years: 2020,
          predicted_mean: 1747.3596608743,
          "% Change": -12.2806415084,
        },
        {
          Years: 2021,
          predicted_mean: 991.2613159086,
          "% Change": -43.2709053491,
        },
        {
          Years: 2022,
          predicted_mean: 1100.8121431907,
          "% Change": 11.0516596909,
        },
        {
          Years: 2024,
          predicted_mean: 1869.8177710737,
          "% Change": 69.8580255169,
        },
        {
          Years: 2025,
          predicted_mean: 1869.8447018724,
          "% Change": 0.00144029,
        },
        { Years: 2026, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 1869.8447018724, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 1869.8447018724, "% Change": 0.0 },
      ],
    },
    {
      Sacramento: [
        { Years: 2018, predicted_mean: 232.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 2745.4963457954,
          "% Change": 1083.4035973256,
        },
        {
          Years: 2020,
          predicted_mean: 2451.6874080681,
          "% Change": -10.7014871164,
        },
        {
          Years: 2021,
          predicted_mean: 1470.5514120478,
          "% Change": -40.0188047135,
        },
        {
          Years: 2022,
          predicted_mean: 1568.423525675,
          "% Change": 6.6554703783,
        },
        {
          Years: 2024,
          predicted_mean: 2451.426103194,
          "% Change": 56.2987332863,
        },
        {
          Years: 2025,
          predicted_mean: 2598.6414392046,
          "% Change": 6.005293646,
        },
        { Years: 2026, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 2598.6414392046, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 2598.6414392046, "% Change": 0.0 },
      ],
    },
  ];

  return data;
};

const getInfantMortalityDataDetails = () => {
  const data = [
    {
      Mendocino: [
        { Years: 2018, predicted_mean: 67.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 0.458795698,
          "% Change": -99.3152303014,
        },
        {
          Years: 2020,
          predicted_mean: -0.5888867646,
          "% Change": -228.3549011262,
        },
        {
          Years: 2021,
          predicted_mean: 0.2494875903,
          "% Change": -142.3659700396,
        },
        {
          Years: 2024,
          predicted_mean: -0.3599159627,
          "% Change": -244.2620702408,
        },
        {
          Years: 2025,
          predicted_mean: -0.3597684004,
          "% Change": -0.0409990946,
        },
        { Years: 2026, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.3597684004, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.3597684004, "% Change": 0.0 },
      ],
    },
    {
      Tehama: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.2630070064, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.1154240067,
          "% Change": -56.1137141178,
        },
        { Years: 2026, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.1154240067, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.1154240067, "% Change": 0.0 },
      ],
    },
    {
      Amador: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.2928785361, "% Change": null },
        { Years: 2025, predicted_mean: -0.293778496, "% Change": 0.3072809458 },
        { Years: 2026, predicted_mean: -0.293778496, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.293778496, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.293778496, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.293778496, "% Change": -1e-10 },
        { Years: 2030, predicted_mean: -0.293778496, "% Change": 9e-10 },
        { Years: 2031, predicted_mean: -0.293778496, "% Change": -1.7e-9 },
        { Years: 2032, predicted_mean: -0.293778496, "% Change": 9e-10 },
        { Years: 2033, predicted_mean: -0.293778496, "% Change": 0.0 },
      ],
    },
    {
      Marin: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.025505606, "% Change": null },
        {
          Years: 2020,
          predicted_mean: -0.0445029153,
          "% Change": -274.4828776999,
        },
        {
          Years: 2021,
          predicted_mean: 0.021172244,
          "% Change": -147.574959618,
        },
        {
          Years: 2024,
          predicted_mean: -0.0712410845,
          "% Change": -436.4833912899,
        },
        {
          Years: 2025,
          predicted_mean: -0.2157673396,
          "% Change": 202.8692517877,
        },
        { Years: 2026, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.2157673396, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.2157673396, "% Change": 0.0 },
      ],
    },
    {
      "San Bernardino": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 159.8726466278, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 157.2491774124,
          "% Change": -1.6409744072,
        },
        {
          Years: 2021,
          predicted_mean: 154.8762649393,
          "% Change": -1.509014236,
        },
        {
          Years: 2024,
          predicted_mean: 158.396648214,
          "% Change": 2.2730295543,
        },
        {
          Years: 2025,
          predicted_mean: 158.3977901845,
          "% Change": 0.0007209563,
        },
        { Years: 2026, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 158.3977901845, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 158.3977901845, "% Change": 0.0 },
      ],
    },
    {
      "San Joaquin": [
        { Years: 2018, predicted_mean: 39196.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 59.0907409852,
          "% Change": -99.8492429304,
        },
        {
          Years: 2020,
          predicted_mean: 51.8868334989,
          "% Change": -12.1912627361,
        },
        {
          Years: 2021,
          predicted_mean: 46.8085020961,
          "% Change": -9.7873218703,
        },
        {
          Years: 2024,
          predicted_mean: 55.4693332671,
          "% Change": 18.502688151,
        },
        {
          Years: 2025,
          predicted_mean: 55.4744311931,
          "% Change": 0.0091905305,
        },
        { Years: 2026, predicted_mean: 55.4744311931, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 55.4744311931, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 55.4744317617, "% Change": 1.0249e-6 },
        { Years: 2029, predicted_mean: 55.4744306245, "% Change": -2.0499e-6 },
        { Years: 2030, predicted_mean: 55.4744311931, "% Change": 1.0249e-6 },
        { Years: 2031, predicted_mean: 55.4744311931, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 55.4744311931, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 55.4744311931, "% Change": 0.0 },
      ],
    },
    {
      Humboldt: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 8.5766535406, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 4.1286756824,
          "% Change": -51.8614613171,
        },
        {
          Years: 2021,
          predicted_mean: -2.3138186364,
          "% Change": -156.0426348404,
        },
        {
          Years: 2024,
          predicted_mean: 4.0375250832,
          "% Change": -274.4961778607,
        },
        {
          Years: 2025,
          predicted_mean: 6.0581597547,
          "% Change": 50.0463682548,
        },
        { Years: 2026, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6.0581597547, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 6.0581597547, "% Change": 0.0 },
      ],
    },
    {
      Alpine: [
        { Years: 2018, predicted_mean: 45.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.1015728179, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.0710705076,
          "% Change": -30.0299932008,
        },
        { Years: 2026, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.0710705076, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.0710705076, "% Change": 0.0 },
      ],
    },
    {
      Napa: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: -0.0558940919, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 0.0810627553,
          "% Change": -245.0292018905,
        },
        {
          Years: 2021,
          predicted_mean: -0.0360786523,
          "% Change": -144.5070638449,
        },
        {
          Years: 2024,
          predicted_mean: 0.4443248586,
          "% Change": -1331.5450571439,
        },
        {
          Years: 2025,
          predicted_mean: 0.1547683429,
          "% Change": -65.1677506082,
        },
        { Years: 2026, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.1547683429, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.1547683429, "% Change": 0.0 },
      ],
    },
    {
      Monterey: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 24.509630738, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 25.9169303812,
          "% Change": 5.7418231154,
        },
        {
          Years: 2021,
          predicted_mean: 33.4601767346,
          "% Change": 29.1054775484,
        },
        {
          Years: 2024,
          predicted_mean: 25.7841459161,
          "% Change": -22.9407957984,
        },
        {
          Years: 2025,
          predicted_mean: 25.4330386772,
          "% Change": -1.3617175457,
        },
        { Years: 2026, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 25.4330386772, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 25.4330386772, "% Change": 0.0 },
      ],
    },
    {
      "Del Norte": [
        { Years: 2018, predicted_mean: 106.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.3726043136, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.0132044078,
          "% Change": -96.4561849368,
        },
        { Years: 2026, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.0132044078, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.0132044078, "% Change": 0.0 },
      ],
    },
    {
      "Los Angeles": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 394.5801640005, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 386.8650354021,
          "% Change": -1.9552753286,
        },
        {
          Years: 2021,
          predicted_mean: 377.3662639132,
          "% Change": -2.4553191991,
        },
        {
          Years: 2024,
          predicted_mean: 386.3765453289,
          "% Change": 2.3876753905,
        },
        {
          Years: 2025,
          predicted_mean: 390.5880067641,
          "% Change": 1.0899888946,
        },
        { Years: 2026, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 390.5880067641, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 390.5880067641, "% Change": 0.0 },
      ],
    },
    {
      Riverside: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 111.1838933081, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 114.6028487246,
          "% Change": 3.0750455977,
        },
        {
          Years: 2021,
          predicted_mean: 130.613479475,
          "% Change": 13.9705347018,
        },
        {
          Years: 2024,
          predicted_mean: 112.8741839744,
          "% Change": -13.581519742,
        },
        {
          Years: 2025,
          predicted_mean: 112.8741394236,
          "% Change": -3.94694e-5,
        },
        { Years: 2026, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 112.8741394236, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 112.8741394236, "% Change": 0.0 },
      ],
    },
    {
      "San Mateo": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 27.0846335416, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 22.3499921888,
          "% Change": -17.4809134689,
        },
        {
          Years: 2021,
          predicted_mean: 18.4523247405,
          "% Change": -17.4392340515,
        },
        {
          Years: 2024,
          predicted_mean: 24.9127463688,
          "% Change": 35.0114238673,
        },
        {
          Years: 2025,
          predicted_mean: 25.0421071182,
          "% Change": 0.5192552739,
        },
        { Years: 2026, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 25.0421071182, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 25.0421071182, "% Change": 0.0 },
      ],
    },
    {
      Madera: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 7.3231362282, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 6.5623106624,
          "% Change": -10.3893406066,
        },
        {
          Years: 2021,
          predicted_mean: 13.1125616841,
          "% Change": 99.816228745,
        },
        {
          Years: 2024,
          predicted_mean: 6.7157076907,
          "% Change": -48.784167026,
        },
        { Years: 2025, predicted_mean: 7.2057889814, "% Change": 7.2975375524 },
        { Years: 2026, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 7.2057889814, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 7.2057889814, "% Change": 0.0 },
      ],
    },
    {
      Calaveras: [
        { Years: 2018, predicted_mean: 71.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.189612203, "% Change": null },
        {
          Years: 2025,
          predicted_mean: 0.1893760854,
          "% Change": -0.1245265567,
        },
        { Years: 2026, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.1893760854, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.1893760854, "% Change": 0.0 },
      ],
    },
    {
      Tulare: [
        { Years: 2018, predicted_mean: 10.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 32.1717459976,
          "% Change": 221.7174599764,
        },
        {
          Years: 2020,
          predicted_mean: 36.5187226018,
          "% Change": 13.5117833036,
        },
        { Years: 2021, predicted_mean: 38.31826112, "% Change": 4.9277148541 },
        {
          Years: 2024,
          predicted_mean: 34.2513407969,
          "% Change": -10.6135304793,
        },
        {
          Years: 2025,
          predicted_mean: 34.2430877586,
          "% Change": -0.024095519,
        },
        { Years: 2026, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 34.2430877586, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 34.2430877586, "% Change": 0.0 },
      ],
    },
    {
      Siskiyou: [
        { Years: 2018, predicted_mean: 10.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.2420884698, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.2232500752,
          "% Change": -7.7816158206,
        },
        {
          Years: 2026,
          predicted_mean: -0.2303325877,
          "% Change": 3.1724569574,
        },
        {
          Years: 2027,
          predicted_mean: -0.2267356551,
          "% Change": -1.5616255633,
        },
        {
          Years: 2028,
          predicted_mean: -0.2268470077,
          "% Change": 0.0491111988,
        },
        {
          Years: 2029,
          predicted_mean: -0.226791215,
          "% Change": -0.0245948764,
        },
        {
          Years: 2030,
          predicted_mean: -0.2267914479,
          "% Change": 0.0001026806,
        },
        { Years: 2031, predicted_mean: -0.2267913314, "% Change": -5.13699e-5 },
        { Years: 2032, predicted_mean: -0.2267913119, "% Change": -8.5903e-6 },
        { Years: 2033, predicted_mean: -0.2267913511, "% Change": 1.72849e-5 },
      ],
    },
    {
      "San Francisco": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 23.0826928151, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 20.8643694435,
          "% Change": -9.610331816,
        },
        {
          Years: 2021,
          predicted_mean: 18.0627591556,
          "% Change": -13.4277256521,
        },
        {
          Years: 2024,
          predicted_mean: 21.8810243433,
          "% Change": 21.1388811359,
        },
        {
          Years: 2025,
          predicted_mean: 21.9658428172,
          "% Change": 0.3876348409,
        },
        { Years: 2026, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 21.9658428172, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 21.9658428172, "% Change": 0.0 },
      ],
    },
    {
      Sonoma: [
        { Years: 2018, predicted_mean: 451.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 9.3963804872,
          "% Change": -97.9165453465,
        },
        {
          Years: 2020,
          predicted_mean: 7.7272775315,
          "% Change": -17.7632542443,
        },
        {
          Years: 2021,
          predicted_mean: 11.623089262,
          "% Change": 50.4163557547,
        },
        {
          Years: 2024,
          predicted_mean: 8.3956089318,
          "% Change": -27.7678357055,
        },
        { Years: 2025, predicted_mean: 8.9169198225, "% Change": 6.2093279346 },
        { Years: 2026, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 8.9169198225, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 8.9169198225, "% Change": 0.0 },
      ],
    },
    {
      Merced: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 19.1643443165, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 16.6905379543,
          "% Change": -12.9083798612,
        },
        {
          Years: 2021,
          predicted_mean: 14.1515222859,
          "% Change": -15.2123057705,
        },
        {
          Years: 2024,
          predicted_mean: 17.6099088469,
          "% Change": 24.4382653055,
        },
        {
          Years: 2025,
          predicted_mean: 18.2052429455,
          "% Change": 3.3806767756,
        },
        { Years: 2026, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 18.2052429455, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 18.2052429455, "% Change": 0.0 },
      ],
    },
    {
      Butte: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 9.6182636144, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 2.5383478995,
          "% Change": -73.6090837053,
        },
        {
          Years: 2021,
          predicted_mean: 9.0026863154,
          "% Change": 254.6671564319,
        },
        {
          Years: 2024,
          predicted_mean: 2.3933733104,
          "% Change": -73.414898325,
        },
        {
          Years: 2025,
          predicted_mean: 6.1809768784,
          "% Change": 158.2537730945,
        },
        { Years: 2026, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6.1809768784, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6.1809768784, "% Change": 1e-10 },
        { Years: 2033, predicted_mean: 6.1809768784, "% Change": -3e-10 },
      ],
    },
    {
      Lassen: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.3378694923, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.3378301423,
          "% Change": -0.0116465159,
        },
        { Years: 2026, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.3378301423, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.3378301423, "% Change": 0.0 },
      ],
    },
    {
      "Santa Clara": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 47.8133121482, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 50.5953877874,
          "% Change": 5.8186214555,
        },
        {
          Years: 2021,
          predicted_mean: 51.0349364394,
          "% Change": 0.8687524124,
        },
        {
          Years: 2024,
          predicted_mean: 50.8656189191,
          "% Change": -0.3317678675,
        },
        { Years: 2025, predicted_mean: 49.58499413, "% Change": -2.5176628463 },
        { Years: 2026, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 49.58499413, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 49.58499413, "% Change": 0.0 },
      ],
    },
    {
      Nevada: [
        { Years: 2018, predicted_mean: 14.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.1107410713, "% Change": null },
        {
          Years: 2025,
          predicted_mean: 0.0212685704,
          "% Change": -80.7943248954,
        },
        { Years: 2026, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.0212685704, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.0212685702, "% Change": -9.204e-7 },
        { Years: 2033, predicted_mean: 0.0212685706, "% Change": 1.8409e-6 },
      ],
    },
    {
      Trinity: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.4206111157, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.0531142549,
          "% Change": -87.3721228693,
        },
        { Years: 2026, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.0531142549, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.0531142549, "% Change": 0.0 },
      ],
    },
    {
      Colusa: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.0788535329, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.0776245745,
          "% Change": -1.5585329929,
        },
        { Years: 2026, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.0776245745, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.0776245745, "% Change": 0.0 },
      ],
    },
    {
      "San Luis Obispo": [
        { Years: 2018, predicted_mean: 27.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 10.1712127377,
          "% Change": -62.3288417122,
        },
        {
          Years: 2020,
          predicted_mean: 5.188037919,
          "% Change": -48.9929268728,
        },
        {
          Years: 2021,
          predicted_mean: -2.8903272164,
          "% Change": -155.7113741547,
        },
        {
          Years: 2024,
          predicted_mean: 7.5804925531,
          "% Change": -362.2710850947,
        },
        { Years: 2025, predicted_mean: 7.7368101163, "% Change": 2.0621029843 },
        { Years: 2026, predicted_mean: 7.7368101163, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 7.7368101163, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 7.7368101163, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 7.7368136267, "% Change": 4.53725e-5 },
        { Years: 2030, predicted_mean: 7.7368066059, "% Change": -9.0745e-5 },
        { Years: 2031, predicted_mean: 7.7368101163, "% Change": 4.53725e-5 },
        { Years: 2032, predicted_mean: 7.7368101163, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 7.7368101163, "% Change": 0.0 },
      ],
    },
    {
      Lake: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: -0.1601712583, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 0.2769216346,
          "% Change": -272.8909652543,
        },
        {
          Years: 2021,
          predicted_mean: -0.1318273811,
          "% Change": -147.6045800026,
        },
        {
          Years: 2024,
          predicted_mean: 0.4019926992,
          "% Change": -404.93869776,
        },
        {
          Years: 2025,
          predicted_mean: 0.3965690668,
          "% Change": -1.3491867864,
        },
        { Years: 2026, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.3965690668, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.3965690668, "% Change": 0.0 },
      ],
    },
    {
      Imperial: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: -0.0205490529, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 0.0431819999,
          "% Change": -310.1410715835,
        },
        {
          Years: 2021,
          predicted_mean: -0.0220410067,
          "% Change": -151.0421165392,
        },
        {
          Years: 2024,
          predicted_mean: -0.1717137065,
          "% Change": 679.064716047,
        },
        {
          Years: 2025,
          predicted_mean: -0.1717121377,
          "% Change": -0.0009136239,
        },
        { Years: 2026, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.1717121377, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.1717121377, "% Change": 0.0 },
      ],
    },
    {
      "Santa Barbara": [
        { Years: 2018, predicted_mean: 109.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 24.3122759715,
          "% Change": -77.6951596591,
        },
        {
          Years: 2020,
          predicted_mean: 24.1270861457,
          "% Change": -0.7617132435,
        },
        {
          Years: 2021,
          predicted_mean: 22.7997849361,
          "% Change": -5.5012909621,
        },
        {
          Years: 2024,
          predicted_mean: 24.1965392131,
          "% Change": 6.1261730357,
        },
        {
          Years: 2025,
          predicted_mean: 24.3846952546,
          "% Change": 0.7776155087,
        },
        { Years: 2026, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 24.3846952546, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 24.3846952546, "% Change": 0.0 },
      ],
    },
    {
      "San Diego": [
        { Years: 2018, predicted_mean: 10.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 135.2574682166,
          "% Change": 1252.574682166,
        },
        {
          Years: 2020,
          predicted_mean: 120.3695984374,
          "% Change": -11.0070593332,
        },
        {
          Years: 2021,
          predicted_mean: 104.3350411607,
          "% Change": -13.3211022425,
        },
        {
          Years: 2024,
          predicted_mean: 122.5990815253,
          "% Change": 17.5051834566,
        },
        {
          Years: 2025,
          predicted_mean: 127.6244898942,
          "% Change": 4.099058742,
        },
        { Years: 2026, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 127.6244898942, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 127.6244898942, "% Change": 0.0 },
      ],
    },
    {
      Plumas: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.3708401578, "% Change": null },
        {
          Years: 2025,
          predicted_mean: 0.224163607,
          "% Change": -39.5524992963,
        },
        { Years: 2026, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.224163607, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.224163607, "% Change": 0.0 },
      ],
    },
    {
      Kings: [
        { Years: 2018, predicted_mean: 138.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 1.3585028086,
          "% Change": -99.0155776749,
        },
        {
          Years: 2020,
          predicted_mean: 9.2000300851,
          "% Change": 577.2183338092,
        },
        {
          Years: 2021,
          predicted_mean: 14.7742509703,
          "% Change": 60.5891593147,
        },
        {
          Years: 2024,
          predicted_mean: 7.9211543015,
          "% Change": -46.3854085229,
        },
        {
          Years: 2025,
          predicted_mean: 5.2008416934,
          "% Change": -34.3423761809,
        },
        { Years: 2026, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 5.2008416934, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 5.2008416934, "% Change": 0.0 },
      ],
    },
    {
      Mariposa: [
        { Years: 2018, predicted_mean: 101.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.1489475019, "% Change": null },
        {
          Years: 2025,
          predicted_mean: 0.1293085971,
          "% Change": -13.185118607,
        },
        { Years: 2026, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.1293085971, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.1293085971, "% Change": 0.0 },
      ],
    },
    {
      California: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 36389.256201351, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 35445.8345034432,
          "% Change": -2.5925830764,
        },
        {
          Years: 2021,
          predicted_mean: 33534.3363348209,
          "% Change": -5.3927300497,
        },
        {
          Years: 2024,
          predicted_mean: 35449.1357784178,
          "% Change": 5.7099667173,
        },
        {
          Years: 2025,
          predicted_mean: 35917.4472583762,
          "% Change": 1.3210801044,
        },
        { Years: 2026, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 35917.4472583762, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 35917.4472583762, "% Change": 0.0 },
      ],
    },
    {
      Glenn: [
        { Years: 2018, predicted_mean: 160.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.3337248432, "% Change": null },
        { Years: 2025, predicted_mean: 0.3499462516, "% Change": 4.8607134609 },
        { Years: 2026, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.3499462516, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.3499462516, "% Change": 0.0 },
      ],
    },
    {
      "El Dorado": [
        { Years: 2018, predicted_mean: 174.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: -0.1582760971,
          "% Change": -100.0909632742,
        },
        {
          Years: 2020,
          predicted_mean: 0.1986798035,
          "% Change": -225.527358279,
        },
        {
          Years: 2021,
          predicted_mean: -0.0837572138,
          "% Change": -142.1568837517,
        },
        {
          Years: 2024,
          predicted_mean: 0.0527801928,
          "% Change": -163.0156978529,
        },
        {
          Years: 2025,
          predicted_mean: -0.0577882495,
          "% Change": -209.4885153553,
        },
        {
          Years: 2026,
          predicted_mean: -0.1092799089,
          "% Change": 89.1040304209,
        },
        {
          Years: 2027,
          predicted_mean: -0.0062965901,
          "% Change": -94.2381082229,
        },
        {
          Years: 2028,
          predicted_mean: -0.0577882495,
          "% Change": 817.7705506098,
        },
        {
          Years: 2029,
          predicted_mean: -0.0630885168,
          "% Change": 9.1718773408,
        },
        {
          Years: 2030,
          predicted_mean: -0.0524879821,
          "% Change": -16.8026373902,
        },
        {
          Years: 2031,
          predicted_mean: -0.0577882495,
          "% Change": 10.0980589186,
        },
        {
          Years: 2032,
          predicted_mean: -0.0579158465,
          "% Change": 0.2208009575,
        },
        {
          Years: 2033,
          predicted_mean: -0.0576606525,
          "% Change": -0.440629002,
        },
      ],
    },
    {
      "Santa Cruz": [
        { Years: 2018, predicted_mean: 25.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 8.6431091815,
          "% Change": -65.4275632738,
        },
        {
          Years: 2020,
          predicted_mean: 3.7852258325,
          "% Change": -56.2052757519,
        },
        {
          Years: 2021,
          predicted_mean: -2.0963234442,
          "% Change": -155.3817271923,
        },
        {
          Years: 2024,
          predicted_mean: 6.4090054433,
          "% Change": -405.7259823654,
        },
        { Years: 2025, predicted_mean: 6.4182513241, "% Change": 0.144263894 },
        { Years: 2026, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6.4182513241, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 6.4182513241, "% Change": 0.0 },
      ],
    },
    {
      "Contra Costa": [
        { Years: 2018, predicted_mean: 63.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 50.4649057395,
          "% Change": -19.8969750167,
        },
        {
          Years: 2020,
          predicted_mean: 46.8152544237,
          "% Change": -7.232058125,
        },
        {
          Years: 2021,
          predicted_mean: 44.2835323248,
          "% Change": -5.4078999036,
        },
        { Years: 2024, predicted_mean: 48.4699121806, "% Change": 9.453581582 },
        {
          Years: 2025,
          predicted_mean: 48.4722968727,
          "% Change": 0.0049199433,
        },
        { Years: 2026, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 48.4722968727, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 48.4722968727, "% Change": 0.0 },
      ],
    },
    {
      "United States": [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 24324.6740227472, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 17404.4359750069,
          "% Change": -28.4494585262,
        },
        {
          Years: 2021,
          predicted_mean: 510.6844809938,
          "% Change": -97.0657797717,
        },
        {
          Years: 2024,
          predicted_mean: 17708.9677682654,
          "% Change": 3367.6925630881,
        },
        {
          Years: 2025,
          predicted_mean: 20864.6167955993,
          "% Change": 17.8194972662,
        },
        { Years: 2026, predicted_mean: 20864.6167955993, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 20864.6167955993, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 20864.6167955993, "% Change": 0.0 },
        {
          Years: 2029,
          predicted_mean: 20864.6851851345,
          "% Change": 0.0003277776,
        },
        {
          Years: 2030,
          predicted_mean: 20864.5484060641,
          "% Change": -0.000655553,
        },
        {
          Years: 2031,
          predicted_mean: 20864.6167955993,
          "% Change": 0.0003277787,
        },
        { Years: 2032, predicted_mean: 20864.6167955993, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 20864.6167955993, "% Change": 0.0 },
      ],
    },
    {
      "San Benito": [
        { Years: 2018, predicted_mean: 25.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.6173409464, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.3877524192,
          "% Change": -37.1899075394,
        },
        { Years: 2026, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.3877524192, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.3877524192, "% Change": 0.0 },
      ],
    },
    {
      Stanislaus: [
        { Years: 2018, predicted_mean: 20.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 34.4414591704,
          "% Change": 72.2072958521,
        },
        {
          Years: 2020,
          predicted_mean: 37.6528498687,
          "% Change": 9.3242004714,
        },
        {
          Years: 2021,
          predicted_mean: 41.7454830772,
          "% Change": 10.8693849808,
        },
        {
          Years: 2024,
          predicted_mean: 36.471407557,
          "% Change": -12.633883073,
        },
        {
          Years: 2025,
          predicted_mean: 36.3807907852,
          "% Change": -0.2484597602,
        },
        { Years: 2026, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 36.3807907852, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 36.3807907852, "% Change": 0.0 },
      ],
    },
    {
      Orange: [
        { Years: 2018, predicted_mean: 69.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 98.3164149875,
          "% Change": 42.4875579529,
        },
        {
          Years: 2020,
          predicted_mean: 100.9166600664,
          "% Change": 2.6447720649,
        },
        {
          Years: 2021,
          predicted_mean: 105.9327482025,
          "% Change": 4.9705253155,
        },
        {
          Years: 2024,
          predicted_mean: 100.7625906718,
          "% Change": -4.8806036079,
        },
        {
          Years: 2025,
          predicted_mean: 99.300361294,
          "% Change": -1.4511629446,
        },
        { Years: 2026, predicted_mean: 99.300361294, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 99.300361294, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 99.300361294, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 99.300361294, "% Change": 0.0 },
        {
          Years: 2030,
          predicted_mean: 99.1747467728,
          "% Change": -0.126499561,
        },
        {
          Years: 2031,
          predicted_mean: 99.4259758151,
          "% Change": 0.2533195702,
        },
        {
          Years: 2032,
          predicted_mean: 99.300361294,
          "% Change": -0.1263397418,
        },
        { Years: 2033, predicted_mean: 99.3003612934, "% Change": -6e-10 },
      ],
    },
    {
      Inyo: [
        { Years: 2018, predicted_mean: 10.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.1049809616, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.1051742484,
          "% Change": 0.1841160469,
        },
        { Years: 2026, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.1051742484, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.1051742484, "% Change": 0.0 },
      ],
    },
    {
      Yuba: [
        { Years: 2018, predicted_mean: 12.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 10.0991318325,
          "% Change": -15.8405680621,
        },
        {
          Years: 2020,
          predicted_mean: 2.8498577362,
          "% Change": -71.7811611583,
        },
        {
          Years: 2021,
          predicted_mean: -1.289131874,
          "% Change": -145.2349553312,
        },
        {
          Years: 2024,
          predicted_mean: 6.4511798947,
          "% Change": -600.4282358466,
        },
        { Years: 2025, predicted_mean: 6.4968708144, "% Change": 0.7082567908 },
        { Years: 2026, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6.4968708144, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 6.4968708144, "% Change": 0.0 },
      ],
    },
    {
      Tuolumne: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.2249965494, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.3433538822,
          "% Change": 52.6040657123,
        },
        { Years: 2026, predicted_mean: -0.3433538822, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.3433538822, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.3433538822, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.3433540143, "% Change": 3.84971e-5 },
        { Years: 2030, predicted_mean: -0.34335375, "% Change": -7.69942e-5 },
        { Years: 2031, predicted_mean: -0.3433538822, "% Change": 3.84971e-5 },
        { Years: 2032, predicted_mean: -0.3433538822, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.3433538822, "% Change": 0.0 },
      ],
    },
    {
      Sutter: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 8.8473739306, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 1.085237383,
          "% Change": -87.7337909361,
        },
        {
          Years: 2021,
          predicted_mean: -0.4032000228,
          "% Change": -137.1531638212,
        },
        {
          Years: 2024,
          predicted_mean: 5.1750025081,
          "% Change": -1383.4826924846,
        },
        { Years: 2025, predicted_mean: 5.2398218227, "% Change": 1.2525465342 },
        { Years: 2026, predicted_mean: 5.2398218227, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 5.2398218227, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 5.2398218227, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 5.290345478, "% Change": 0.9642246815 },
        {
          Years: 2030,
          predicted_mean: 5.1892981674,
          "% Change": -1.9100323595,
        },
        { Years: 2031, predicted_mean: 5.2398218227, "% Change": 0.9736124934 },
        { Years: 2032, predicted_mean: 5.2398218227, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 5.2398218227, "% Change": 0.0 },
      ],
    },
    {
      Placer: [
        { Years: 2018, predicted_mean: 23.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 11.7141685302,
          "% Change": -49.0688324775,
        },
        {
          Years: 2020,
          predicted_mean: 4.7087408005,
          "% Change": -59.8030300796,
        },
        {
          Years: 2021,
          predicted_mean: -2.379404163,
          "% Change": -150.5316445276,
        },
        {
          Years: 2024,
          predicted_mean: 5.3885842637,
          "% Change": -326.4678001095,
        },
        {
          Years: 2025,
          predicted_mean: 8.3730450208,
          "% Change": 55.3848768238,
        },
        { Years: 2026, predicted_mean: 8.3730476633, "% Change": 3.15597e-5 },
        { Years: 2027, predicted_mean: 8.3730423783, "% Change": -6.31194e-5 },
        { Years: 2028, predicted_mean: 8.3730450208, "% Change": 3.15597e-5 },
        { Years: 2029, predicted_mean: 8.3730450208, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 8.3730450208, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 8.3730450208, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 8.3730450208, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 8.3730450208, "% Change": 0.0 },
      ],
    },
    {
      Fresno: [
        { Years: 2018, predicted_mean: 14.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 86.8099960434,
          "% Change": 520.0714003099,
        },
        {
          Years: 2020,
          predicted_mean: 80.7523464901,
          "% Change": -6.9780553271,
        },
        {
          Years: 2021,
          predicted_mean: 75.2136404878,
          "% Change": -6.8588793304,
        },
        {
          Years: 2024,
          predicted_mean: 80.5180444053,
          "% Change": 7.0524493737,
        },
        {
          Years: 2025,
          predicted_mean: 83.6540617883,
          "% Change": 3.8948007321,
        },
        { Years: 2026, predicted_mean: 83.6540617883, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 83.6540617883, "% Change": 0.0 },
        {
          Years: 2028,
          predicted_mean: 83.8465438805,
          "% Change": 0.2300929424,
        },
        {
          Years: 2029,
          predicted_mean: 83.461579696,
          "% Change": -0.4591294604,
        },
        { Years: 2030, predicted_mean: 83.6540617883, "% Change": 0.230623591 },
        { Years: 2031, predicted_mean: 83.6540617883, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 83.6540617883, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 83.6541068076, "% Change": 5.38161e-5 },
      ],
    },
    {
      Kern: [
        { Years: 2018, predicted_mean: 32.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 79.3239030107,
          "% Change": 147.8871969084,
        },
        {
          Years: 2020,
          predicted_mean: 76.8516111181,
          "% Change": -3.1167047999,
        },
        {
          Years: 2021,
          predicted_mean: 71.7201804571,
          "% Change": -6.6770632214,
        },
        {
          Years: 2024,
          predicted_mean: 78.0206864766,
          "% Change": 8.7848440695,
        },
        {
          Years: 2025,
          predicted_mean: 78.0371559381,
          "% Change": 0.0211090959,
        },
        { Years: 2026, predicted_mean: 78.0371559381, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 78.0371559381, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 78.0371559381, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 78.0371559381, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 78.0371560635, "% Change": 1.607e-7 },
        { Years: 2031, predicted_mean: 78.0371558127, "% Change": -3.213e-7 },
        { Years: 2032, predicted_mean: 78.0371559381, "% Change": 1.607e-7 },
        { Years: 2033, predicted_mean: 78.0371559381, "% Change": 0.0 },
      ],
    },
    {
      Solano: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 20.9860710478, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 20.0194811687,
          "% Change": -4.6058639414,
        },
        {
          Years: 2021,
          predicted_mean: 19.9913036906,
          "% Change": -0.1407502919,
        },
        {
          Years: 2024,
          predicted_mean: 20.2820654974,
          "% Change": 1.4544414479,
        },
        {
          Years: 2025,
          predicted_mean: 20.2845422477,
          "% Change": 0.0122115287,
        },
        { Years: 2026, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 20.2845422477, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 20.2845422477, "% Change": 0.0 },
      ],
    },
    {
      Ventura: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 40.4899594136, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 30.2277141991,
          "% Change": -25.3451605364,
        },
        {
          Years: 2021,
          predicted_mean: 20.3549858331,
          "% Change": -32.661180733,
        },
        {
          Years: 2024,
          predicted_mean: 35.5666003496,
          "% Change": 74.7316389277,
        },
        {
          Years: 2025,
          predicted_mean: 35.6234779158,
          "% Change": 0.1599184788,
        },
        { Years: 2026, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 35.6234779158, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 35.6234779158, "% Change": 0.0 },
      ],
    },
    {
      Modoc: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": null },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.1672486691, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.1672649619,
          "% Change": 0.0097416562,
        },
        { Years: 2026, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.1672649619, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.1672649619, "% Change": 0.0 },
      ],
    },
    {
      Mono: [
        { Years: 2018, predicted_mean: 33.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: -0.0770843013, "% Change": null },
        {
          Years: 2025,
          predicted_mean: -0.0771972645,
          "% Change": 0.1465449509,
        },
        { Years: 2026, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2027, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2028, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2029, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2030, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2031, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2032, predicted_mean: -0.0771972645, "% Change": 0.0 },
        { Years: 2033, predicted_mean: -0.0771972645, "% Change": 0.0 },
      ],
    },
    {
      Yolo: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: -0.0664571464, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 0.2351379527,
          "% Change": -453.8189124144,
        },
        {
          Years: 2021,
          predicted_mean: -0.1373398554,
          "% Change": -158.4082041349,
        },
        {
          Years: 2024,
          predicted_mean: 0.4443022911,
          "% Change": -423.5057221774,
        },
        {
          Years: 2025,
          predicted_mean: 0.2455040624,
          "% Change": -44.7439125815,
        },
        { Years: 2026, predicted_mean: 0.2455040624, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.2455040624, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.2455040624, "% Change": 0.0 },
        {
          Years: 2029,
          predicted_mean: 0.0505581762,
          "% Change": -79.4063789877,
        },
        {
          Years: 2030,
          predicted_mean: 0.4404499485,
          "% Change": 771.1745199202,
        },
        {
          Years: 2031,
          predicted_mean: 0.2455040624,
          "% Change": -44.2606218551,
        },
        { Years: 2032, predicted_mean: 0.2455040624, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.2455040624, "% Change": 0.0 },
      ],
    },
    {
      Sierra: [
        { Years: 2018, predicted_mean: 21498.0, "% Change": null },
        { Years: 2019, predicted_mean: 0.0, "% Change": -100.0 },
        { Years: 2020, predicted_mean: 0.0, "% Change": null },
        { Years: 2021, predicted_mean: 0.0, "% Change": null },
        { Years: 2024, predicted_mean: 0.0358050459, "% Change": null },
        { Years: 2025, predicted_mean: 0.0363947973, "% Change": 1.6471181967 },
        { Years: 2026, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 0.0363947973, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 0.0363947973, "% Change": 0.0 },
      ],
    },
    {
      Shasta: [
        { Years: 2018, predicted_mean: 33.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 18.6653355196,
          "% Change": -43.4383772134,
        },
        {
          Years: 2020,
          predicted_mean: 9.5226089254,
          "% Change": -48.9823854736,
        },
        {
          Years: 2021,
          predicted_mean: 0.7639596782,
          "% Change": -91.9774120286,
        },
        {
          Years: 2024,
          predicted_mean: 13.575417212,
          "% Change": 1676.980853726,
        },
        {
          Years: 2025,
          predicted_mean: 13.5755781963,
          "% Change": 0.0011858513,
        },
        { Years: 2026, predicted_mean: 13.5755781963, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 13.5755781963, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 13.5755781963, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 13.5755781963, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 13.5755781963, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 13.5755781968, "% Change": 3.4e-9 },
        { Years: 2032, predicted_mean: 13.5755781958, "% Change": -6.8e-9 },
        { Years: 2033, predicted_mean: 13.5755781963, "% Change": 3.4e-9 },
      ],
    },
    {
      Alameda: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 59.2638251019, "% Change": null },
        { Years: 2020, predicted_mean: 59.974848376, "% Change": 1.1997593353 },
        {
          Years: 2021,
          predicted_mean: 57.6820282477,
          "% Change": -3.8229694452,
        },
        { Years: 2024, predicted_mean: 59.53918818, "% Change": 3.2196508838 },
        {
          Years: 2025,
          predicted_mean: 59.3981456017,
          "% Change": -0.2368903283,
        },
        { Years: 2026, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 59.3981456017, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 59.3981456016, "% Change": -0.0 },
      ],
    },
    {
      Sacramento: [
        { Years: 2018, predicted_mean: 0.0, "% Change": null },
        { Years: 2019, predicted_mean: 95.9115020221, "% Change": null },
        {
          Years: 2020,
          predicted_mean: 97.2984827057,
          "% Change": 1.4461046426,
        },
        {
          Years: 2021,
          predicted_mean: 97.7404793894,
          "% Change": 0.4542688348,
        },
        {
          Years: 2024,
          predicted_mean: 96.5228052733,
          "% Change": -1.2458237607,
        },
        {
          Years: 2025,
          predicted_mean: 96.4725561506,
          "% Change": -0.0520593268,
        },
        { Years: 2026, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 96.4725561506, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 96.4725561506, "% Change": 0.0 },
      ],
    },
  ];
  return data;
};

const getCohsDataDetails = () => {
  const data = [
    {
      Marin: [
        { Years: 2018, predicted_mean: 13370.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 12565.8417586667,
          "% Change": -6.014646532,
        },
        {
          Years: 2020,
          predicted_mean: 11002.3192120606,
          "% Change": -12.4426407449,
        },
        {
          Years: 2021,
          predicted_mean: 10513.7651321049,
          "% Change": -4.4404645106,
        },
        {
          Years: 2022,
          predicted_mean: 10037.1146545744,
          "% Change": -4.5335849864,
        },
        {
          Years: 2023,
          predicted_mean: 8223.5408296602,
          "% Change": -18.0686769787,
        },
        {
          Years: 2024,
          predicted_mean: 6651.7589290085,
          "% Change": -19.1132011528,
        },
        {
          Years: 2024,
          predicted_mean: 11002.8888996075,
          "% Change": 65.4132240365,
        },
        {
          Years: 2025,
          predicted_mean: 10513.3187602146,
          "% Change": -4.4494690791,
        },
        {
          Years: 2026,
          predicted_mean: 11091.848834059,
          "% Change": 5.5028301437,
        },
        {
          Years: 2027,
          predicted_mean: 11340.6206465011,
          "% Change": 2.2428345009,
        },
        {
          Years: 2028,
          predicted_mean: 11360.4071947472,
          "% Change": 0.1744750033,
        },
        {
          Years: 2029,
          predicted_mean: 11360.708005001,
          "% Change": 0.0026478827,
        },
        {
          Years: 2030,
          predicted_mean: 11360.7088673186,
          "% Change": 7.5904e-6,
        },
        { Years: 2031, predicted_mean: 11360.7088677832, "% Change": 4.1e-9 },
        { Years: 2032, predicted_mean: 11360.7088677833, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 11360.7088677833, "% Change": 0.0 },
      ],
    },
    {
      "San Mateo": [
        { Years: 2018, predicted_mean: 7746.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 4127.9390988016,
          "% Change": -46.7087645391,
        },
        {
          Years: 2020,
          predicted_mean: 3618.0854190244,
          "% Change": -12.3512888047,
        },
        {
          Years: 2021,
          predicted_mean: 3590.9595805963,
          "% Change": -0.7497290773,
        },
        {
          Years: 2022,
          predicted_mean: 3272.6433427838,
          "% Change": -8.8643781883,
        },
        {
          Years: 2023,
          predicted_mean: 2657.0954109939,
          "% Change": -18.8088913858,
        },
        {
          Years: 2024,
          predicted_mean: 2415.503614513,
          "% Change": -9.092326737,
        },
        {
          Years: 2024,
          predicted_mean: 3776.89997088,
          "% Change": 56.3607666818,
        },
        {
          Years: 2025,
          predicted_mean: 3776.4973159177,
          "% Change": -0.0106609909,
        },
        {
          Years: 2026,
          predicted_mean: 3779.2764441876,
          "% Change": 0.0735901031,
        },
        { Years: 2027, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 3779.2764441876, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 3779.2764441876, "% Change": 0.0 },
      ],
    },
    {
      "Santa Barbara": [
        { Years: 2018, predicted_mean: 24771.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 4418.4956238428,
          "% Change": -82.1626271695,
        },
        {
          Years: 2020,
          predicted_mean: 3988.7742292133,
          "% Change": -9.7255136411,
        },
        {
          Years: 2021,
          predicted_mean: 3153.2231788421,
          "% Change": -20.9475643984,
        },
        {
          Years: 2022,
          predicted_mean: 2510.8440414026,
          "% Change": -20.3721430741,
        },
        {
          Years: 2023,
          predicted_mean: 2217.2692487707,
          "% Change": -11.6922750992,
        },
        {
          Years: 2024,
          predicted_mean: 1592.0957068149,
          "% Change": -28.1956529322,
        },
        {
          Years: 2024,
          predicted_mean: 3853.6820850236,
          "% Change": 142.0509061439,
        },
        {
          Years: 2025,
          predicted_mean: 3853.5607718345,
          "% Change": -0.0031479812,
        },
        {
          Years: 2026,
          predicted_mean: 3853.6624576384,
          "% Change": 0.0026387492,
        },
        { Years: 2027, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 3853.6624576384, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 3853.6624576384, "% Change": 0.0 },
      ],
    },
    {
      Mariposa: [
        { Years: 2018, predicted_mean: 3764.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 6916.0107404362,
          "% Change": 83.7409867278,
        },
        {
          Years: 2020,
          predicted_mean: 5587.0938813797,
          "% Change": -19.2150780115,
        },
        {
          Years: 2021,
          predicted_mean: 6024.6499799825,
          "% Change": 7.8315508544,
        },
        {
          Years: 2022,
          predicted_mean: 6321.9244108414,
          "% Change": 4.9343021063,
        },
        {
          Years: 2023,
          predicted_mean: 5755.860429721,
          "% Change": -8.9539821158,
        },
        {
          Years: 2024,
          predicted_mean: 5587.1790809731,
          "% Change": -2.9306017894,
        },
        {
          Years: 2025,
          predicted_mean: 6251.6912545288,
          "% Change": 11.8935184272,
        },
        { Years: 2026, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2027, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2028, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2029, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2030, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2031, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2032, predicted_mean: 6251.6912545288, "% Change": 0.0 },
        { Years: 2033, predicted_mean: 6251.6912545288, "% Change": 0.0 },
      ],
    },
    {
      Orange: [
        { Years: 2018, predicted_mean: 4471.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 24357.7623596801,
          "% Change": 444.7945059199,
        },
        {
          Years: 2020,
          predicted_mean: 21897.1587979044,
          "% Change": -10.1019277774,
        },
        {
          Years: 2021,
          predicted_mean: 19651.5709704211,
          "% Change": -10.2551561516,
        },
        {
          Years: 2022,
          predicted_mean: 19534.7689623921,
          "% Change": -0.5943647366,
        },
        {
          Years: 2023,
          predicted_mean: 14771.4659741475,
          "% Change": -24.383718064,
        },
        {
          Years: 2024,
          predicted_mean: 12408.281516918,
          "% Change": -15.9983068801,
        },
        {
          Years: 2024,
          predicted_mean: 21896.9784307462,
          "% Change": 76.4706772722,
        },
        {
          Years: 2025,
          predicted_mean: 19651.2299789869,
          "% Change": -10.2559741695,
        },
        {
          Years: 2026,
          predicted_mean: 18264.7674519267,
          "% Change": -7.0553473169,
        },
        {
          Years: 2027,
          predicted_mean: 17956.1700852476,
          "% Change": -1.6895773105,
        },
        {
          Years: 2028,
          predicted_mean: 18500.6819907542,
          "% Change": 3.0324501434,
        },
        {
          Years: 2029,
          predicted_mean: 19449.7636268768,
          "% Change": 5.1299818925,
        },
        {
          Years: 2030,
          predicted_mean: 20394.7966482404,
          "% Change": 4.8588406497,
        },
        {
          Years: 2031,
          predicted_mean: 21111.9941669777,
          "% Change": 3.5165710701,
        },
        {
          Years: 2032,
          predicted_mean: 21559.3596458003,
          "% Change": 2.1190110005,
        },
        {
          Years: 2033,
          predicted_mean: 21796.1456738191,
          "% Change": 1.0982980567,
        },
      ],
    },
    {
      Ventura: [
        { Years: 2018, predicted_mean: 5551.0, "% Change": null },
        {
          Years: 2019,
          predicted_mean: 5384.5408447902,
          "% Change": -2.9987237472,
        },
        {
          Years: 2020,
          predicted_mean: 4590.2645686248,
          "% Change": -14.7510493292,
        },
        {
          Years: 2021,
          predicted_mean: 3906.5450606575,
          "% Change": -14.8949912962,
        },
        {
          Years: 2022,
          predicted_mean: 3810.6999918719,
          "% Change": -2.4534484384,
        },
        {
          Years: 2023,
          predicted_mean: 2967.7973247696,
          "% Change": -22.1193657045,
        },
        {
          Years: 2024,
          predicted_mean: 2285.6538876849,
          "% Change": -22.9848390047,
        },
        {
          Years: 2024,
          predicted_mean: 4590.212260182,
          "% Change": 100.8270930658,
        },
        {
          Years: 2025,
          predicted_mean: 3906.6330452485,
          "% Change": -14.8921046825,
        },
        {
          Years: 2026,
          predicted_mean: 3622.960530825,
          "% Change": -7.2613043288,
        },
        {
          Years: 2027,
          predicted_mean: 3736.0069519417,
          "% Change": 3.120277468,
        },
        {
          Years: 2028,
          predicted_mean: 4036.466453201,
          "% Change": 8.0422629059,
        },
        {
          Years: 2029,
          predicted_mean: 4319.200406182,
          "% Change": 7.0044915834,
        },
        {
          Years: 2030,
          predicted_mean: 4497.8387317526,
          "% Change": 4.135911946,
        },
        {
          Years: 2031,
          predicted_mean: 4582.8139532426,
          "% Change": 1.8892456257,
        },
        {
          Years: 2032,
          predicted_mean: 4614.5965702536,
          "% Change": 0.6935175055,
        },
        {
          Years: 2033,
          predicted_mean: 4624.1483215063,
          "% Change": 0.2069899526,
        },
      ],
    },
  ];
  return data;
};

export default memo(MapChart);
export { getMortalityDataColor, getInfantMortalityDataColor, getCohsDataColor };
