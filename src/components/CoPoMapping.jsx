import React, { useState } from "react";
import activeBookIcon from "../assets/activeBookIcon.svg";
import inActiveBookIcon from "../assets/inActiveBookIcon.svg";

const tabDatas = [
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "C01" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "C02" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "C03" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "C04" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "C05" },
];

const CoPoMapping = ({ coPoMapping, setCoPoMapping, onNext, onPrev }) => {
  const [selectedTab, setSelectedTab] = useState("C01");

  return (
    <>
      <div className="h-[91%] mb-2 overflow-auto">
        <div className="form-content">
          <h1 className="font-medium text-lg bg-white sticky top-0 pb-2">
            CO-PO and CO-PSO Mapping
          </h1>
          <div className="tabs-container flex items-center gap-2 mt-2 sticky top-7 bg-white">
            {tabDatas.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(tab.lable)}
                className={`tab ${selectedTab === tab.lable ? "active bg-[#08384f] text-white" : "bg-[#f1f5f9] text-[#08384f]"} flex items-center gap-3 w-fit px-6 py-2 border border-gray-300 rounded-xl`}
              >
                <img
                  src={
                    selectedTab === tab.lable
                      ? tab.activeIcon
                      : tab.inActiveIcon
                  }
                  alt={tab.lable}
                  className="w-4 h-4"
                />
                <span>{tab.lable}</span>
              </button>
            ))}
          </div>
          <div className="mt-2">
            <div className="space-y-2">
              {[
                "PO1",
                "PO2",
                "PO3",
                "PO4",
                "PO5",
                "PO6",
                "PO7",
                "PO8",
                "PO9",
                "PO10",
                "PO11",
                "PSO1",
                "PSO2",
                "PSO3",
              ].map((item) => {
                const value = coPoMapping[selectedTab]?.[item] || {
                  justification: "",
                  level: "0",
                };
                return (
                  <div
                    key={item}
                    className="flex items-center border border-gray-300 p-2 rounded-lg overflow-hidden bg-gray-50"
                  >
                    <div className="w-15 text-center rounded-md bg-[#e6e9f5] text-gray-700 font-medium text-sm px-3 py-2 border border-gray-300">
                      {item}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Justification Mapping with PO"
                      value={value.justification}
                      onChange={(e) => {
                        setCoPoMapping((prev) => ({
                          ...prev,
                          [selectedTab]: {
                            ...prev[selectedTab],
                            [item]: {
                              ...prev[selectedTab]?.[item],
                              justification: e.target.value,
                              level: prev[selectedTab]?.[item]?.level || "0",
                            },
                          },
                        }));
                      }}
                      className="flex-1 px-3 py-2 outline-none bg-transparent text-sm"
                    />
                    <select
                      value={value.level}
                      onChange={(e) => {
                        setCoPoMapping((prev) => ({
                          ...prev,
                          [selectedTab]: {
                            ...prev[selectedTab],
                            [item]: {
                              justification:
                                prev[selectedTab]?.[item]?.justification || "",
                              level: e.target.value,
                            },
                          },
                        }));
                      }}
                      className="w-20 px-2 py-2 border-l border-gray-300 text-sm outline-none"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onPrev}
          className="bg-gray-200 border border-gray-300 text-black px-6 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="bg-[#08384f] text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CoPoMapping;
