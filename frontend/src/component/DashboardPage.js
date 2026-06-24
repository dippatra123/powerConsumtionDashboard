import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import "./DashboardPage.css";

const COLORS = [
  "#ff6384",
  "#36a2eb",
  "#9966ff",
  "#ffce56",
  "#4bc0c0",
  "#ff9f40",
  "#00d084",
];

const pieData = [
  { name: "WBS-1", value: 340 },
  { name: "WBS-2", value: 340 },
  { name: "DD Saw", value: 250 },
  { name: "Dryer-1", value: 200 },
  { name: "Dryer-2", value: 200 },
  { name: "Calibrator", value: 340 },
  { name: "Hotpress", value: 340 },
];

const machineData = [
  { name: "DD Saw", value: 250 },
  { name: "WBS-2", value: 340 },
  { name: "WBS-1", value: 340 },
  { name: "CALIBRATOR", value: 340 },
  { name: "HOTPRESS-1", value: 340 },
  { name: "HOTPRESS-2", value: 340 },
  { name: "DRYER-2", value: 240 },
  { name: "DRYER-1", value: 240 },
];

const lineData = [
  { day: "23", value: 110 },
  { day: "24", value: 110 },
  { day: "25", value: 0 },
  { day: "26", value: 110 },
  { day: "27", value: 0 },
];

const cards = [
  "DD Saw (Meter em0011)",
  "WBS-2 (Meter em0012)",
  "WBS-1 (Meter em0013)",
  "CALIBRATOR (Meter em0014)",
  "HOTPRESS-1 (Meter em0017)",
  "HOTPRESS-2 (Meter em0022)",
];

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5030/getData", {
        credentials: "include",
      });

      const result = await response.json();

      console.log(result);

      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const total = data.reduce(
    (sum, item) => sum + parseFloat(item.consumption_kwh || 0),
    0,
  );
  const machineWishConsumtion = Object.entries(
    data.reduce((acc, item) => {
      acc[item.machine_name] =
        (acc[item.machine_name] || 0) + parseFloat(item.consumption_kwh || 0);

      return acc;
    }, {}),
  ).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  console.log(machineWishConsumtion);
  return (
    <div className="container-fluid p-4 dashboard">
      {/* Top Section */}
      <div className="summary-box">
        <h4 className="text-center">Monthly Consumption — 2025-03</h4>

        <h6 className="text-center mb-4">Total: {total.toFixed(2)} KWh</h6>

        <div className="row">
          {/* Pie Chart */}
          <div className="col-md-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={machineWishConsumtion}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal Bar */}
          <div className="col-md-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={machineWishConsumtion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis dataKey="name" type="category" width={120} />

                <Tooltip />

                <Bar dataKey="value">
                  {machineData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="row mt-4">
        {cards.map((item, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="machine-card">
              <h5>{item}</h5>

              <p>Month: 2025-03</p>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="0" />

                  <XAxis dataKey="day" stroke="#0f0f0f" />

                  <YAxis stroke="#0f0f0f" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff6682"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="view-text">Click to view details</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
