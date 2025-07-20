import { GlobalParameter } from '../types';

export const globalParameters: GlobalParameter[] = [
  {
    name: 'patient_age',
    label: 'Patient Age',
    type: 'range',
    defaultValue: 30,
    min: 0,
    max: 120,
    unit: 'years'
  },
  {
    name: 'patient_gender',
    label: 'Patient Gender',
    type: 'list',
    defaultValue: 'M',
    options: ['M', 'F']
  },
  {
    name: 'questionnaire',
    label: 'Questionnaire',
    type: 'text',
    defaultValue: ''
  }
];