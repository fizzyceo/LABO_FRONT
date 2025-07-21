import { Algorithm, Workflow } from '../types';

// API-based database service that communicates with your CRUD server
class DatabaseService {
  private baseUrl = '/api'; // Adjust this if your API is on a different host/port
  private initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    return response.json();
  }

  private async safeApiCall<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, using fallback:', error);
      return fallback;
    }
  }

  // Algorithm operations
  async getAlgorithms(): Promise<Algorithm[]> {
    await this.init();
    
    return this.safeApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/algorithms`);
      const algorithms = await this.handleResponse<Algorithm[]>(response);
      
      // Ensure dates are properly converted
      return algorithms.map(alg => ({
        ...alg,
        created: new Date(alg.created),
        lastModified: new Date(alg.lastModified)
      }));
    }, []);
  }

  async getAlgorithm(id: number): Promise<Algorithm> {
    await this.init();
    
    try {
      const response = await fetch(`${this.baseUrl}/algorithms/${id}`);
      const algorithm = await this.handleResponse<Algorithm>(response);
      
      return {
        ...algorithm,
        created: new Date(algorithm.created),
        lastModified: new Date(algorithm.lastModified)
      };
    } catch (error) {
      console.error('Error fetching algorithm:', error);
      throw error;
    }
  }

  async saveAlgorithm(algorithm: Algorithm): Promise<Algorithm> {
    await this.init();
    
    try {
      let response: Response;
      
      if (algorithm.id && typeof algorithm.id === 'string' && algorithm.id.length === 24) {
        // Update existing algorithm
        console.log('Updating algorithm with ID:', algorithm.id);
        response = await fetch(`${this.baseUrl}/algorithms/${algorithm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...algorithm,
            lastModified: new Date()
          }),
        });
      } else {
        // Create new algorithm
        console.log('Creating new algorithm');
        const { id, ...newAlgorithm } = algorithm;
        newAlgorithm.created = new Date();
        newAlgorithm.lastModified = new Date();
        
        response = await fetch(`${this.baseUrl}/algorithms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAlgorithm),
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const savedAlgorithm = await this.handleResponse<Algorithm>(response);
      console.log('Saved algorithm:', savedAlgorithm);
      
      return {
        ...savedAlgorithm,
        created: new Date(savedAlgorithm.created),
        lastModified: new Date(savedAlgorithm.lastModified)
      };
    } catch (error) {
      console.error('Error saving algorithm:', error);
      throw error;
    }
  }

  async deleteAlgorithm(id: number): Promise<void> {
    await this.init();
    
    try {
      const response = await fetch(`${this.baseUrl}/algorithms/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting algorithm:', error);
      throw error;
    }
  }

  // Workflow operations (assuming similar endpoints exist for workflows)
  async getWorkflows(): Promise<Workflow[]> {
    await this.init();
    
    return this.safeApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/workflows`);
      const workflows = await this.handleResponse<Workflow[]>(response);
      
      return workflows.map(wf => ({
        ...wf,
        created: new Date(wf.created)
      }));
    }, []);
  }

  async getWorkflow(id: number): Promise<Workflow> {
    await this.init();
    
    try {
      const response = await fetch(`${this.baseUrl}/workflows/${id}`);
      const workflow = await this.handleResponse<Workflow>(response);
      
      return {
        ...workflow,
        created: new Date(workflow.created)
      };
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    await this.init();
    
    try {
      let response: Response;
      
      if (workflow.id && workflow.id > 0) {
        // Update existing workflow
        response = await fetch(`${this.baseUrl}/workflows/${workflow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflow),
        });
      } else {
        // Create new workflow
        const newWorkflow = {
          ...workflow,
          created: new Date()
        };
        
        response = await fetch(`${this.baseUrl}/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWorkflow),
        });
      }
      
      const savedWorkflow = await this.handleResponse<Workflow>(response);
      
      return {
        ...savedWorkflow,
        created: new Date(savedWorkflow.created)
      };
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(id: number): Promise<void> {
    await this.init();
    
    try {
      const response = await fetch(`${this.baseUrl}/workflows/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }
}

export const database = new DatabaseService();