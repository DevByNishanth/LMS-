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

const CoPoMapping = ({
  data,
  refreshData,
  onNext,
  onPrev,
  updateLivePlanningData,
}) => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedTab, setSelectedTab] = useState("CO1");
  const [loading, setLoading] = useState(false);
  const [coPoMapping, setCoPoMapping] = useState({});

  useEffect(() => {
    if (data) setCoPoMapping(data);
  }, [data]);

  const handleLiveUpdate = (updatedState) => {
    setCoPoMapping(updatedState);
    if (updateLivePlanningData) {
      updateLivePlanningData(updatedState);
    }
  };

  const handleSaveAndNext = async () => {
    setLoading(true);
    try {
      const payload = { subjectId: classId, sectionId, data: coPoMapping };
      const res = await axios.patch(
        `${apiUrl}api/course-plan/coPoMapping`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
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
    const updatedState = {
      ...coPoMapping,
      [selectedTab]: {
        ...coPoMapping[selectedTab],
        [item]: {
          ...(coPoMapping[selectedTab]?.[item] || {
            justification: "",
            credit: 0,
          }),
          [field]: field === "credit" ? Number(value) : value,
        },
      },
    };
    handleLiveUpdate(updatedState);
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="flex-1 overflow-auto pr-2 hide-scrollbar">
        <div className="form-content">
          <h1 className="font-medium text-lg bg-white sticky top-0 pb-2 z-20">
            CO-PO and CO-PSO Mapping
          </h1>

          <div className="tabs-container flex items-center gap-2 mt-2 sticky top-8 bg-white z-10 py-2">
            {tabDatas.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(tab.lable)}
                className={`tab ${
                  selectedTab === tab.lable
                    ? "active bg-[#08384f] text-white shadow-md"
                    : "bg-[#f1f5f9] text-[#08384f] hover:bg-gray-200"
                } flex items-center gap-3 w-fit px-5 py-2 border border-gray-200 rounded-xl transition-all duration-200`}
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
                <span className="text-sm font-semibold">{tab.lable}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3 pb-4">
            {PO_LIST.map((item) => {
              const mappingEntry = coPoMapping[selectedTab]?.[item] || {
                justification: "",
                credit: 0,
              };

              const isEntryValid =
                mappingEntry.credit > 0 &&
                mappingEntry.justification.trim() !== "";

              return (
                <div
                  key={item}
                  className={`flex items-center gap-0 border rounded-lg overflow-hidden transition-all duration-200 ${
                    isEntryValid
                      ? "border-gray-200 bg-gray-50/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="w-16 h-12 flex items-center justify-center bg-[#e6e9f5] text-[#08384f] font-bold text-xs border-r border-gray-300">
                    {item}
                  </div>

                  <div className="flex-1 h-12 flex items-center px-3 bg-white">
                    <input
                      type="text"
                      placeholder={`Enter justification for ${item} mapping...`}
                      value={mappingEntry.justification}
                      onChange={(e) =>
                        updateMapping(item, "justification", e.target.value)
                      }
                      className="w-full outline-none text-sm text-gray-700 bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 h-12 bg-white border-l border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Credit
                    </span>
                    <select
                      value={mappingEntry.credit}
                      onChange={(e) =>
                        updateMapping(item, "credit", e.target.value)
                      }
                      className={`w-14 h-8 px-1 border rounded text-sm font-bold outline-none cursor-pointer transition-colors ${
                        mappingEntry.credit > 0
                          ? "border-gray-700 text-gray-700"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {[0, 1, 2, 3].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={onPrev}
          className="bg-gray-100 text-gray-700 font-medium px-6 py-2 rounded-md hover:bg-gray-200 border border-gray-200"
        >
          Previous
        </button>
        <button
          onClick={handleSaveAndNext}
          disabled={loading}
          className="bg-[#08384f] text-white font-medium px-8 py-2 rounded-md disabled:opacity-50 shadow-md hover:bg-[#062c3e]"
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CoPoMapping;
