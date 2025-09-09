import { FaTrash } from "react-icons/fa";

const PatientCard = ({ patient, onSelect, onDelete, getCardColor, getBarColor }) => (
  <div
    className="p-5 flex flex-col gap-1 rounded-xl shadow-md border-2 transition hover:shadow-lg"
    style={{ backgroundColor: getCardColor(patient.probability), borderColor: patient.probability > 75 ? "#dc2626" : patient.probability > 50 ? "#f97316" : "#22c55e" }}
  >
    <h4 className="font-bold text-blue-900 text-lg">Name: {patient.name}</h4>
    <div className="text-gray-700 text-sm">Age: {patient.age}</div>
    <div className="text-gray-700 text-sm">Admission Date: {patient.admissionDate}</div>
    <div className="text-gray-700 text-sm">Disease: {patient.disease}</div>
    <div className={`mt-2 font-semibold ${
      patient.probability > 75
        ? "text-red-600"
        : patient.probability > 50
        ? "text-orange-500"
        : "text-green-600"
    }`}>
      Risk of Deterioration: {patient.probability}%
    </div>
    <div className="mt-3 flex justify-between items-center">
      <button
        onClick={() => onSelect(patient)}
        className="text-blue-600 hover:underline text-sm font-semibold"
      >
        View Details
      </button>
      <button
        onClick={() => onDelete(patient.id)}
        className="text-red-600 hover:text-red-800 text-sm"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

export default PatientCard;
