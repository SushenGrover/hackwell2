import { FaTrash, FaArrowRight } from "react-icons/fa";

const PatientCard = ({
  patient,
  onSelect,
  onDelete,
  getCardColor,
  getBorderColor,
  getTextColor,
}) => (
  <div
    className="p-6 flex flex-col gap-2 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
    style={{
      backgroundColor: getCardColor(patient.probability),
      borderColor: getBorderColor(patient.probability),
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-bold text-slate-800 text-lg">{patient.name}</h4>
      <div
        className={`text-sm font-semibold px-3 py-1 rounded-full ${getTextColor(
          patient.probability
        )} bg-white shadow-sm`}
      >
        {patient.probability}%
      </div>
    </div>

    <div className="space-y-1 text-sm text-slate-600">
      <p>
        <span className="font-medium">Age:</span> {patient.age}
      </p>
      <p>
        <span className="font-medium">Admission Date:</span>{" "}
        {patient.admissionDate}
      </p>
      <p>
        <span className="font-medium">Disease:</span> {patient.disease}
      </p>
    </div>

    <div className="mt-4 flex justify-between items-center border-t border-slate-200 pt-4">
      <button
        onClick={() => onSelect(patient)}
        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200 font-semibold text-sm"
      >
        View Details <FaArrowRight className="ml-2 text-xs" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents card selection on delete click
          onDelete(patient.id);
        }}
        className="text-red-500 hover:text-red-700 transition duration-200"
        title="Delete Patient"
      >
        <FaTrash className="text-base" />
      </button>
    </div>
  </div>
);

export default PatientCard;
