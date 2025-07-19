import { Algorithm, Workflow } from '../types';

// Simple in-memory database with localStorage persistence
class DatabaseService {
  private algorithms: Algorithm[] = [];
  private workflows: Workflow[] = [];
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      // Load from localStorage
      const storedAlgorithms = localStorage.getItem('lab_algorithms');
      const storedWorkflows = localStorage.getItem('lab_workflows');
      
      if (storedAlgorithms) {
        this.algorithms = JSON.parse(storedAlgorithms).map((alg: any) => ({
          ...alg,
          created: new Date(alg.created),
          lastModified: new Date(alg.lastModified)
        }));
      } else {
        // Load sample data if no stored data
        this.loadSampleData();
      }
      
      if (storedWorkflows) {
        this.workflows = JSON.parse(storedWorkflows).map((wf: any) => ({
          ...wf,
          created: new Date(wf.created)
        }));
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      this.loadSampleData();
      this.initialized = true;
    }
  }

  private loadSampleData() {
    this.algorithms = [
      {
        id: 1,
        name: "Blood Sugar Validation",
        description: "Validates blood glucose levels with QC checks",
        parameters: [
          {
            name: "glucose_sanguin",
            label: "Glucose Sanguin",
            subParameters: [
              { 
                param: "result", 
                config: { type: "range", min: 0.7, max: 1.1, unit: "g/L", required: true }
              },
              { 
                param: "qc", 
                config: { type: "exact", value: "normal", required: true }
              },
              { 
                param: "unity", 
                config: { type: "exact", value: "g/L", required: true }
              }
            ]
          }
        ],
        action: "validate",
        globalParameters: [
          { name: 'patient_age', value: 45 },
          { name: 'patient_gender', value: 'M' }
        ],
        created: new Date(),
        lastModified: new Date(),
      },
      {
        id: 2,
        name: "Cholesterol Analysis",
        description: "Comprehensive cholesterol level validation",
        parameters: [
          {
            name: "cholesterol_total",
            label: "Cholestérol Total",
            subParameters: [
              { 
                param: "result", 
                config: { type: "range", min: 0, max: 2.0, unit: "g/L", required: true }
              },
              { 
                param: "result_type", 
                config: { type: "exact", value: "normal", required: true }
              },
              { 
                param: "patient_age", 
                config: { type: "range", min: 18, max: 120, unit: "years", required: true }
              }
            ]
          }
        ],
        action: "expert",
        globalParameters: [
          { name: 'patient_age', value: 35 },
          { name: 'patient_gender', value: 'F' }
        ],
        created: new Date(),
        lastModified: new Date(),
      },
      {
        id: 3,
        name: "Urine Protein Check",
        description: "Detects protein levels in urine samples",
        parameters: [
          {
            name: "proteine_urinaire",
            label: "Protéine Urinaire",
            subParameters: [
              { 
                param: "result", 
                config: { type: "range", min: 0, max: 0.15, unit: "g/L", required: true }
              },
              { 
                param: "sample_type", 
                config: { type: "exact", value: "urine", required: true }
              },
              { 
                param: "qc", 
                config: { type: "contains", value: "normal", required: true }
              }
            ]
          }
        ],
        action: "validate",
        globalParameters: [
          { name: 'patient_age', value: 28 },
          { name: 'patient_gender', value: 'F' }
        ],
        created: new Date(),
        lastModified: new Date(),
      },
    ];
  }

  private saveToStorage() {
    try {
      localStorage.setItem('lab_algorithms', JSON.stringify(this.algorithms));
      localStorage.setItem('lab_workflows', JSON.stringify(this.workflows));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Algorithm operations
  async getAlgorithms(): Promise<Algorithm[]> {
    await this.init();
    return [...this.algorithms];
  }

  async saveAlgorithm(algorithm: Algorithm): Promise<Algorithm> {
    await this.init();
    
    const existingIndex = this.algorithms.findIndex(a => a.id === algorithm.id);
    
    if (existingIndex >= 0) {
      this.algorithms[existingIndex] = { ...algorithm, lastModified: new Date() };
    } else {
      const newAlgorithm = { 
        ...algorithm, 
        id: Date.now(),
        created: new Date(),
        lastModified: new Date()
      };
      this.algorithms.push(newAlgorithm);
    }
    
    this.saveToStorage();
    return algorithm;
  }

  async deleteAlgorithm(id: number): Promise<void> {
    await this.init();
    this.algorithms = this.algorithms.filter(a => a.id !== id);
    this.saveToStorage();
  }

  // Workflow operations
  async getWorkflows(): Promise<Workflow[]> {
    await this.init();
    return [...this.workflows];
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    await this.init();
    
    const existingIndex = this.workflows.findIndex(w => w.id === workflow.id);
    
    if (existingIndex >= 0) {
      this.workflows[existingIndex] = workflow;
    } else {
      const newWorkflow = { 
        ...workflow, 
        id: Date.now(),
        created: new Date()
      };
      this.workflows.push(newWorkflow);
    }
    
    this.saveToStorage();
    return workflow;
  }

  async deleteWorkflow(id: number): Promise<void> {
    await this.init();
    this.workflows = this.workflows.filter(w => w.id !== id);
    this.saveToStorage();
  }
}

export const database = new DatabaseService();