import React from 'react';
import { ParameterConfig } from '../types';

interface ParameterConfigFormProps {
  config: ParameterConfig;
  onChange: (config: ParameterConfig) => void;
  parameterType: string;
}

const ParameterConfigForm: React.FC<ParameterConfigFormProps> = ({
  config,
  onChange,
  parameterType
}) => {
  const updateConfig = (updates: Partial<ParameterConfig>) => {
    onChange({ ...config, ...updates });
  };

  const renderConfigFields = () => {
    switch (config.type) {
      case 'range':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Value
              </label>
              <input
                type="number"
                value={config.min || ''}
                onChange={(e) => updateConfig({ min: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Value
              </label>
              <input
                type="number"
                value={config.max || ''}
                onChange={(e) => updateConfig({ max: parseFloat(e.target.value) || 100 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                placeholder="100"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Unit (optional)
              </label>
              <input
                type="text"
                value={config.unit || ''}
                onChange={(e) => updateConfig({ unit: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., g/L, mg/dL"
              />
            </div>
          </div>
        );

      case 'exact':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Expected Value
            </label>
            <input
              type="text"
              value={config.value || ''}
              onChange={(e) => updateConfig({ value: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
              placeholder="Enter exact value"
            />
          </div>
        );

      case 'contains':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Must Contain
            </label>
            <input
              type="text"
              value={config.value || ''}
              onChange={(e) => updateConfig({ value: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
              placeholder="e.g., normal, pass"
            />
          </div>
        );

      case 'list':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Allowed Values (comma-separated)
            </label>
            <input
              type="text"
              value={config.options?.join(', ') || ''}
              onChange={(e) => updateConfig({ 
                options: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
              placeholder="option1, option2, option3"
            />
          </div>
        );

      case 'boolean':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Expected Value
            </label>
            <select
              value={config.value?.toString() || 'true'}
              onChange={(e) => updateConfig({ value: e.target.value === 'true' })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Validation Type
        </label>
        <select
          value={config.type}
          onChange={(e) => updateConfig({ type: e.target.value as any })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
        >
          <option value="range">Range (min-max)</option>
          <option value="exact">Exact Match</option>
          <option value="contains">Contains Text</option>
          <option value="list">From List</option>
          <option value="boolean">True/False</option>
        </select>
      </div>

      {renderConfigFields()}

      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${parameterType}`}
          checked={config.required || false}
          onChange={(e) => updateConfig({ required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${parameterType}`} className="text-xs text-gray-600">
          Required parameter
        </label>
      </div>
    </div>
  );
};

export default ParameterConfigForm;