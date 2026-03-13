import React, { useState } from "react";
import { Plus } from "lucide-react";

const LabPlannerTab = () => {

  const initialExperiments = Array.from({ length: 10 }, () => ({
    co: "CO1",
    title: ""
  }));

  const [experiments, setExperiments] = useState(initialExperiments);

  const addExperiment = () => {
    setExperiments([...experiments, { co: "CO1", title: "" }]);
  };

  const handleTitleChange = (index, value) => {
    const updated = [...experiments];
    updated[index].title = value;
    setExperiments(updated);
  };

  const handleCoChange = (index, value) => {
    const updated = [...experiments];
    updated[index].co = value;
    setExperiments(updated);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents form submit
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4">

      <h2 className="font-medium text-lg mb-4 text-[#08384F]">
        Lab Planner
      </h2>

      <div className="flex flex-col gap-3">

        {experiments.map((exp, i) => (
          <div key={i} className="flex items-center gap-4">

            <select
              value={exp.co}
              onChange={(e) => handleCoChange(i, e.target.value)}
              className="w-[150px] bg-[#e6e9f5] text-[#08384f] px-3 py-2 rounded-md border"
            >
              <option value="CO1">CO1</option>
              <option value="CO2">CO2</option>
              <option value="CO3">CO3</option>
              <option value="CO4">CO4</option>
              <option value="CO5">CO5</option>
            </select>

            <input
              type="text"
              value={exp.title}
              onChange={(e) => handleTitleChange(i, e.target.value)}
              onKeyDown={handleEnter}
              placeholder="Enter Title"
              className="flex-1 px-4 py-2 rounded-md border outline-none focus:ring-1 focus:ring-[#08384f]"
            />

            {/* Plus only on first row */}
            {i === 0 && (
              <button
                onClick={addExperiment}
                className="p-2 text-[#08384f] border rounded-md hover:bg-gray-100"
              >
                <Plus size={18} />
              </button>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default LabPlannerTab;