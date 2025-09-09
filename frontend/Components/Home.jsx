import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PatientCard from "./PatientCard";
import PatientDetailView from "./PatientDetailView";
import AddPatientModal from "./AddPatientModal";
import FileUploadTester from "./FileUploadTester";

const Home = () => {
  const [patients, setPatients] = useState([]);
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
    prob > 75 ? "rgba(220, 38, 38, 0.1)" : prob > 50 ? "rgba(234, 88, 12, 0.1)" : "rgba(34, 197, 94, 0.1)";
  const getBarColor = (prob) =>
    prob > 75 ? "bg-red-600" : prob > 50 ? "bg-orange-500" : "bg-green-600";

  const handleAddPatient = async (event) => {
  event.preventDefault();
  const form = event.target;
  const file = form.file.files[0];

  if (!file) {
    alert("Please upload a CSV/XLSX file.");
    return;
  }

  try {
    // Prepare form data for backend
    const formData = new FormData();
    formData.append("file", file);

    // Call Flask backend
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to get prediction");
    const data = await res.json();

    const probability = (data.probability_of_deterioration * 100).toFixed(2);

    // Build new patient object
    const newPatient = {
      id: Date.now(),
      name: form.name.value,
      disease: form.disease.value,
      age: form.age.value,
      admissionDate: form.admissionDate.value,
      probability: parseFloat(probability),
    };

    // Save to localStorage
    const updatedPatients = [...patients, newPatient].sort(
      (a, b) => b.probability - a.probability
    );
    localStorage.setItem("patients", JSON.stringify(updatedPatients));

    // Update state
    setPatients(updatedPatients);

    // Reset + close modal
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
  };

  const visiblePatients = showAll ? patients : patients.slice(0, 10);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="w-full p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-blue-900">City Hospital AI Risk Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, Dr. Smith</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-700 text-white py-3 px-8 rounded-xl">
            + Add Patient Record
          </button>
        </header>

        {/* Tab Content */}
        {activeTab === "dashboard" && <div>Welcome to the Dashboard</div>}

        {activeTab === "patients" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{showAll ? "All Patients" : "Top 10 High-Risk Patients"}</h2>
              <button onClick={() => setShowAll(!showAll)} className="text-blue-600">
                {showAll ? "Show Top 10" : "Show All"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePatients.map((p) => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  onSelect={setSelectedPatient}
                  onDelete={handleDeletePatient}
                  getCardColor={getCardColor}
                  getBarColor={getBarColor}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-5">Upload Patient Records</h2>
            <FileUploadTester />
          </div>
        )}

        {showModal && <AddPatientModal onClose={() => setShowModal(false)} onAdd={handleAddPatient} />}
        {selectedPatient && (
          <PatientDetailView patient={selectedPatient} onClose={() => setSelectedPatient(null)} getBarColor={getBarColor} />
        )}
      </main>
    </div>
  );
};

export default Home;
