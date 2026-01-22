import React, { useState } from "react";

const TestingComponent = () => {
  const [number, setNumber] = useState("");
  return (
    <>
      <div className="main-container w-[300px] m-auto mt-10">
        <div className="container-1">
          <h1>Student mobile</h1>
          <input
            type="text"
            value={number}
            className="border "
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div className="container-1">
          <h1>Mother mobile</h1>
          <input
            type="text"
            value={number}
             className="border "
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default TestingComponent;
