import { ParameterDefinition } from '../types';

export const parameterDefinitions: ParameterDefinition[] = [
  // Global Parameters (apply to all algorithms)
  {
    name: 'patient_age',
    label: 'Patient Age',
    type: 'range',
    defaultConfig: {
      type: 'range',
      min: 0,
      max: 120,
      unit: 'years',
      required: true
    },
    isGlobal: true,
    category: 'Patient Info'
  },
  {
    name: 'patient_gender',
    label: 'Patient Gender',
    type: 'list',
    defaultConfig: {
      type: 'list',
      options: ['Male', 'Female', 'Other'],
      required: true
    },
    isGlobal: true,
    category: 'Patient Info'
  },
  {
    name: 'collection_time',
    label: 'Collection Time',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: true,
    category: 'Sample Info'
  },
  {
    name: 'processing_time',
    label: 'Processing Time',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: true,
    category: 'Sample Info'
  },

  // Blood Analysis Parameters
  {
    name: 'result',
    label: 'Test Result',
    type: 'range',
    defaultConfig: {
      type: 'range',
      min: 0,
      max: 100,
      required: true
    },
    isGlobal: false,
    category: 'Results'
  },
  {
    name: 'qc',
    label: 'Quality Control',
    type: 'contains',
    defaultConfig: {
      type: 'contains',
      value: 'normal',
      required: true
    },
    isGlobal: false,
    category: 'Quality'
  },
  {
    name: 'unity',
    label: 'Unit of Measurement',
    type: 'list',
    defaultConfig: {
      type: 'list',
      options: ['g/L', 'mg/dL', 'mmol/L', 'µmol/L', 'IU/L'],
      required: true
    },
    isGlobal: false,
    category: 'Results'
  },
  {
    name: 'reference_range',
    label: 'Reference Range',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: false,
    category: 'Results'
  },
  {
    name: 'sample_type',
    label: 'Sample Type',
    type: 'list',
    defaultConfig: {
      type: 'list',
      options: ['blood', 'serum', 'plasma', 'urine', 'saliva'],
      required: true
    },
    isGlobal: false,
    category: 'Sample Info'
  },
  {
    name: 'technician',
    label: 'Technician ID',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: false,
    category: 'Lab Info'
  },
  {
    name: 'instrument',
    label: 'Instrument',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: false,
    category: 'Lab Info'
  },
  {
    name: 'dilution_factor',
    label: 'Dilution Factor',
    type: 'range',
    defaultConfig: {
      type: 'range',
      min: 1,
      max: 1000,
      required: false
    },
    isGlobal: false,
    category: 'Lab Info'
  },
  {
    name: 'reagent_lot',
    label: 'Reagent Lot',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: false,
    category: 'Lab Info'
  },
  {
    name: 'calibration_date',
    label: 'Calibration Date',
    type: 'exact',
    defaultConfig: {
      type: 'exact',
      required: false
    },
    isGlobal: false,
    category: 'Lab Info'
  },
  {
    name: 'temperature',
    label: 'Temperature',
    type: 'range',
    defaultConfig: {
      type: 'range',
      min: 15,
      max: 30,
      unit: '°C',
      required: false
    },
    isGlobal: false,
    category: 'Environment'
  },
  {
    name: 'humidity',
    label: 'Humidity',
    type: 'range',
    defaultConfig: {
      type: 'range',
      min: 30,
      max: 70,
      unit: '%',
      required: false
    },
    isGlobal: false,
    category: 'Environment'
  },
  {
    name: 'comments',
    label: 'Comments',
    type: 'contains',
    defaultConfig: {
      type: 'contains',
      required: false
    },
    isGlobal: false,
    category: 'Notes'
  }
];

