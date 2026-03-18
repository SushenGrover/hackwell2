import { FaTimes } from "react-icons/fa";

const AddPatientModal = ({ onClose, onAdd }) => (
  <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex justify-center items-center z-50 animate-fade-in">
    <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl relative transform scale-95 transition-transform duration-300 ease-out">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-2xl text-slate-400 hover:text-slate-600 transition-colors"
      >
        <FaTimes />
      </button>
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center">
        Add Patient Record
      </h2>
      <form onSubmit={onAdd} className="space-y-6">
        <div>
          <label
            className="block text-slate-700 font-medium mb-1"
            htmlFor="name"
          >
            Patient Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Jane Doe"
            required
            className="border border-slate-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            className="block text-slate-700 font-medium mb-1"
            htmlFor="disease"
          >
            Disease
          </label>
          <input
            type="text"
            id="disease"
            name="disease"
            placeholder="e.g., Pneumonia"
            required
            className="border border-slate-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            className="block text-slate-700 font-medium mb-1"
            htmlFor="age"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="e.g., 45"
            required
            className="border border-slate-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            className="block text-slate-700 font-medium mb-1"
            htmlFor="admissionDate"
          >
            Admission Date
          </label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"
            required
            className="border border-slate-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            className="block text-slate-700 font-medium mb-1"
            htmlFor="file"
          >
            Upload Daily Records (CSV/XLSX)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv,.xlsx"
            required
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AddPatientModal;
