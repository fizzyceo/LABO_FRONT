import React from "react";
import { GlobalParameterValue } from "../types";
import { globalParameters } from "../data/globalParameters";

interface GlobalParametersFormProps {
  values: GlobalParameterValue[];
  onChange: (values: GlobalParameterValue[]) => void;
}

const GlobalParametersForm: React.FC<GlobalParametersFormProps> = ({
  values,
  onChange,
}) => {
  const updateValue = (name: string, value: any) => {
    const updated = values.map((v) => (v.name === name ? { ...v, value } : v));

    // Add parameter if it doesn't exist
    if (!updated.find((v) => v.name === name)) {
      updated.push({ name, value });
    }

    onChange(updated);
  };

  const getValue = (name: string) => {
    const param = values.find((v) => v.name === name);
    if (param) return param.value;

    const globalParam = globalParameters.find((p) => p.name === name);
    return globalParam?.defaultValue || "";
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Global Parameters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {globalParameters.map((param) => (
          <div
            key={param.name}
            className="bg-white p-4 rounded-lg border border-blue-200"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.label}
            </label>

            {param.name === "patient_age" ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Min Age
                  </label>
                  <input
                    type="number"
                    value={getValue(`${param.name}_min`)}
                    onChange={(e) =>
                      updateValue(
                        `${param.name}_min`,
                        parseInt(e.target.value) || param.min
                      )
                    }
                    min={param.min}
                    max={param.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Max Age
                  </label>
                  <input
                    type="number"
                    value={getValue(`${param.name}_max`)}
                    onChange={(e) =>
                      updateValue(
                        `${param.name}_max`,
                        parseInt(e.target.value) || param.max
                      )
                    }
                    min={param.min}
                    max={param.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : param.type === "range" ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={getValue(param.name)}
                  onChange={(e) =>
                    updateValue(
                      param.name,
                      parseInt(e.target.value) || param.defaultValue
                    )
                  }
                  min={param.min}
                  max={param.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="range"
                  value={getValue(param.name)}
                  onChange={(e) =>
                    updateValue(
                      param.name,
                      parseInt(e.target.value) || param.defaultValue
                    )
                  }
                  min={param.min}
                  max={param.max}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {param.min}
                    {param.unit && ` ${param.unit}`}
                  </span>
                  <span className="font-medium">
                    {getValue(param.name)}
                    {param.unit && ` ${param.unit}`}
                  </span>
                  <span>
                    {param.max}
                    {param.unit && ` ${param.unit}`}
                  </span>
                </div>
              </div>
            ) : param.type === "list" ? (
              <select
                value={getValue(param.name)}
                onChange={(e) => updateValue(param.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
              >
                {param.options?.map((option) => (
                  <option key={option} value={option}>
                    {option === "M"
                      ? "Male"
                      : option === "F"
                      ? "Female"
                      : option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={getValue(param.name)}
                onChange={(e) => updateValue(param.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalParametersForm;
