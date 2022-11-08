import React from "react";

const ProcurementExpandRow = ({ data }) => {
  return (
    <div
      style={{ backgroundColor: "white", color: "black" }}
      className="expandable-content p-2"
    >
      <p>Description:{data.description}</p>
    </div>
  );
};

export default ProcurementExpandRow;
