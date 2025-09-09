import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PatientCard from "./PatientCard";
import PatientDetailView from "./PatientDetailView";
import AddPatientModal from "./AddPatientModal";
import FileUploadTester from "./FileUploadTester";
import Dashboard from "./Dashboard";

const Home = () => {
  const [patients, setPatients] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients") || "[]");
    stored.sort((a, b) => b.probability - a.probability);
    setPatients(stored);
  }, []);

  const getCardColor = (prob) =>
    prob > 75
      ? "rgba(255, 235, 238, 0.7)"
      : prob > 50
      ? "rgba(255, 248, 225, 0.7)"
      : "rgba(232, 245, 233, 0.7)";
  const getBorderColor = (prob) =>
    prob > 75 ? "#EF4444" : prob > 50 ? "#F97316" : "#22C55E";
  const getTextColor = (prob) =>
    prob > 75
      ? "text-red-500"
      : prob > 50
      ? "text-orange-500"
      : "text-green-500";
  const getBarColor = (prob) =>
    prob > 75 ? "bg-red-600" : prob > 50 ? "bg-orange-500" : "bg-green-600";
  const getStrokeColor = (prob) =>
    prob > 75 ? "#dc2626" : prob > 50 ? "#f97316" : "#16a34a";

  const handleAddPatient = async (event) => {
    event.preventDefault();
    const form = event.target;
    const file = form.file.files[0];

    if (!file) {
      alert("Please upload a CSV/XLSX file.");
      return;
    }

    try {
      const reader = new FileReader();
      const filePromise = new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
      const fileContent = await filePromise;

      const lines = fileContent.trim().split("\n");
      const headers = lines[0].split(",").map((header) => header.trim());
      const dailyRecords = lines.slice(1).map((line) => {
        const values = line.split(",").map((val) => parseFloat(val.trim()));
        let record = {};
        headers.forEach((header, i) => {
          record[header] = values[i];
        });
        return record;
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to get prediction");
      const data = await res.json();

      const probability = (data.probability_of_deterioration * 100).toFixed(2);

      const newPatient = {
        id: Date.now(),
        name: form.name.value,
        disease: form.disease.value,
        age: form.age.value,
        admissionDate: form.admissionDate.value,
        probability: parseFloat(probability),
        daily_records: dailyRecords,
      };

      const updatedPatients = [...patients, newPatient].sort(
        (a, b) => b.probability - a.probability
      );
      localStorage.setItem("patients", JSON.stringify(updatedPatients));

      setPatients(updatedPatients);

      form.reset();
      setShowModal(false);
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient. Please try again.");
    }
  };

  const handleDeletePatient = (id) => {
    const filtered = patients.filter((p) => p.id !== id);
    localStorage.setItem("patients", JSON.stringify(filtered));
    setPatients(filtered);
    if (selectedPatient && selectedPatient.id === id) {
      setSelectedPatient(null);
    }
  };

  const visiblePatients = patients
    ? showAll
      ? patients
      : patients.slice(0, 10)
    : [];

  return (
    <div className="flex bg-gray-100 min-h-screen font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="w-full p-8 md:p-12 transition-all duration-300">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800">
              City Hospital AI Risk Dashboard
            </h1>
            <p className="text-slate-500 mt-2">Welcome back, Dr. Smith.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
          >
            + Add Patient Record
          </button>
        </header>

        {patients && activeTab === "dashboard" && (
          <Dashboard patients={patients} />
        )}
        {patients && activeTab === "patients" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">
                {showAll ? "All Patients" : "Top 10 High-Risk Patients"}
              </h2>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
              >
                {showAll ? "Show Top 10" : "Show All"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePatients.length > 0 ? (
                visiblePatients.map((p) => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    onSelect={setSelectedPatient}
                    onDelete={handleDeletePatient}
                    getCardColor={getCardColor}
                    getBorderColor={getBorderColor}
                    getTextColor={getTextColor}
                  />
                ))
              ) : (
                <p className="text-slate-500 text-center col-span-full">
                  No patient records found. Start by adding a new record!
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-5">
              Upload Patient Records
            </h2>
            <FileUploadTester />
          </div>
        )}

        {showModal && (
          <AddPatientModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddPatient}
          />
        )}
        {selectedPatient && (
          <PatientDetailView
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
            getBarColor={getBarColor}
            getTextColor={getTextColor}
            getStrokeColor={getStrokeColor} // Pass the new function here
          />
        )}
      </main>
    </div>
  );
};

export default Home;
