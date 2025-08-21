import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Settings, 
  Plus,
  Trash2,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { WorkflowDefinition, WorkflowNode, WorkflowEdge } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

// Custom node types
const nodeTypes: NodeTypes = {
  http: HttpNode,
  echo: EchoNode,
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'http',
    position: { x: 250, y: 100 },
    data: { 
      label: 'HTTP Request',
      config: {
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: {},
        body: null,
        timeout: 30000,
      }
    },
  },
];

const initialEdges: Edge[] = [];

function WorkflowBuilder() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [description, setDescription] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: type as any,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: type === 'http' ? 'HTTP Request' : type === 'echo' ? 'Echo' : 'Custom Task',
        config: type === 'http' ? {
          method: 'GET',
          url: '',
          headers: {},
          body: null,
          timeout: 30000,
        } : type === 'echo' ? {
          message: 'Hello World',
          level: 'info',
        } : {
          code: 'console.log("Custom task");',
        }
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const saveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      setSaving(true);
      const workflowData = {
        name: workflowName,
        description,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type as any,
          name: node.data.label,
          config: node.data.config,
          position: node.position,
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };

      const savedWorkflow = await apiClient.createWorkflow(workflowData);
      toast.success('Workflow saved successfully!');
      router.push(`/workflow/${savedWorkflow.id}`);
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      description,
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${workflowName.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Create Workflow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportWorkflow}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={saveWorkflow} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Workflow'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card">
          <div className="p-4 space-y-4">
            {/* Workflow Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your workflow"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Node Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Nodes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNode('http')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  HTTP Request
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNode('echo')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Echo Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNode('custom')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Custom Task
                </Button>
              </CardContent>
            </Card>

            {/* Node Configuration */}
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <NodeConfigPanel
                    node={selectedNode}
                    onUpdate={(config) => updateNodeConfig(selectedNode.id, config)}
                    onDelete={() => deleteNode(selectedNode.id)}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Flow Area */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

// Custom Node Components
function HttpNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100">
          🌐
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.config.method} {data.config.url}</div>
        </div>
      </div>
    </div>
  );
}

function EchoNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-green-100">
          📢
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.config.message}</div>
        </div>
      </div>
    </div>
  );
}

function CustomNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-purple-100">
          ⚙️
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">Custom Code</div>
        </div>
      </div>
    </div>
  );
}

function NodeConfigPanel({ node, onUpdate, onDelete }: { 
  node: Node; 
  onUpdate: (config: any) => void; 
  onDelete: () => void;
}) {
  const [config, setConfig] = useState(node.data.config);

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
    onUpdate(newConfig);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{node.data.label}</span>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {node.type === 'http' && (
        <div className="space-y-3">
          <div>
            <Label>Method</Label>
            <Select value={config.method} onValueChange={(value) => handleConfigChange({ ...config, method: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={config.url}
              onChange={(e) => handleConfigChange({ ...config, url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </div>
          <div>
            <Label>Timeout (ms)</Label>
            <Input
              type="number"
              value={config.timeout}
              onChange={(e) => handleConfigChange({ ...config, timeout: parseInt(e.target.value) })}
            />
          </div>
        </div>
      )}

      {node.type === 'echo' && (
        <div className="space-y-3">
          <div>
            <Label>Message</Label>
            <Input
              value={config.message}
              onChange={(e) => handleConfigChange({ ...config, message: e.target.value })}
              placeholder="Enter message"
            />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={config.level} onValueChange={(value) => handleConfigChange({ ...config, level: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {node.type === 'custom' && (
        <div className="space-y-3">
          <div>
            <Label>Code</Label>
            <Textarea
              value={config.code}
              onChange={(e) => handleConfigChange({ ...config, code: e.target.value })}
              placeholder="Enter custom code"
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component to provide ReactFlow context
export default function WorkflowBuilderWrapper() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}
