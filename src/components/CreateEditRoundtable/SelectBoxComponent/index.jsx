import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const SelectBox = () => {
  const handleChange = (vals) => {
    console.log({ vals });
  };
  return (
    <Select
      name="colors"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={handleChange}
    />
  );
};

const SelectBoxComponent = () => {
  const [num, setNum] = useState(1);

  return (
    <div className="row" style={{ height: "100vh" }}>
      <div className="col-9">
        {[...Array(num).keys()].map((el) => (
          <SelectBox />
        ))}
      </div>
      <div className="col-3">
        <button onClick={() => setNum(num + 1)}>add</button>
      </div>
    </div>
  );
};

export default SelectBoxComponent;
