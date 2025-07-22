import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Algorithm } from '../types';
import Modal from './Modal';

interface DuplicateAlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: Algorithm | null;
  onDuplicate: (name: string) => void;
}

const DuplicateAlgorithmModal: React.FC<DuplicateAlgorithmModalProps> = ({
  isOpen,
  onClose,
  algorithm,
  onDuplicate,
}) => {
  const [name, setName] = useState('');

  React.useEffect(() => {
    if (algorithm && isOpen) {
      setName(`${algorithm.name} (Copy)`);
    }
  }, [algorithm, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    onDuplicate(name.trim());
    onClose();
    setName('');
  };

  const handleClose = () => {
    onClose();
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Duplicate Algorithm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Original Algorithm
          </label>
          <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
            {algorithm?.name || 'No algorithm selected'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Algorithm Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            placeholder="Enter new algorithm name"
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            <Copy className="w-4 h-4" />
            Duplicate Algorithm
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DuplicateAlgorithmModal;