export const algorithmTemplates = {
  blood: {
    name: 'Blood Analysis (FNS)',
    defaultParameters: [
      {
        name: 'globule_rouge',
        label: 'Globule Rouge',
        subParameters: [
          {
            param: 'result',
            condition: 'result > 5',
            config: {
              type: 'range' as const,
              min: 5,
              max: 15,
              unit: 'M/µL',
              required: true
            }
          },
          {
            param: 'result_type',
            condition: 'result_type === "supra"',
            config: {
              type: 'list' as const,
              options: ['normal', 'supra', 'infra'],
              required: true
            }
          },
          {
            param: 'qc',
            condition: 'qc.includes("abnormal")',
            config: {
              type: 'contains' as const,
              value: 'abnormal',
              required: true
            }
          }
        ]
      },
      {
        name: 'hemoglobine',
        label: 'Hémoglobine',
        subParameters: [
          {
            param: 'result',
            condition: 'result >= 12 && result <= 16',
            config: {
              type: 'range' as const,
              min: 12,
              max: 16,
              unit: 'g/dL',
              required: true
            }
          },
          {
            param: 'qc',
            condition: 'qc.includes("normal")',
            config: {
              type: 'contains' as const,
              value: 'normal',
              required: true
            }
          }
        ]
      },
      {
        name: 'plaquettes',
        label: 'Plaquettes',
        subParameters: [
          {
            param: 'result',
            condition: 'result >= 150 && result <= 450',
            config: {
              type: 'range' as const,
              min: 150,
              max: 450,
              unit: 'K/µL',
              required: true
            }
          }
        ]
      }
    ]
  },
  urine: {
    name: 'Urine Analysis',
    defaultParameters: [
      {
        name: 'proteine',
        label: 'Protéine',
        subParameters: [
          {
            param: 'result',
            condition: 'result < 0.15',
            config: {
              type: 'range' as const,
              min: 0,
              max: 0.15,
              unit: 'g/L',
              required: true
            }
          },
          {
            param: 'sample_type',
            condition: 'sample_type === "urine"',
            config: {
              type: 'list' as const,
              options: ['urine'],
              required: true
            }
          }
        ]
      },
      {
        name: 'glucose',
        label: 'Glucose',
        subParameters: [
          {
            param: 'result',
            condition: 'result === 0',
            config: {
              type: 'exact' as const,
              value: '0',
              required: true
            }
          },
          {
            param: 'qc',
            condition: 'qc !== "error"',
            config: {
              type: 'contains' as const,
              value: 'normal',
              required: true
            }
          }
        ]
      }
    ]
  },
  biochemistry: {
    name: 'Biochemistry Analysis',
    defaultParameters: [
      {
        name: 'cholesterol',
        label: 'Cholestérol Total',
        subParameters: [
          {
            param: 'result',
            condition: 'result < 2.0',
            config: {
              type: 'range' as const,
              min: 0,
              max: 2.0,
              unit: 'g/L',
              required: true
            }
          },
          {
            param: 'result_type',
            condition: 'result_type === "normal"',
            config: {
              type: 'list' as const,
              options: ['normal', 'elevated', 'low'],
              required: true
            }
          }
        ]
      },
      {
        name: 'glucose_sanguin',
        label: 'Glucose Sanguin',
        subParameters: [
          {
            param: 'result',
            condition: 'result >= 0.7 && result <= 1.1',
            config: {
              type: 'range' as const,
              min: 0.7,
              max: 1.1,
              unit: 'g/L',
              required: true
            }
          },
          {
            param: 'unity',
            condition: 'unity === "g/L"',
            config: {
              type: 'list' as const,
              options: ['g/L', 'mg/dL', 'mmol/L'],
              required: true
            }
          }
        ]
      }
    ]
  },
  hematology: {
    name: 'Hematology Analysis',
    defaultParameters: [
      {
        name: 'leucocytes',
        label: 'Leucocytes',
        subParameters: [
          {
            param: 'result',
            condition: 'result >= 4 && result <= 10',
            config: {
              type: 'range' as const,
              min: 4,
              max: 10,
              unit: '10^9/L',
              required: true
            }
          },
          {
            param: 'sample_type',
            condition: 'sample_type === "blood"',
            config: {
              type: 'list' as const,
              options: ['blood', 'plasma'],
              required: true
            }
          }
        ]
      },
      {
        name: 'neutrophiles',
        label: 'Neutrophiles',
        subParameters: [
          {
            param: 'result',
            condition: 'result >= 50 && result <= 70',
            config: {
              type: 'range' as const,
              min: 50,
              max: 70,
              unit: '%',
              required: true
            }
          },
          {
            param: 'qc',
            condition: 'qc.includes("normal")',
            config: {
              type: 'contains' as const,
              value: 'normal',
              required: true
            }
          }
        ]
      }
    ]
  }
};