import React, { useState } from 'react';
import { Plus, Calendar, Settings, Trash2, Copy, MoreVertical } from 'lucide-react';
import { Algorithm, Workflow } from '../types';
import { database } from '../services/database';
import { useToast } from '../hooks/useToast';
import Modal from './Modal';
import AlgorithmForm from './AlgorithmForm';
import WorkflowForm from './WorkflowForm';
import DuplicateAlgorithmModal from './DuplicateAlgorithmModal';

interface AlgorithmLibraryProps {
  algorithms: Algorithm[];
  workflows: Workflow[];
  setAlgorithms: (algorithms: Algorithm[]) => void;
  setWorkflows: (workflows: Workflow[]) => void;
  onEditAlgorithm: (algorithm?: Algorithm) => void;
  toast: ReturnType<typeof useToast>;
}

const AlgorithmLibrary: React.FC<AlgorithmLibraryProps> = ({
  algorithms,
  workflows,
  setAlgorithms,
  setWorkflows,
  onEditAlgorithm,
  toast,
}) => {
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [algorithmToDuplicate, setAlgorithmToDuplicate] = useState<Algorithm | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleCreateAlgorithm = (algorithmData: any) => {
    const newAlgorithm: Algorithm = {
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
      toast.showSuccess('Algorithm Created', 'New algorithm has been created successfully');
    }).catch(error => {
      console.error('Error creating algorithm:', error);
      toast.showError('Creation Failed', 'Failed to create algorithm. Please try again.');
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
      toast.showSuccess('Workflow Created', 'New workflow has been created successfully');
    }).catch(error => {
      console.error('Error creating workflow:', error);
      toast.showError('Creation Failed', 'Failed to create workflow. Please try again.');
    });
  };

  const handleDeleteAlgorithm = async (algorithm: Algorithm, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${algorithm.name}"?`)) {
      try {
        await database.deleteAlgorithm(algorithm.id);
        const updatedAlgorithms = await database.getAlgorithms();
        setAlgorithms(updatedAlgorithms);
        toast.showSuccess('Algorithm Deleted', `"${algorithm.name}" has been deleted successfully`);
      } catch (error) {
        console.error('Error deleting algorithm:', error);
        toast.showError('Deletion Failed', 'Failed to delete algorithm. Please try again.');
      }
    }
  };

  const handleDeleteWorkflow = async (workflow: Workflow, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      try {
        await database.deleteWorkflow(workflow.id);
        const updatedWorkflows = await database.getWorkflows();
        setWorkflows(updatedWorkflows);
        toast.showSuccess('Workflow Deleted', `"${workflow.name}" has been deleted successfully`);
      } catch (error) {
        console.error('Error deleting workflow:', error);
        toast.showError('Deletion Failed', 'Failed to delete workflow. Please try again.');
      }
    }
  };

  const handleDuplicateAlgorithm = async (customName: string) => {
    if (!algorithmToDuplicate) return;
    
    const duplicatedAlgorithm: Algorithm = {
      ...algorithmToDuplicate,
      id: undefined, // Remove ID so it creates a new one
      name: customName,
      created: new Date(),
      lastModified: new Date(),
    };
    
    try {
      await database.saveAlgorithm(duplicatedAlgorithm);
      const updatedAlgorithms = await database.getAlgorithms();
      setAlgorithms(updatedAlgorithms);
      toast.showSuccess('Algorithm Duplicated', `"${duplicatedAlgorithm.name}" has been created successfully`);
    } catch (error) {
      console.error('Error duplicating algorithm:', error);
      toast.showError('Duplication Failed', 'Failed to duplicate algorithm. Please try again.');
    }
  };

  const openDuplicateModal = (algorithm: Algorithm, event: React.MouseEvent) => {
    event.stopPropagation();
    setAlgorithmToDuplicate(algorithm);
    setShowDuplicateModal(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (algorithmId: string | number | undefined, event: React.MouseEvent) => {
    event.stopPropagation();
    const id = algorithmId?.toString() || '';
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(algorithm.id, e)}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openDropdown === algorithm.id?.toString() && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                      <button
                        onClick={(e) => openDuplicateModal(algorithm, e)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => handleDeleteAlgorithm(algorithm, e)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div onClick={() => onEditAlgorithm(algorithm)}>
              <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {algorithm.parameters && Array.isArray(algorithm.parameters) 
                    ? algorithm.parameters.reduce((total, param) => {
                        return total + (param.subParameters && Array.isArray(param.subParameters) ? param.subParameters.length : 0);
                      }, 0)
                    : 0} sub-parameters
                </span>
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
                    {workflow.name}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteWorkflow(workflow, e)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                    title="Delete workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{algorithmNames}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{workflow.algorithmOrder.length} algorithms</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {workflow.created.toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
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

      <DuplicateAlgorithmModal
        isOpen={showDuplicateModal}
        onClose={() => {
          setShowDuplicateModal(false);
          setAlgorithmToDuplicate(null);
        }}
        algorithm={algorithmToDuplicate}
        onDuplicate={handleDuplicateAlgorithm}
      />
    </div>
  );
};

export default AlgorithmLibrary;