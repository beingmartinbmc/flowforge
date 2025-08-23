import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  WorkflowDefinition, 
  Run, 
  Task, 
  LoginRequest, 
  LoginResponse,
  PaginatedResponse,
  SchedulerResponse,
  SchedulerConfig
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://flowforge-backend-jpfuk7ju1-beingmartinbmcs-projects.vercel.app/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          // Don't redirect if we're already on an auth page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.client.post('/auth/register', credentials);
    return response.data;
  }

  // Workflows
  async getWorkflows(page: number = 1, limit: number = 10): Promise<PaginatedResponse<WorkflowDefinition>> {
    const response: AxiosResponse<{ workflows: WorkflowDefinition[], pagination: any }> = await this.client.get('/workflows', {
      params: { page, limit },
    });
    // Transform backend response to match frontend expected structure
    return {
      data: response.data.workflows,
      pagination: response.data.pagination,
    };
  }

  async getWorkflow(id: string): Promise<WorkflowDefinition> {
    const response: AxiosResponse<{ workflow: WorkflowDefinition }> = await this.client.get(`/workflows/${id}`);
    return response.data.workflow;
  }

  async createWorkflow(data: {
    name: string;
    description?: string;
    nodes: any[];
    edges: any[];
  }): Promise<WorkflowDefinition> {
    const response: AxiosResponse<{ workflow: WorkflowDefinition }> = await this.client.post('/workflows', data);
    return response.data.workflow;
  }

  async updateWorkflow(id: string, data: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> {
    const response: AxiosResponse<{ workflow: WorkflowDefinition }> = await this.client.put(`/workflows/${id}`, data);
    return response.data.workflow;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.client.delete(`/workflows/${id}`);
  }

  async deleteWorkflows(workflowIds: string[]): Promise<void> {
    await this.client.post('/workflows/bulk-delete', { 
      workflowIds,
      force: true,
      deleteRuns: true
    });
  }

  // Runs
  async getRuns(workflowId?: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Run>> {
    const params: any = { page, limit };
    if (workflowId) params.workflowId = workflowId;
    
    const response: AxiosResponse<{ runs: Run[], pagination: any }> = await this.client.get('/runs', { params });
    // Transform backend response to match frontend expected structure
    return {
      data: response.data.runs,
      pagination: response.data.pagination,
    };
  }

  async getRun(id: string): Promise<Run> {
    const response: AxiosResponse<{ run: Run }> = await this.client.get(`/runs/${id}`);
    return response.data.run;
  }

  async triggerRun(workflowId: string, input: Record<string, any>): Promise<Run> {
    const response: AxiosResponse<{ run: Run }> = await this.client.post(`/workflows/${workflowId}/runs`, { input });
    return response.data.run;
  }

  async cancelRun(id: string): Promise<void> {
    await this.client.delete(`/runs/${id}`);
  }

  // Tasks
  async getTasks(runId: string): Promise<Task[]> {
    const response: AxiosResponse<{ tasks: Task[] }> = await this.client.get(`/runs/${runId}/tasks`);
    return response.data.tasks;
  }

  async getTask(id: string): Promise<Task> {
    const response: AxiosResponse<{ task: Task }> = await this.client.get(`/tasks/${id}`);
    return response.data.task;
  }

  async retryTask(id: string): Promise<Task> {
    const response: AxiosResponse<{ task: Task }> = await this.client.post(`/tasks/${id}/retry`);
    return response.data.task;
  }

  // Scheduler
  async triggerScheduler(config?: SchedulerConfig): Promise<SchedulerResponse> {
    const response: AxiosResponse<SchedulerResponse> = await this.client.post('/scheduler/process', config || {});
    return response.data;
  }

  async triggerRedisScheduler(config?: SchedulerConfig): Promise<SchedulerResponse> {
    const response: AxiosResponse<SchedulerResponse> = await this.client.post('/scheduler/trigger', config || {});
    return response.data;
  }

  async triggerMongoScheduler(config?: SchedulerConfig): Promise<SchedulerResponse> {
    const response: AxiosResponse<SchedulerResponse> = await this.client.post('/scheduler/mongo-trigger', config || {});
    return response.data;
  }

  async triggerCronScheduler(): Promise<SchedulerResponse> {
    const response: AxiosResponse<SchedulerResponse> = await this.client.post('/cron/process-tasks');
    return response.data;
  }

  // Metrics
  async getWorkflowMetrics(workflowId: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get(`/workflows/${workflowId}/metrics`);
    return response.data;
  }

  async getSystemMetrics(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/metrics');
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
