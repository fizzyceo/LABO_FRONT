export interface Algorithm {
  id?: number | string;
  name: string;
  description: string;
  parameters: Parameter[];
  action: "validate" | "expert" | "conditional";
  globalParameters: GlobalParameterValue[];
  created: Date;
  lastModified: Date;
}

export interface Parameter {
  name: string;
  label: string;
  subParameters: SubParameter[];
}

export interface SubParameter {
  param: string;
  config?: ParameterConfig;
}

export interface ParameterConfig {
  type: "range" | "exact" | "contains" | "boolean" | "list" | "date";
  min?: number;
  max?: number;
  value?: string | number | boolean;
  options?: string[];
  required?: boolean;
  unit?: string;
}

export interface ParameterDefinition {
  name: string;
  label: string;
  type: "range" | "exact" | "contains" | "boolean" | "list";
  defaultConfig: ParameterConfig;
  isGlobal: boolean;
  category: string;
}

export interface Workflow {
  id: number;
  name: string;
  algorithmOrder: number[];
  created: Date;
}

export interface Mapping {
  param: string;
  selector: string;
}

export interface ExecutionLog {
  timestamp: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
}

export interface GlobalParameter {
  name: string;
  label: string;
  type: "range" | "list" | "text";
  defaultValue: any;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface GlobalParameterValue {
  name: string;
  value: any;
}
