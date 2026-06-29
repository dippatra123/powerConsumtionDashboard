import React from "react";
import { useState, useEffect } from "react";
import "./EnergyDataPage.css";
import {
  AreaChart,
  LineChart,
  Line,
  Area,
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
const EnergyDataPage = () => {
  const [enrData, setenrData] = useState({});
  const frmApiData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5030/api/getData/everyDayPowerConsumtion",
        { credentials: "include" },
      );
      const result = await response.json();
      console.log(result);
      setenrData(result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    frmApiData();
  }, []);
  const dailyData =
    enrData.dailyConsumption?.map((item) => ({
      date: item.date,
      consumption: Number(item.consumption),
    })) || [];

  const machineData = Object.values(
    (enrData.data || []).reduce((acc, item) => {
      if (!acc[item.machine_name]) {
        acc[item.machine_name] = {
          machine: item.machine_name,
          value: 0,
        };
      }

      acc[item.machine_name].value += Number(item.consumption_kwh);

      return acc;
    }, {}),
  );
  const COLORS = [
    "#ff6384",
    "#36a2eb",
    "#9966ff",
    "#ffce56",
    "#4bc0c0",
    "#ff9f40",
    "#00d084",
  ];
  return (
    <div className="container-fluid py-3">
      <div className="text-center mb-2">
        <h4 className="fw-bold text-dark">
          <i className="fas fa-bolt text-primary fs-6"></i> Energy Report
        </h4>
        <p className="text-muted mb-0">Daily Machine-wise Energy Consumption</p>
      </div>
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4">
        <div className="row align-items-end g-3">
          {/* From Date */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label fw-semibold">From Date</label>
            <input type="date" className="form-control" />
          </div>

          {/* To Date */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label fw-semibold">To Date</label>
            <input type="date" className="form-control" />
          </div>

          {/* Machine */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label fw-semibold">Machine</label>

            <select className="form-select">
              <option value="">All Machines</option>
              <option value="Hot Press 1">Hot Press 1</option>
              <option value="Hot Press 2">Hot Press 2</option>
              <option value="Dryer 1">Dryer 1</option>
              <option value="Dryer 2">Dryer 2</option>
              <option value="Calibrator">Calibrator</option>
              <option value="WBS 1">WBS 1</option>
              <option value="WBS 2">WBS 2</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary flex-fill">
                <i className="fas fa-search me-2"></i>
                Search
              </button>

              <button type="button" className="btn btn-outline-secondary">
                <i className="fas fa-rotate-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        {/* Total Energy */}
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Energy</h6>
                  <h5 className="fw-bold mb-0">
                    {enrData.summary?.totalEnergyConsumption ?? 0}
                  </h5>
                  <small className="text-muted">KWh</small>
                </div>

                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-bolt text-primary fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production */}
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Production</h6>
                  <h5 className="fw-bold mb-0">
                    {enrData.summary?.totalProduction ?? 0}
                  </h5>
                  <small className="text-muted">PCS</small>
                </div>

                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-boxes-stacked text-success fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Consumption */}
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Avg / Day</h6>
                  <h5 className="fw-bold mb-0">
                    {enrData.summary?.averagePerDay ?? 0}
                  </h5>
                  <small className="text-muted">KWh</small>
                </div>

                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-chart-line text-warning fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Efficiency</h6>
                  <h5 className="fw-bold mb-0">
                    {enrData.summary?.efficiency ?? 0}
                  </h5>
                  <small className="text-muted">PCS / KWh</small>
                </div>

                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-gauge-high text-danger fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="row mb-4">
        {/* Daily Consumption Trend */}
        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body ">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Daily Consumption Trend (KWh)</h6>
              </div>

              <div
                style={{
                  height: "300px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="consumption"
                      stroke="#050d1b"
                      fill="#3b82f6"
                      fillOpacity={0.25}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Wise Consumption */}
        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Machine Wise Consumption (KWh)</h6>
              </div>

              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={machineData}
                    margin={{
                      left: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis type="number" />

                    <YAxis type="category" dataKey="machine" width={100} />

                    <Tooltip />

                    <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                      {machineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyDataPage;
