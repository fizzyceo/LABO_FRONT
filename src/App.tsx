import React, { useState } from "react";
import { useEffect } from "react";
import { useToast } from "./hooks/useToast";
import ToastContainer from "./components/ToastContainer";
import Header from "./components/Header";
import AlgorithmLibrary from "./components/AlgorithmLibrary";
import AlgorithmBuilder from "./components/AlgorithmBuilder";
import WebScraper from "./components/WebScraper";
import ExecutionPanel from "./components/ExecutionPanel";
import FloatingActions from "./components/FloatingActions";
import { database } from "./services/database";
import { Algorithm, Workflow } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState("algorithms");
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [editingAlgorithm, setEditingAlgorithm] = useState<Algorithm | null>(
    null
  );
  const toast = useToast();

  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    // Load data from database on app start
    const loadData = async () => {
      const [algorithmsData, workflowsData] = await Promise.all([
        database.getAlgorithms(),
        database.getWorkflows(),
      ]);
      console.log("Loaded algorithms:", algorithmsData);

      setAlgorithms(algorithmsData);
      setWorkflows(workflowsData);
    };

    loadData();
  }, []);

  const handleEditAlgorithm = (algorithm?: Algorithm) => {
    setEditingAlgorithm(algorithm || null);
    setActiveTab("builder");
  };

  const handleAlgorithmSaved = () => {
    setEditingAlgorithm(null);
    setActiveTab("algorithms");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "algorithms":
        return (
          <AlgorithmLibrary
            algorithms={algorithms}
            workflows={workflows}
            setAlgorithms={setAlgorithms}
            setWorkflows={setWorkflows}
            onEditAlgorithm={handleEditAlgorithm}
            toast={toast}
          />
        );
      case "builder":
        return (
          <AlgorithmBuilder
            algorithms={algorithms}
            setAlgorithms={setAlgorithms}
            editingAlgorithm={editingAlgorithm}
            onAlgorithmSaved={handleAlgorithmSaved}
            toast={toast}
          />
        );
      case "scraper":
        return <WebScraper />;
      case "execution":
        return <ExecutionPanel algorithms={algorithms} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 overflow-x-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      <FloatingActions
        onQuickBuilder={() => setActiveTab("builder")}
        onQuickRun={() => setActiveTab("execution")}
      />
      
      <ToastContainer toasts={toast.toasts} onRemoveToast={toast.removeToast} />
    </div>
  );
}

export default App;
