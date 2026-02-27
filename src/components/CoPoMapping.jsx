import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import activeBookIcon from "../assets/activeBookIcon.svg";
import inActiveBookIcon from "../assets/inActiveBookIcon.svg";

const tabDatas = [
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "CO1" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "CO2" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "CO3" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "CO4" },
  { inActiveIcon: inActiveBookIcon, activeIcon: activeBookIcon, lable: "CO5" },
];

const PO_LIST = [
  "PO0",
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
];

const CoPoMapping = ({ data, refreshData, onNext, onPrev }) => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedTab, setSelectedTab] = useState("CO1");
  const [loading, setLoading] = useState(false);
  const [coPoMapping, setCoPoMapping] = useState({});

  useEffect(() => {
    if (data) setCoPoMapping(data);
  }, [data]);

  const handleSaveAndNext = async () => {
    setLoading(true);
    try {
      const payload = { subjectId: classId, sectionId, data: coPoMapping };
      const res = await axios.patch(
        `${apiUrl}api/course-plan/coPoMapping`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        await refreshData();
        onNext();
      }
    } catch (err) {
      console.error("Error updating CO-PO mapping:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMapping = (item, field, value) => {
    setCoPoMapping((prev) => ({
      ...prev,
      [selectedTab]: {
        ...prev[selectedTab],
        [item]: {
          ...(prev[selectedTab]?.[item] || { justification: "", credit: 0 }),
          [field]: field === "credit" ? Number(value) : value,
        },
      },
    }));
  };

  return (
    <>
      <div className="h-[91%] mb-2 overflow-auto">
        <div className="form-content">
          <h1 className="font-medium text-lg bg-white sticky top-0 pb-2">
            CO-PO and CO-PSO Mapping
          </h1>
          <div className="tabs-container flex items-center gap-2 mt-2 sticky top-7 bg-white z-10">
            {tabDatas.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(tab.lable)}
                className={`tab ${selectedTab === tab.lable ? "active bg-[#08384f] text-white" : "bg-[#f1f5f9] text-[#08384f]"} flex items-center gap-3 w-fit px-6 py-2 border border-gray-300 rounded-xl transition-colors`}
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
          <div className="mt-4 space-y-2">
            {PO_LIST.map((item) => {
              const value = coPoMapping[selectedTab]?.[item] || {
                justification: "",
                credit: 0,
              };
              return (
                <div
                  key={item}
                  className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-16 text-center rounded-md bg-[#e6e9f5] text-gray-700 font-medium text-sm px-3 py-2 border border-gray-300">
                    {item}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Justification"
                    value={value.justification}
                    onChange={(e) =>
                      updateMapping(item, "justification", e.target.value)
                    }
                    className="flex-1 px-3 py-2 outline-none bg-transparent text-sm"
                  />
                  <select
                    value={value.credit}
                    onChange={(e) =>
                      updateMapping(item, "credit", e.target.value)
                    }
                    className="w-20 px-2 py-2 border-l border-gray-300 text-sm outline-none bg-white"
                  >
                    {[0, 1, 2, 3].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onPrev}
          className="bg-gray-200 border border-gray-300 text-black px-6 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSaveAndNext}
          disabled={loading}
          className="bg-[#08384f] text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </>
  );
};

export default CoPoMapping;
