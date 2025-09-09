import { FaTimes } from "react-icons/fa";

const PatientDetailView = ({
  patient,
  onClose,
  getBarColor,
  getTextColor,
  getStrokeColor,
}) => {
  const getFormattedName = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const chartMetrics = [
    "bp_systolic",
    "bp_diastolic",
    "heart_rate",
    "respiratory_rate",
    "temperature",
    "oxygen_saturation",
  ];

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex justify-center items-center p-4 z-50 animate-fade-in-down backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-8 relative transform scale-95 transition-transform duration-300 ease-out">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-slate-400 hover:text-slate-600 transition duration-200"
        >
          <FaTimes />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-1">
            {patient?.name || "Unknown Patient"}
          </h2>
          <p className="text-xl text-slate-500">{patient?.disease || "—"}</p>
          <p className="text-sm text-slate-400 mt-2">
            Age: {patient?.age || "—"} • Admission:{" "}
            {patient?.admissionDate || "—"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl shadow-inner">
            <h3 className="text-2xl font-bold text-slate-700 mb-5">
              Risk Summary
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg text-slate-600">
                Deterioration Probability:
              </span>
              <span
                className={`text-3xl font-bold ${getTextColor(
                  patient?.probability ?? 0
                )}`}
              >
                {patient?.probability ?? 0}%
              </span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-sm">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  patient?.probability ?? 0
                )}`}
                style={{
                  width: `${patient?.probability ?? 0}%`,
                }}
              ></div>
            </div>
            <p className="mt-4 text-sm text-slate-500 italic">
              This score is an AI-generated prediction based on the uploaded
              data.
            </p>
          </div>

          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl shadow-inner">
            <h3 className="text-2xl font-bold text-slate-700 mb-6">
              Patient Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient?.daily_records &&
                chartMetrics.map((key) => {
                  const data = patient.daily_records.map((r) => r[key]);
                  if (
                    data.length === 0 ||
                    !data.every(
                      (val) => typeof val === "number" && isFinite(val)
                    )
                  ) {
                    return (
                      <div
                        key={key}
                        className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center text-center"
                      >
                        <span className="text-slate-400">
                          No data available for {getFormattedName(key)}
                        </span>
                      </div>
                    );
                  }

                  const minVal = Math.min(...data);
                  const maxVal = Math.max(...data);
                  const range = maxVal - minVal;

                  const getChartPoints = () => {
                    return data
                      .map((val, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const normalizedVal =
                          range > 0 ? ((val - minVal) / range) * 80 + 10 : 50;
                        const y = 100 - normalizedVal;
                        return `${x},${y}`;
                      })
                      .join(" ");
                  };

                  return (
                    <div
                      key={key}
                      className="bg-white p-6 rounded-xl shadow-md"
                    >
                      <h4 className="font-semibold text-lg text-slate-700 mb-2">
                        {getFormattedName(key)}
                      </h4>
                      <svg viewBox="0 0 100 100" className="w-full h-32">
                        <polyline
                          fill="none"
                          stroke={getStrokeColor(patient.probability)}
                          strokeWidth="2"
                          points={getChartPoints()}
                        />
                      </svg>
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Min: {minVal.toFixed(1)}</span>
                        <span>Max: {maxVal.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
