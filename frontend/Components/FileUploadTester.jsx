import { useState } from "react";

const FileUploadTester = () => {
  const [file, setFile] = useState(null);
  const [probability, setProbability] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/predict", { method: "POST", body: formData });
    const data = await res.json();
    setProbability(data.probability_of_deterioration);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Test Risk Prediction</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded">
        Get Risk Probability
      </button>
      {probability !== null && (
        <div className="mt-4 text-lg font-semibold text-blue-900">
          Probability of Deterioration: {(probability * 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default FileUploadTester;
