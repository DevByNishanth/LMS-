import React, { useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const legends = [
  { color: "#34B3F1", label: "Professors" },
  { color: "#08384F", label: "Associate Professors" },
  { color: "#0B56A4", label: "Assistant Professors" },
];

// Convert hex color to rgba with opacity
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Updated dataset with Designation instead of Survived
const titanicData = [
  { Class: "1st", Designation: "Professor", Count: 202 },
  { Class: "2nd", Designation: "Assistant Professor", Count: 167 },
  { Class: "3rd", Designation: "Associate Professor", Count: 178 },
];

const classes = ["1st", "2nd", "3rd"];

const totalCount = titanicData.reduce((acc, item) => acc + item.Count, 0);

// Define colors
const classColors = {
  "1st": "#34B3F1",
  "2nd": "#0B56A4",
  "3rd": "#08384F",
};

// Different opacity based on class
const opacityMap = {
  "1st": 0.9,
  "2nd": 0.7,
  "3rd": 0.5,
};

const classData = classes.map((pClass) => {
  const classTotal = titanicData
    .filter((item) => item.Class === pClass)
    .reduce((acc, item) => acc + item.Count, 0);
  return {
    id: pClass,
    label: `${pClass} Class:`,
    value: classTotal,
    percentage: (classTotal / totalCount) * 100,
    color: classColors[pClass],
  };
});

const classDesignationData = classes.flatMap((pClass) => {
  const classTotal = classData.find((d) => d.id === pClass)?.value ?? 0;
  const baseColor = classColors[pClass];
  return titanicData
    .filter((item) => item.Class === pClass)
    .sort((a, b) => (a.Designation > b.Designation ? 1 : -1))
    .map((item) => ({
      id: `${pClass}-${item.Designation}`,
      label: item.Designation,
      value: item.Count,
      percentage: (item.Count / classTotal) * 100,
      color: hexToRgba(baseColor, opacityMap[pClass] || 1),
    }));
});

// Grouped data by Designation type
const designationData = [
  {
    id: "Professor",
    label: "Professor:",
    value: titanicData
      .filter((item) => item.Designation === "Professor")
      .reduce((sum, item) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item) => item.Designation === "Professor")
        .reduce((sum, item) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors["1st"],
  },
  {
    id: "Assistant Professor",
    label: "Assistant Professor:",
    value: titanicData
      .filter((item) => item.Designation === "Assistant Professor")
      .reduce((sum, item) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item) => item.Designation === "Assistant Professor")
        .reduce((sum, item) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors["2nd"],
  },
  {
    id: "Associate Professor",
    label: "Associate Professor:",
    value: titanicData
      .filter((item) => item.Designation === "Associate Professor")
      .reduce((sum, item) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item) => item.Designation === "Associate Professor")
        .reduce((sum, item) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors["3rd"],
  },
];

// Dataset for class distribution by Designation
const designationClassData = [...titanicData]
  .sort((a) => (a.Designation === "Professor" ? -1 : 1))
  .map((item) => {
    const baseColor = designationData.find(
      (d) => d.id === item.Designation
    )?.color;
    return {
      id: `${item.Class}-${item.Designation}`,
      label: `${item.Class} class:`,
      value: item.Count,
      percentage:
        (item.Count /
          (item.Designation === "Professor"
            ? designationData[0].value
            : item.Designation === "Assistant Professor"
            ? designationData[1].value
            : designationData[2].value)) *
        100,
      color: hexToRgba(baseColor, opacityMap[item.Class] || 1),
    };
  });

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function TitanicPie() {
  const [view, setView] = useState("class");
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const innerRadius = 23;
  const middleRadius = 60;

  return (
    <Box
      sx={{
        width: "95%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ height: 127 }}>
        {view === "class" ? (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: classData,
                arcLabel: (item) => `${item.percentage.toFixed(0)}`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${(
                    (value / totalCount) *
                    100
                  ).toFixed(0)}%)`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: "12px",
                fill: "#fff",
                fontWeight: "bold",
              },
            }}
            hideLegend
            disableTooltip={true}
          >
            <PieCenterLabel>{totalCount}</PieCenterLabel>
          </PieChart>
        ) : (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: designationData,
                arcLabel: (item) =>
                  `${item.id} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${(
                    (value / totalCount) *
                    100
                  ).toFixed(0)}%)`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: designationClassData,
                arcLabel: (item) => {
                  const id = item.id || "";
                  const percentage = item.percentage || 0;
                  return `${id.split("-")[0]} (${percentage.toFixed(0)}%)`;
                },
                arcLabelRadius: 160,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${(
                    (value / totalCount) *
                    100
                  ).toFixed(0)}%)`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: "12px",
              },
            }}
            hideLegend
            disableTooltip={true}
          >
            <PieCenterLabel>Designation</PieCenterLabel>
          </PieChart>
        )}
      </Box>
      <div className=" flex gap-5 ">
        {/* Vertical Divider */}
        <div className="w-[1px] bg-gray-300 h-27"></div>

        {/* Legend Items */}
        <div className="space-y-4">
          {legends.map((item) => (
            <div key={item.label} className="flex items-center space-x-3">
              <div
                className="w-5 h-5 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-600 font-medium text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
