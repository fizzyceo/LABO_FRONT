import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Algorithm } from '../types';

interface WorkflowFormProps {
  algorithms: Algorithm[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ algorithms, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['']);

  const addAlgorithmSelect = () => {
    setSelectedAlgorithms([...selectedAlgorithms, '']);
  };

  const removeAlgorithmSelect = (index: number) => {
    setSelectedAlgorithms(selectedAlgorithms.filter((_, i) => i !== index));
  };

  const updateAlgorithmSelect = (index: number, value: string) => {
    const updated = [...selectedAlgorithms];
    updated[index] = value;
    setSelectedAlgorithms(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const algorithmOrder = selectedAlgorithms
      .filter(id => id !== '')
      .map(id => parseInt(id));

    if (algorithmOrder.length === 0) {
      alert('Please select at least one algorithm');
      return;
    }

    onSubmit({ name, algorithmOrder });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Workflow Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          placeholder="Enter workflow name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Select Analysis (in order)
        </label>
        
        <div className="space-y-3">
          {selectedAlgorithms.map((selectedId, index) => (
            <div key={index} className="flex gap-3 items-center">
              <select
                value={selectedId}
                onChange={(e) => updateAlgorithmSelect(index, e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select algorithm...</option>
                {algorithms.map((algorithm) => (
                  <option key={algorithm.id} value={algorithm.id}>
                    {algorithm.name}
                  </option>
                ))}
              </select>
              
              {selectedAlgorithms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAlgorithmSelect(index)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addAlgorithmSelect}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors mt-3"
        >
          <Plus className="w-4 h-4" />
          Add Analysis
        </button>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          Save Workflow
        </button>
      </div>
    </form>
  );
};

export default WorkflowForm;