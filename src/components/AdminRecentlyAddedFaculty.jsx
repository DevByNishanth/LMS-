import React from "react";

const facultyData = [
  {
    id: 1,
    name: "Jane Cooper",
    role: "Assistant Professor",
    dept: "ECE",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Jane Cooper",
    role: "Assistant Professor",
    dept: "ECE",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Jane Cooper",
    role: "Assistant Professor",
    dept: "ECE",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 4,
    name: "Jane Cooper",
    role: "Assistant Professor",
    dept: "ECE",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 5,
    name: "Jane Cooper",
    role: "Assistant Professor",
    dept: "ECE",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const AdminRecentlyAddedFaculty = () => {
  return (
    <div className="w-full bg-white h-full border border-gray-200 rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium ">
          Recent Onboarded Faculty
        </h2>

        
      </div>

      {/* List */}
      <div className="space-y-3">
        {facultyData.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-2 rounded-xl ${
              index === 1 ? "bg-gray-100" : ""
            }`}
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>

            {/* Right */}
            <span className="text-xs font-medium text-gray-500">
              {item.dept}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRecentlyAddedFaculty;