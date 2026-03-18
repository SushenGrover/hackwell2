import { useState } from "react";

const FileUploadTester = () => {
  const [file, setFile] = useState(null);
  const [probability, setProbability] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProbability(data.probability_of_deterioration);
    } catch (error) {
      console.error("Error during file upload test:", error);
      setProbability(null);
    }
  };

  return (
    <div className="mt-6 p-8 bg-white rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-slate-800 mb-5">
        Test Risk Prediction
      </h3>
      <div className="mb-6">
        <label
          htmlFor="file-upload-test"
          className="block text-slate-700 font-medium mb-2"
        >
          Select a patient record file:
        </label>
        <input
          type="file"
          id="file-upload-test"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
      >
        Get Risk Probability
      </button>
      {probability !== null && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-lg font-semibold text-blue-800 animate-fade-in-up">
          Probability of Deterioration: {(probability * 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default FileUploadTester;
