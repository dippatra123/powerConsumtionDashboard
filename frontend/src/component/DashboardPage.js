import React, { useState, useEffect } from "react";
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

const DashboardPage = () => {
  const [data, setData] = useState([]);

  const date = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fixed
  const fullDate = `${months[date.getMonth()]} - ${date.getFullYear()}`;

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5030/getData", {
        credentials: "include",
      });

      const result = await response.json();

      console.log(result);

      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Total Consumption
  const total = Array.isArray(data)
    ? data.reduce((sum, item) => sum + parseFloat(item.consumption_kwh || 0), 0)
    : 0;

  // Pie & Bar Chart Data
  const machineWishConsumtion = Array.isArray(data)
    ? Object.entries(
        data.reduce((acc, item) => {
          acc[item.machine_name] =
            (acc[item.machine_name] || 0) +
            parseFloat(item.consumption_kwh || 0);

          return acc;
        }, {}),
      ).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }))
    : [];

  // Line Chart Data
  const dataForGraph = Array.isArray(data)
    ? data.reduce((acc, item) => {
        if (!acc[item.machine_name]) {
          acc[item.machine_name] = [];
        }

        acc[item.machine_name].push(item);

        return acc;
      }, {})
    : {};

  return (
    <div className="container-fluid p-4 dashboard">
      {/* Summary */}
      <div className="summary-box">
        <h4 className="text-center">Monthly Consumption — {fullDate}</h4>

        <h6 className="text-center mb-4">Total : {total.toFixed(2)} KWh</h6>

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
                  {machineWishConsumtion.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="col-md-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={machineWishConsumtion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis dataKey="name" type="category" width={120} />

                <Tooltip />

                <Bar dataKey="value">
                  {machineWishConsumtion.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Machine Cards */}
      <div className="row">
        {Object.entries(dataForGraph).map(([machineName, graphData]) => (
          <div className="col-md-4 mb-4" key={machineName}>
            <div className="machine-card">
              <h5>{machineName}</h5>

              <p>{fullDate}</p>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="0" />

                  <XAxis
                    dataKey="date"
                    stroke="#1a1818"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis stroke="#1a1818" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="consumption_kwh"
                    stroke="#c338a7"
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
