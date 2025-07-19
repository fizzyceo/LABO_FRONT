// services/mongoApiService.ts
import { Algorithm, Workflow } from "../types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class MongoApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `API request failed: ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Algorithm methods
  async getAlgorithms(): Promise<Algorithm[]> {
    return this.request<Algorithm[]>("/algorithms");
  }

  async getAlgorithm(id: string): Promise<Algorithm> {
    return this.request<Algorithm>(`/algorithms/${id}`);
  }

  async saveAlgorithm(algorithm: Algorithm): Promise<Algorithm> {
    if (algorithm.id && typeof algorithm.id === "string") {
      // Update existing algorithm (MongoDB ObjectId is 24 characters)
      return this.request<Algorithm>(`/algorithms/${algorithm.id}`, {
        method: "PUT",
        body: JSON.stringify(algorithm),
      });
    } else {
      // Create new algorithm
      const { id, ...algorithmData } = algorithm; // Remove id for creation
      return this.request<Algorithm>("/algorithms", {
        method: "POST",
        body: JSON.stringify(algorithmData),
      });
    }
  }

  async deleteAlgorithm(id: string): Promise<void> {
    await this.request(`/algorithms/${id}`, {
      method: "DELETE",
    });
  }

  // Workflow methods
  async getWorkflows(): Promise<Workflow[]> {
    return this.request<Workflow[]>("/workflows");
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`);
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    if (workflow.id && typeof workflow.id === "string") {
      // Update existing workflow
      return this.request<Workflow>(`/workflows/${workflow.id}`, {
        method: "PUT",
        body: JSON.stringify(workflow),
      });
    } else {
      // Create new workflow
      const { id, ...workflowData } = workflow;
      return this.request<Workflow>("/workflows", {
        method: "POST",
        body: JSON.stringify(workflowData),
      });
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.request(`/workflows/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

export const mongoApiService = new MongoApiService();
