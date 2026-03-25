import {
  Layout,
  ClipboardList,
  Users,
} from "lucide-react";

const StudentClassroomHeader = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "stream", label: "Stream", icon: Layout },
    { id: "classwork", label: "Classwork", icon: ClipboardList },
    { id: "people", label: "Peoples", icon: Users },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#08384F] text-white shadow-lg shadow-blue-900/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isActive ? "bg-white/20" : "bg-gray-200"
                }`}
              >
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <span className="pr-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default StudentClassroomHeader;
