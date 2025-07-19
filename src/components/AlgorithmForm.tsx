import React, { useState } from 'react';
import { algorithmTemplates } from '../data/parameterDefinitions';

interface AlgorithmFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AlgorithmForm: React.FC<AlgorithmFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('blank');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an algorithm name');
      return;
    }
    onSubmit({ name, template, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Algorithm Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          placeholder="Enter algorithm name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Template
        </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
        >
          <option value="blank">Blank Algorithm</option>
          {Object.entries(algorithmTemplates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          placeholder="Describe the algorithm"
        />
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
          Create Analysis
        </button>
      </div>
    </form>
  );
};

export default AlgorithmForm;