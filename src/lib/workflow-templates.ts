import type { WorkflowTemplate } from '@/types';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'simple-echo',
    name: 'Simple Echo Workflow',
    description: 'A basic workflow that logs a message to demonstrate the system',
    category: 'basic',
    difficulty: 'beginner',
    tags: ['echo', 'logging', 'basic'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: 'Start',
        config: {},
        position: { x: 100, y: 200 },
      },
      {
        id: 'echo-1',
        type: 'echo',
        name: 'Log Message',
        config: {
          message: 'Hello from FlowForge!',
          level: 'info',
        },
        position: { x: 300, y: 200 },
      },
      {
        id: 'end-1',
        type: 'end',
        name: 'End',
        config: {},
        position: { x: 500, y: 200 },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'echo-1',
      },
      {
        id: 'edge-2',
        source: 'echo-1',
        target: 'end-1',
      },
    ],
  },
  {
    id: 'api-call',
    name: 'API Call Workflow',
    description: 'Make an HTTP request to an external API and log the response',
    category: 'api',
    difficulty: 'beginner',
    tags: ['http', 'api', 'external'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: 'Start',
        config: {},
        position: { x: 100, y: 200 },
      },
      {
        id: 'http-1',
        type: 'http',
        name: 'Fetch Data',
        config: {
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          headers: {},
          timeout: 30000,
        },
        position: { x: 300, y: 200 },
      },
      {
        id: 'echo-1',
        type: 'echo',
        name: 'Log Response',
        config: {
          message: 'API call completed successfully',
          level: 'info',
        },
        position: { x: 500, y: 200 },
      },
      {
        id: 'end-1',
        type: 'end',
        name: 'End',
        config: {},
        position: { x: 700, y: 200 },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'http-1',
      },
      {
        id: 'edge-2',
        source: 'http-1',
        target: 'echo-1',
      },
      {
        id: 'edge-3',
        source: 'echo-1',
        target: 'end-1',
      },
    ],
  },
  {
    id: 'error-handling',
    name: 'Error Handling Workflow',
    description: 'Demonstrates how to handle errors in workflows with multiple paths',
    category: 'automation',
    difficulty: 'intermediate',
    tags: ['error-handling', 'conditional', 'automation'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: 'Start',
        config: {},
        position: { x: 100, y: 200 },
      },
      {
        id: 'http-1',
        type: 'http',
        name: 'API Call',
        config: {
          method: 'GET',
          url: 'https://httpstat.us/404',
          headers: {},
          timeout: 30000,
        },
        position: { x: 300, y: 200 },
      },
      {
        id: 'echo-success',
        type: 'echo',
        name: 'Success Log',
        config: {
          message: 'API call succeeded',
          level: 'info',
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'echo-error',
        type: 'echo',
        name: 'Error Log',
        config: {
          message: 'API call failed, handling error',
          level: 'error',
        },
        position: { x: 500, y: 300 },
      },
      {
        id: 'end-1',
        type: 'end',
        name: 'End',
        config: {},
        position: { x: 700, y: 200 },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'http-1',
      },
      {
        id: 'edge-success',
        source: 'http-1',
        target: 'echo-success',
      },
      {
        id: 'edge-error',
        source: 'http-1',
        target: 'echo-error',
      },
      {
        id: 'edge-end-1',
        source: 'echo-success',
        target: 'end-1',
      },
      {
        id: 'edge-end-2',
        source: 'echo-error',
        target: 'end-1',
      },
    ],
  },
  {
    id: 'monitoring-workflow',
    name: 'Health Check Workflow',
    description: 'Monitor multiple services and report their status',
    category: 'monitoring',
    difficulty: 'intermediate',
    tags: ['monitoring', 'health-check', 'multiple-services'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: 'Start',
        config: {},
        position: { x: 100, y: 200 },
      },
      {
        id: 'http-1',
        type: 'http',
        name: 'Check Service 1',
        config: {
          method: 'GET',
          url: 'https://httpstat.us/200',
          headers: {},
          timeout: 10000,
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'http-2',
        type: 'http',
        name: 'Check Service 2',
        config: {
          method: 'GET',
          url: 'https://httpstat.us/200',
          headers: {},
          timeout: 10000,
        },
        position: { x: 300, y: 300 },
      },
      {
        id: 'echo-1',
        type: 'echo',
        name: 'Report Status',
        config: {
          message: 'Health check completed',
          level: 'info',
        },
        position: { x: 500, y: 200 },
      },
      {
        id: 'end-1',
        type: 'end',
        name: 'End',
        config: {},
        position: { x: 700, y: 200 },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'http-1',
      },
      {
        id: 'edge-2',
        source: 'start-1',
        target: 'http-2',
      },
      {
        id: 'edge-3',
        source: 'http-1',
        target: 'echo-1',
      },
      {
        id: 'edge-4',
        source: 'http-2',
        target: 'echo-1',
      },
      {
        id: 'edge-5',
        source: 'echo-1',
        target: 'end-1',
      },
    ],
  },
  {
    id: 'data-processing',
    name: 'Data Processing Workflow',
    description: 'Fetch data, process it, and store results',
    category: 'automation',
    difficulty: 'advanced',
    tags: ['data-processing', 'automation', 'complex'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        name: 'Start',
        config: {},
        position: { x: 100, y: 200 },
      },
      {
        id: 'http-1',
        type: 'http',
        name: 'Fetch Data',
        config: {
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts',
          headers: {},
          timeout: 30000,
        },
        position: { x: 300, y: 200 },
      },
      {
        id: 'custom-1',
        type: 'custom',
        name: 'Process Data',
        config: {
          code: '// Process the fetched data\nconst posts = input.data;\nconst processedCount = posts.length;\noutput = { processedCount, message: `Processed ${processedCount} posts` };',
        },
        position: { x: 500, y: 200 },
      },
      {
        id: 'echo-1',
        type: 'echo',
        name: 'Log Results',
        config: {
          message: 'Data processing completed',
          level: 'info',
        },
        position: { x: 700, y: 200 },
      },
      {
        id: 'end-1',
        type: 'end',
        name: 'End',
        config: {},
        position: { x: 900, y: 200 },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'start-1',
        target: 'http-1',
      },
      {
        id: 'edge-2',
        source: 'http-1',
        target: 'custom-1',
      },
      {
        id: 'edge-3',
        source: 'custom-1',
        target: 'echo-1',
      },
      {
        id: 'edge-4',
        source: 'echo-1',
        target: 'end-1',
      },
    ],
  },
];

export const getTemplateById = (id: string): WorkflowTemplate | undefined => {
  return workflowTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): WorkflowTemplate[] => {
  return workflowTemplates.filter(template => template.category === category);
};

export const getTemplatesByDifficulty = (difficulty: string): WorkflowTemplate[] => {
  return workflowTemplates.filter(template => template.difficulty === difficulty);
};

export const searchTemplates = (query: string): WorkflowTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return workflowTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
