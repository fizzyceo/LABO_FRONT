import React, { useState } from 'react';
import { Plus, Calendar, Settings, Trash2 } from 'lucide-react';
import { Algorithm, Workflow } from '../types';
import { database } from '../services/database';
import Modal from './Modal';
import AlgorithmForm from './AlgorithmForm';
import WorkflowForm from './WorkflowForm';

interface AlgorithmLibraryProps {
  algorithms: Algorithm[];
  workflows: Workflow[];
  setAlgorithms: (algorithms: Algorithm[]) => void;
  setWorkflows: (workflows: Workflow[]) => void;
  onEditAlgorithm: (algorithm?: Algorithm) => void;
}

const AlgorithmLibrary: React.FC<AlgorithmLibraryProps> = ({
  algorithms,
  workflows,
  setAlgorithms,
  setWorkflows,
  onEditAlgorithm,
}) => {
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  const handleCreateAlgorithm = (algorithmData: any) => {
    const newAlgorithm: Algorithm = {
      id: 0, // Let the server assign the ID
      name: algorithmData.name,
      description: algorithmData.description,
      parameters: [],
      action: 'validate',
      globalParameters: [],
      created: new Date(),
      lastModified: new Date(),
    };
    
    database.saveAlgorithm(newAlgorithm).then(() => {
      database.getAlgorithms().then(setAlgorithms);
      setShowAlgorithmModal(false);
      onEditAlgorithm(newAlgorithm);
    }).catch(error => {
      console.error('Error creating algorithm:', error);
      alert('Error creating algorithm');
    });
  };

  const handleCreateWorkflow = (workflowData: any) => {
    const newWorkflow: Workflow = {
      id: 0, // Let the server assign the ID
      name: workflowData.name,
      algorithmOrder: workflowData.algorithmOrder,
      created: new Date(),
    };
    
    database.saveWorkflow(newWorkflow).then(() => {
      database.getWorkflows().then(setWorkflows);
      setShowWorkflowModal(false);
    }).catch(error => {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow');
    });
  };

  const handleDeleteAlgorithm = async (algorithm: Algorithm, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${algorithm.name}"?`)) {
      try {
        await database.deleteAlgorithm(algorithm.id);
        const updatedAlgorithms = await database.getAlgorithms();
        setAlgorithms(updatedAlgorithms);
      } catch (error) {
        console.error('Error deleting algorithm:', error);
        alert('Error deleting algorithm');
      }
    }
  };

  const handleDeleteWorkflow = async (workflow: Workflow, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      try {
        await database.deleteWorkflow(workflow.id);
        const updatedWorkflows = await database.getWorkflows();
        setWorkflows(updatedWorkflows);
      } catch (error) {
        console.error('Error deleting workflow:', error);
        alert('Error deleting workflow');
      }
    }
  };

   const handleDuplicateAlgorithm = async (algorithm: Algorithm, event: React.MouseEvent) => {
     event.stopPropagation();
     
     const duplicatedAlgorithm: Algorithm = {
       ...algorithm,
       id: undefined, // Remove ID so it creates a new one
       name: `${algorithm.name} (Copy)`,
       created: new Date(),
       lastModified: new Date(),
     };
     
     try {
       await database.saveAlgorithm(duplicatedAlgorithm);
       const updatedAlgorithms = await database.getAlgorithms();
       setAlgorithms(updatedAlgorithms);
     } catch (error) {
       console.error('Error duplicating algorithm:', error);
       alert('Error duplicating algorithm');
     }
   };
  return (
    <div className="space-y-8">
      {/* Algorithm Library */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Analysis Library</h2>
          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            New Analysis
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-400 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="text-lg font-semibold text-gray-800 flex-1 cursor-pointer"
                  onClick={() => onEditAlgorithm(algorithm)}
                >
                  {algorithm.name}
                </h3>
                <button
                  onClick={(e) => handleDeleteAlgorithm(algorithm, e)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  title="Delete algorithm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div onClick={() => onEditAlgorithm(algorithm)}>
              <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{algorithm.parameters?.reduce((total, param) => total + (param.subParameters?.length || 0), 0) || 0} sub-parameters</span>
                <span className="capitalize">Action: {algorithm.action}</span>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Library */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Workflow Library</h2>
          <button
            onClick={() => setShowWorkflowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => {
            const algorithmNames = workflow.algorithmOrder
              .map((id) => {
                const alg = algorithms.find((a) => a.id === id);
                return alg ? alg.name : '(Deleted)';
              })
              .join(' → ');

            return (
              <div
                key={workflow.id}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-teal-400 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-semibold text-gray-800 flex-1">
                   {algorithm.name}
                 </h3>
                 <div className="flex gap-1">
                   <button
                     onClick={(e) => handleDuplicateAlgorithm(algorithm, e)}
                     className="p-1 text-blue-500 hover:bg-blue-100 rounded transition-colors"
                     title="Duplicate algorithm"
                   >
                     <Settings className="w-4 h-4" />
                   </button>
                   <button
                     onClick={(e) => handleDeleteAlgorithm(algorithm, e)}
                     className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                     title="Delete algorithm"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
               <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
               <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                 <span>{algorithm.parameters?.reduce((total, param) => total + (param.subParameters?.length || 0), 0) || 0} sub-parameters</span>
                 <span className="capitalize">Action: {algorithm.action}</span>
               </div>
               <div className="flex gap-2">
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onEditAlgorithm(algorithm);
                   }}
                   className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors text-sm"
                 >
                   Edit
                 </button>
                 <button
                   onClick={(e) => handleDuplicateAlgorithm(algorithm, e)}
                   className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors text-sm"
                 >
                   Duplicate
                 </button>
               </div>
          })}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
        title="Create New Algorithm"
      >
        <AlgorithmForm
          onSubmit={handleCreateAlgorithm}
          onCancel={() => setShowAlgorithmModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showWorkflowModal}
        onClose={() => setShowWorkflowModal(false)}
        title="Create New Workflow"
      >
        <WorkflowForm
          algorithms={algorithms}
          onSubmit={handleCreateWorkflow}
          onCancel={() => setShowWorkflowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default AlgorithmLibrary;