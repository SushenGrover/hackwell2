const AddPatientModal = ({ onClose, onAdd }) => (
  <div className="fixed inset-0 bg-blue-950 bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-2xl text-blue-900 hover:text-red-500"
      >
        &times;
      </button>
      <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">
        Add Patient Record
      </h2>
      <form onSubmit={onAdd} className="space-y-7">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Patient Name
          </label>
          <input
            type="text"
            id="name"
            name="name"   // ✅ must match handler
            placeholder="Patient Name"
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="disease">
            Disease
          </label>
          <input
            type="text"
            id="disease"
            name="disease"  // ✅ must match handler
            placeholder="Disease"
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="age">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"   // ✅ must match handler
            placeholder="Age"
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="admissionDate">
            Admission Date
          </label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"   // ✅ must match handler
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="file">
            Upload Daily Records (CSV/XLSX)
          </label>
          <input 
            type="file"
            id="file"
            name="file"   // ✅ must match handler
            accept=".csv,.xlsx"
            required
            className=" cursor-pointer border p-2"
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AddPatientModal;
