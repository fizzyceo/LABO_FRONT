import { MongoClient, Db, Collection } from 'mongodb';
import { Algorithm, Workflow } from '../types';

class MongoDBService {
  private client: MongoClient;
  private db: Db | null = null;
  private algorithmsCollection: Collection<Algorithm> | null = null;
  private workflowsCollection: Collection<Workflow> | null = null;
  private connected = false;

  constructor() {
    const uri = 'mongodb+srv://workingdev0:EnMojEneJr0FFwTm@labocluster.hwzcnm2.mongodb.net/?retryWrites=true&w=majority&appName=LABOCluster';
    this.client = new MongoClient(uri);
  }

  async connect() {
    if (this.connected) return;
    
    try {
      await this.client.connect();
      this.db = this.client.db('laboratory_platform');
      this.algorithmsCollection = this.db.collection<Algorithm>('algorithms');
      this.workflowsCollection = this.db.collection<Workflow>('workflows');
      this.connected = true;
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }

  // Algorithm operations
  async getAlgorithms(): Promise<Algorithm[]> {
    await this.connect();
    if (!this.algorithmsCollection) throw new Error('Database not connected');
    
    try {
      const algorithms = await this.algorithmsCollection.find({}).toArray();
      return algorithms.map(alg => ({
        ...alg,
        created: new Date(alg.created),
        lastModified: new Date(alg.lastModified)
      }));
    } catch (error) {
      console.error('Error fetching algorithms:', error);
      return [];
    }
  }

  async saveAlgorithm(algorithm: Algorithm): Promise<Algorithm> {
    await this.connect();
    if (!this.algorithmsCollection) throw new Error('Database not connected');
    
    try {
      const now = new Date();
      
      if (algorithm.id) {
        // Update existing algorithm
        const updateData = {
          ...algorithm,
          lastModified: now
        };
        
        await this.algorithmsCollection.replaceOne(
          { id: algorithm.id },
          updateData,
          { upsert: true }
        );
        
        return updateData;
      } else {
        // Create new algorithm
        const newAlgorithm = {
          ...algorithm,
          id: Date.now(),
          created: now,
          lastModified: now
        };
        
        await this.algorithmsCollection.insertOne(newAlgorithm);
        return newAlgorithm;
      }
    } catch (error) {
      console.error('Error saving algorithm:', error);
      throw error;
    }
  }

  async deleteAlgorithm(id: number): Promise<void> {
    await this.connect();
    if (!this.algorithmsCollection) throw new Error('Database not connected');
    
    try {
      await this.algorithmsCollection.deleteOne({ id });
    } catch (error) {
      console.error('Error deleting algorithm:', error);
      throw error;
    }
  }

  // Workflow operations
  async getWorkflows(): Promise<Workflow[]> {
    await this.connect();
    if (!this.workflowsCollection) throw new Error('Database not connected');
    
    try {
      const workflows = await this.workflowsCollection.find({}).toArray();
      return workflows.map(wf => ({
        ...wf,
        created: new Date(wf.created)
      }));
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    await this.connect();
    if (!this.workflowsCollection) throw new Error('Database not connected');
    
    try {
      if (workflow.id) {
        await this.workflowsCollection.replaceOne(
          { id: workflow.id },
          workflow,
          { upsert: true }
        );
        return workflow;
      } else {
        const newWorkflow = {
          ...workflow,
          id: Date.now(),
          created: new Date()
        };
        
        await this.workflowsCollection.insertOne(newWorkflow);
        return newWorkflow;
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(id: number): Promise<void> {
    await this.connect();
    if (!this.workflowsCollection) throw new Error('Database not connected');
    
    try {
      await this.workflowsCollection.deleteOne({ id });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }
}

export const mongoDatabase = new MongoDBService();