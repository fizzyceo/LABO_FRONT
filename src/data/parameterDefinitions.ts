import { ParameterDefinition } from "../types";

export const parameterDefinitions: ParameterDefinition[] = [
  // Global Parameters (apply to all algorithms)
  {
    name: "patient_age",
    label: "Patient Age",
    type: "range",
    defaultConfig: {
      type: "range",
      min: 0,
      max: 120,
      unit: "years",
      required: true,
    },
    isGlobal: true,
    category: "Patient Info",
  },
  {
    name: "patient_gender",
    label: "Patient Gender",
    type: "list",
    defaultConfig: {
      type: "list",
      options: ["Male", "Female", "Other"],
      required: true,
    },
    isGlobal: true,
    category: "Patient Info",
  },

  // Blood Analysis Parameters
  {
    name: "result",
    label: "Test Result",
    type: "range",
    defaultConfig: {
      type: "range",
      min: 0,
      max: 100,
      required: true,
    },
    isGlobal: false,
    category: "Results",
  },
  {
    name: "qc",
    label: "Quality Control",
    type: "contains",
    defaultConfig: {
      type: "contains",
      value: "normal",
      required: true,
    },
    isGlobal: false,
    category: "Quality",
  },
  {
    name: "unity",
    label: "Unit of Measurement",
    type: "list",
    defaultConfig: {
      type: "list",
      options: ["g/L", "mg/dL", "mmol/L", "µmol/L", "IU/L"],
      required: true,
    },
    isGlobal: false,
    category: "Results",
  },

  {
    name: "entecedent",
    label: "Previous Value",
    type: "list",
    defaultConfig: {
      type: "list",
      options: ["LOW", "HIGH"],
      required: false,
    },
    isGlobal: false,
    category: "Medical History",
  },
  {
    name: "entecedent_date",
    label: "Days Since Previous Test",
    type: "range",
    defaultConfig: {
      type: "range",
      min: 0,
      max: 365,
      unit: "days",
      required: false,
    },
    isGlobal: false,
    category: "Medical History",
  },
  {
    name: "interparameter",
    label: "Linked Parameter",
    type: "list",
    defaultConfig: {
      type: "list",
      options: [],
      required: false,
    },
    isGlobal: false,
    category: "Relationships",
  },

  {
    name: "comments",
    label: "Comments",
    type: "contains",
    defaultConfig: {
      type: "contains",
      required: false,
    },
    isGlobal: false,
    category: "Notes",
  },
];

export const algorithmTemplates = {
  blood: {
    name: "Blood Analysis (FNS)",
    defaultParameters: [
      {
        name: "globule_rouge",
        label: "Globule Rouge",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 5,
              max: 15,
              unit: "M/µL",
              required: true,
            },
          },
          {
            param: "result_type",
            config: {
              type: "list" as const,
              options: ["normal", "supra", "infra"],
              required: true,
            },
          },
          {
            param: "qc",
            config: {
              type: "contains" as const,
              value: "abnormal",
              required: true,
            },
          },
        ],
      },
      {
        name: "hemoglobine",
        label: "Hémoglobine",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 12,
              max: 16,
              unit: "g/dL",
              required: true,
            },
          },
          {
            param: "qc",
            config: {
              type: "contains" as const,
              value: "normal",
              required: true,
            },
          },
        ],
      },
      {
        name: "plaquettes",
        label: "Plaquettes",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 150,
              max: 450,
              unit: "K/µL",
              required: true,
            },
          },
        ],
      },
    ],
  },
  urine: {
    name: "Urine Analysis",
    defaultParameters: [
      {
        name: "proteine",
        label: "Protéine",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 0,
              max: 0.15,
              unit: "g/L",
              required: true,
            },
          },
          {
            param: "sample_type",
            config: {
              type: "list" as const,
              options: ["urine"],
              required: true,
            },
          },
        ],
      },
      {
        name: "glucose",
        label: "Glucose",
        subParameters: [
          {
            param: "result",
            config: {
              type: "exact" as const,
              value: "0",
              required: true,
            },
          },
          {
            param: "qc",
            config: {
              type: "contains" as const,
              value: "normal",
              required: true,
            },
          },
        ],
      },
    ],
  },
  biochemistry: {
    name: "Biochemistry Analysis",
    defaultParameters: [
      {
        name: "cholesterol",
        label: "Cholestérol Total",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 0,
              max: 2.0,
              unit: "g/L",
              required: true,
            },
          },
          {
            param: "result_type",
            config: {
              type: "list" as const,
              options: ["normal", "elevated", "low"],
              required: true,
            },
          },
        ],
      },
      {
        name: "glucose_sanguin",
        label: "Glucose Sanguin",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 0.7,
              max: 1.1,
              unit: "g/L",
              required: true,
            },
          },
          {
            param: "unity",
            config: {
              type: "list" as const,
              options: ["g/L", "mg/dL", "mmol/L"],
              required: true,
            },
          },
        ],
      },
    ],
  },
  hematology: {
    name: "Hematology Analysis",
    defaultParameters: [
      {
        name: "leucocytes",
        label: "Leucocytes",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 4,
              max: 10,
              unit: "10^9/L",
              required: true,
            },
          },
          {
            param: "sample_type",
            config: {
              type: "list" as const,
              options: ["blood", "plasma"],
              required: true,
            },
          },
        ],
      },
      {
        name: "neutrophiles",
        label: "Neutrophiles",
        subParameters: [
          {
            param: "result",
            config: {
              type: "range" as const,
              min: 50,
              max: 70,
              unit: "%",
              required: true,
            },
          },
          {
            param: "qc",
            config: {
              type: "contains" as const,
              value: "normal",
              required: true,
            },
          },
        ],
      },
    ],
  },
};
