import React from "react";

function getPieData(data) {
  const pieData = [];
  for (let i = 0; i < data.length; i++) {
    pieData.push({
      x: data[i].name,
      y: data[i].value,
    });
  }
  return pieData;
}

export default function App() {
    return <div id="model_pie" style={{width: '100%', minWidth: 100}}></div>
}
