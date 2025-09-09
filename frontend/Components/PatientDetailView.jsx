const PatientDetailView = ({ patient, onClose, getBarColor }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl font-bold text-gray-700"
      >
        &times;
      </button>

      {/* Patient Info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {patient?.name || "Unknown Patient"}
        </h2>
        <p className="text-xl text-gray-600">{patient?.disease || "—"}</p>
        <p className="text-gray-500">
          Age: {patient?.age || "—"} • Admission:{" "}
          {patient?.admissionDate || "—"}
        </p>
      </div>

      {/* Risk Summary + Risk Drivers */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Risk Summary
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg text-gray-600">
              Deterioration Probability:
            </span>
            <span
              className={`text-2xl font-bold ${
                patient?.probability > 75
                  ? "text-red-600"
                  : patient?.probability > 50
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              {patient?.probability ?? 0}%
            </span>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                patient?.probability ?? 0
              )}`}
              style={{ width: `${patient?.probability ?? 0}%` }}
            ></div>
          </div>
        </div>

        {/* Key Risk Drivers */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Key Risk Drivers
          </h3>
          {patient?.key_drivers?.length > 0 ? (
            <ul>
              {patient.key_drivers.map((driver, index) => (
                <li
                  key={index}
                  className="flex items-center mb-2 text-gray-600"
                >
                  <span className="text-xl font-bold text-red-500 mr-2">
                    &uarr;
                  </span>
                  <span className="text-lg">{driver.feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No significant risk drivers identified.
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default PatientDetailView;
