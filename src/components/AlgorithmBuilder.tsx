import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, RotateCcw, Settings, Globe } from "lucide-react";
import { Algorithm, Parameter } from "../types";
import {
  parameterDefinitions,
  algorithmTemplates,
} from "../data/parameterDefinitions";
import { globalParameters } from "../data/globalParameters";
import { database } from "../services/database";
import ParameterConfigForm from "./ParameterConfigForm";
import GlobalParametersForm from "./GlobalParametersForm";

interface AlgorithmBuilderProps {
  algorithms: Algorithm[];
  setAlgorithms: (algorithms: Algorithm[]) => void;
  editingAlgorithm?: Algorithm | null;
  onAlgorithmSaved?: () => void;
}

const AlgorithmBuilder: React.FC<AlgorithmBuilderProps> = ({
  algorithms,
  setAlgorithms,
  editingAlgorithm,
  onAlgorithmSaved,
}) => {
  const [currentAlgorithmId, setCurrentAlgorithmId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: "", label: "", subParameters: [{ param: "", config: { type: "exact", required: false } }] },
  ]);
  const [action, setAction] = useState<"validate" | "expert" | "conditional">(
    "validate"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [globalParameterValues, setGlobalParameterValues] = useState(
    globalParameters.map((p) => ({ name: p.name, value: p.defaultValue }))
  );

  // Load algorithm data when editing
  useEffect(() => {
    if (editingAlgorithm) {
      setCurrentAlgorithmId(typeof editingAlgorithm.id === 'string' ? editingAlgorithm.id : null);
      setName(editingAlgorithm.name);
      setDescription(editingAlgorithm.description);
      setParameters(editingAlgorithm.parameters && editingAlgorithm.parameters.length > 0 
        ? editingAlgorithm.parameters 
        : [{ name: "", label: "", subParameters: [{ param: "", config: { type: "exact", required: false } }] }]);
      setAction(editingAlgorithm.action);
      setGlobalParameterValues(editingAlgorithm.globalParameters && editingAlgorithm.globalParameters.length > 0
        ? editingAlgorithm.globalParameters
        : globalParameters.map((p) => ({ name: p.name, value: p.defaultValue })));
    } else {
      // Clear form when not editing
      clearBuilder();
    }
  }, [editingAlgorithm]);

  const globalParametersList = parameterDefinitions.filter((p) => p.isGlobal);
  const specificParameters = parameterDefinitions.filter((p) => !p.isGlobal);

  const addParameter = () => {
    setParameters([
      ...parameters,
      {
        name: "",
        label: "",
        subParameters: [{ param: "", config: { type: "exact", required: false } }],
      },
    ]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const applyTemplate = (templateKey: string) => {
    if (!templateKey || templateKey === "") return;

    const template =
      algorithmTemplates[templateKey as keyof typeof algorithmTemplates];
    if (!template) return;

    setParameters([...template.defaultParameters]);
  };

  const clearBuilder = () => {
    setCurrentAlgorithmId(null);
    setName("");
    setDescription("");
    setParameters([{ name: "", label: "", subParameters: [{ param: "", config: { type: "exact", required: false } }] }]);
    setAction("validate");
    setSelectedTemplate("");
    setGlobalParameterValues(
      globalParameters.map((p) => ({ name: p.name, value: p.defaultValue }))
    );
  };

  const saveAlgorithm = () => {
    if (!name.trim()) {
      alert("Please enter an algorithm name");
      return;
    }

    // Filter out empty parameters but keep structure
    const validParameters = parameters.filter(p => p.name.trim() !== '').map(p => ({
      ...p,
      subParameters: p.subParameters.filter(sp => sp.param.trim() !== '')
    }));

    const algorithmToSave: Algorithm = {
      name,
      description,
      parameters: validParameters,
      action,
      globalParameters: globalParameterValues,
      created: new Date(),
      lastModified: new Date(),
    };
    
    // Only include ID if we're editing an existing algorithm
    if (currentAlgorithmId && currentAlgorithmId !== 0 && typeof currentAlgorithmId === 'string') {
      algorithmToSave.id = currentAlgorithmId;
      algorithmToSave.created = editingAlgorithm?.created || new Date();
    }

    console.log('Saving algorithm:', algorithmToSave);

    database
      .saveAlgorithm(algorithmToSave)
      .then(() => {
        return database.getAlgorithms();
      })
      .then(setAlgorithms)
      .then(() => {
        clearBuilder();
        alert(currentAlgorithmId ? "Algorithm updated successfully!" : "Algorithm created successfully!");
        if (onAlgorithmSaved) {
          onAlgorithmSaved();
        }
      })
      .catch((error) => {
        console.error("Error saving algorithm:", error);
        alert(`Error saving algorithm: ${error.message}`);
      });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentAlgorithmId ? 'Edit Algorithm' : 'Algorithm Builder'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={clearBuilder}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={saveAlgorithm}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            <Save className="w-4 h-4" />
            Save Algorithm
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Algorithm Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            placeholder="Enter algorithm name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Algorithm Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              applyTemplate(e.target.value);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="">Select a template...</option>
            <option value="blood">Blood Analysis</option>
            <option value="urine">Urine Analysis</option>
            <option value="biochemistry">Biochemistry</option>
            <option value="hematology">Hematology</option>
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            placeholder="Describe the algorithm purpose"
          />
        </div>

        <GlobalParametersForm
          values={globalParameterValues}
          onChange={setGlobalParameterValues}
        />

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Analysis Parameters
          </h3>

          <div className="space-y-4">
            {parameters.map((parameter, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg border-2 border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parameter Name
                      </label>
                      <input
                        type="text"
                        value={parameter.name}
                        onChange={(e) => {
                          const updated = [...parameters];
                          updated[index] = {
                            ...updated[index],
                            name: e.target.value,
                          };
                          setParameters(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., globule_rouge"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={parameter.label}
                        onChange={(e) => {
                          const updated = [...parameters];
                          updated[index] = {
                            ...updated[index],
                            label: e.target.value,
                          };
                          setParameters(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., Globule Rouge"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeParameter(index)}
                    className="ml-4 p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Sub-Parameters
                  </h4>
                  <div className="space-y-3">
                    {parameter.subParameters.map((subParam, subIndex) => (
                      <div
                        key={subIndex}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-end">
                          <div className="lg:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Parameter
                            </label>
                            <select
                              value={subParam.param}
                              onChange={(e) => {
                                // Update the parameter and reset config if parameter type changes
                                const paramDef = specificParameters.find(p => p.name === e.target.value);
                                let newConfig = subParam.config;
                                
                                // For interparameter, populate options with available parameters
                                if (e.target.value === 'interparameter') {
                                  const availableParams = parameters
                                    .filter(p => p.name && p.name !== parameter.name)
                                    .map(p => p.name);
                                  newConfig = {
                                    type: 'exact',
                                    value: availableParams[0] || '',
                                    required: false
                                  };
                                }
                                
                                const updated = [...parameters];
                                updated[index].subParameters[subIndex] = {
                                  ...updated[index].subParameters[subIndex],
                                  param: e.target.value,
                                  config: newConfig
                                };
                                setParameters(updated);
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                            >
                              <option value="">Select...</option>
                              {specificParameters.map((param) => (
                                <option key={param.name} value={param.name}>
                                  {param.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Configuration
                            </label>
                            {subParam.config && (
                              <ParameterConfigForm
                                config={subParam.config}
                                onChange={(config) => {
                                  const updated = [...parameters];
                                  updated[index].subParameters[subIndex] = {
                                    ...updated[index].subParameters[subIndex],
                                    config,
                                  };
                                  setParameters(updated);
                                }}
                                parameterType={subParam.param}
                                availableParameters={parameters
                                  .filter(p => p.name && p.name !== parameter.name)
                                  .map(p => p.name)
                                }
                              />
                            )}
                          </div>

                          <button
                            onClick={() => {
                              const updated = [...parameters];
                              updated[index].subParameters = updated[
                                index
                              ].subParameters.filter((_, i) => i !== subIndex);
                              setParameters(updated);
                            }}
                            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const updated = [...parameters];
                      updated[index].subParameters.push({
                        param: "",
                        config: { type: "exact", required: false },
                      });
                      setParameters(updated);
                    }}
                    className="mt-3 flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Add Sub-Parameter
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addParameter}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors mt-4"
          >
            <Plus className="w-4 h-4" />
            Add Analysis Parameter
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Final Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="validate">Auto Validate</option>
            <option value="expert">Call Expert</option>
            <option value="conditional">Conditional</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmBuilder;