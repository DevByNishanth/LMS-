import React from "react";


const StatCard = ({ title, value, bg }) => {
  return (
    <div className={`p-4 rounded-xl text-white ${bg} flex flex-col justify-between`}>
        <img src={st1} alt="" />
    </div>
  );
};

export default StatCard;