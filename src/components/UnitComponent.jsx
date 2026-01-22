import { useState } from "react";
import { ChevronRight } from "lucide-react";

const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Others"];

export default function UnitComponent({ onSelect }) {
    const [selected, setSelected] = useState("Unit 1");

    const handleSelect = (unit) => {
        setSelected(unit);
        onSelect && onSelect(unit);
    };

    return (
        <div className="w-[16%] h-[calc(100vh-160px)] p-2 rounded-lg bg-white border border-[#D6D6D6]">
            {units.map((unit) => (
                <button
                    key={unit}
                    onClick={() => handleSelect(unit)}
                    className={`w-full  flex items-center justify-between px-2 py-3 rounded-md mb-2 
            border transition-all
            ${selected === unit
                            ? "bg-[#0B56A4] text-white "
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }
          `}
                >
                    <span className="text-md font-medium">{unit}</span>
                    <ChevronRight
                        className={`w-6 h-6 ${selected === unit ? "text-white" : "text-black"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}
