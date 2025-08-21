import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
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
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  BarChart3,
  Activity,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Run, Task } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-hot-toast';

// Custom node types for live status
const nodeTypes: NodeTypes = {
  task: TaskNode,
};

interface TaskNodeData {
  label: string;
  status: string;
  taskId: string;
  duration?: number;
  error?: string;
}

function TaskNode({ data }: { data: TaskNodeData }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-500 border-green-600';
      case 'FAILED':
        return 'bg-red-500 border-red-600';
      case 'RUNNING':
        return 'bg-yellow-500 border-yellow-600 animate-pulse';
      case 'PENDING':
        return 'bg-gray-500 border-gray-600';
      default:
        return 'bg-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-white" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-white" />;
      case 'RUNNING':
        return <Activity className="h-4 w-4 text-white animate-spin" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-white" />;
      default:
        return <AlertCircle className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${getStatusColor(data.status)} transition-all duration-300`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getStatusIcon(data.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {data.label}
          </div>
          <div className="text-xs text-white/80">
            {data.status}
            {data.duration && ` • ${data.duration}ms`}
          </div>
        </div>
      </div>
      {data.error && (
        <div className="mt-2 text-xs text-white/90 bg-black/20 rounded p-2">
          {data.error}
        </div>
      )}
    </div>
  );
}

function RunDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [run, setRun] = useState<Run | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadRunData();
      startPolling();
    }
    return () => stopPolling();
  }, [id]);

  const loadRunData = async () => {
    try {
      setLoading(true);
      const [runData, tasksData] = await Promise.all([
        apiClient.getRun(id as string),
        apiClient.getTasks(id as string),
      ]);

      setRun(runData);
      setTasks(tasksData);
      
      // Generate DAG nodes and edges from tasks
      const dagNodes: Node[] = tasksData.map((task, index) => ({
        id: task.nodeId,
        type: 'task',
        position: { x: (index % 3) * 200 + 100, y: Math.floor(index / 3) * 150 + 100 },
        data: {
          label: task.nodeName || task.nodeId,
          status: task.status,
          taskId: task.id,
          duration: task.completedAt && task.startedAt 
            ? new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime()
            : undefined,
          error: task.error,
        },
      }));

      const dagEdges: Edge[] = [];
      // Create edges based on task dependencies (simplified)
      for (let i = 0; i < tasksData.length - 1; i++) {
        dagEdges.push({
          id: `e${i}`,
          source: tasksData[i].nodeId,
          target: tasksData[i + 1].nodeId,
          type: 'smoothstep',
        });
      }

      setNodes(dagNodes);
      setEdges(dagEdges);

      // Generate mock logs
      generateMockLogs(tasksData);
      
      // Generate metrics
      generateMetrics(runData, tasksData);
    } catch (error) {
      console.error('Failed to load run data:', error);
      toast.error('Failed to load run data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockLogs = (tasks: Task[]) => {
    const mockLogs: string[] = [];
    tasks.forEach(task => {
      mockLogs.push(`[${new Date(task.createdAt).toISOString()}] INFO: Starting task ${task.nodeName || task.nodeId}`);
      if (task.startedAt) {
        mockLogs.push(`[${new Date(task.startedAt).toISOString()}] INFO: Task ${task.nodeName || task.nodeId} is running`);
      }
      if (task.completedAt) {
        if (task.status === 'SUCCESS') {
          mockLogs.push(`[${new Date(task.completedAt).toISOString()}] SUCCESS: Task ${task.nodeName || task.nodeId} completed successfully`);
        } else if (task.status === 'FAILED') {
          mockLogs.push(`[${new Date(task.completedAt).toISOString()}] ERROR: Task ${task.nodeName || task.nodeId} failed: ${task.error}`);
        }
      }
    });
    setLogs(mockLogs);
  };

  const generateMetrics = (run: Run, tasks: Task[]) => {
    const successfulTasks = tasks.filter(t => t.status === 'SUCCESS').length;
    const failedTasks = tasks.filter(t => t.status === 'FAILED').length;
    const totalRetries = tasks.reduce((sum, t) => sum + t.retryCount, 0);
    
    const executionTime = run.completedAt 
      ? new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()
      : Date.now() - new Date(run.startedAt).getTime();

    setMetrics({
      totalTasks: tasks.length,
      successfulTasks,
      failedTasks,
      totalRetries,
      executionTime,
      successRate: (successfulTasks / tasks.length) * 100,
    });
  };

  const startPolling = () => {
    setPolling(true);
    const interval = setInterval(() => {
      if (run?.status === 'RUNNING') {
        loadRunData();
      }
    }, 2000);
    return () => clearInterval(interval);
  };

  const stopPolling = () => {
    setPolling(false);
  };

  const cancelRun = async () => {
    try {
      await apiClient.cancelRun(id as string);
      toast.success('Run cancelled successfully');
      loadRunData();
    } catch (error) {
      console.error('Failed to cancel run:', error);
      toast.error('Failed to cancel run');
    }
  };

  const retryRun = async () => {
    if (!run?.workflowId) return;
    try {
      const newRun = await apiClient.triggerRun(run.workflowId, run.input);
      toast.success('Run triggered successfully');
      router.push(`/runs/${newRun.id}`);
    } catch (error) {
      console.error('Failed to retry run:', error);
      toast.error('Failed to retry run');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUCCESS: { color: 'bg-green-500', text: 'Success' },
      RUNNING: { color: 'bg-yellow-500', text: 'Running' },
      FAILED: { color: 'bg-red-500', text: 'Failed' },
      PENDING: { color: 'bg-gray-500', text: 'Pending' },
      CANCELED: { color: 'bg-gray-400', text: 'Canceled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const formatDuration = (startedAt: Date, completedAt?: Date) => {
    if (!completedAt) return 'Running...';
    const duration = new Date(completedAt).getTime() - new Date(startedAt).getTime();
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading run details...</p>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p>Run not found</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
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
            <div>
              <h1 className="text-2xl font-bold">Run Details</h1>
              <p className="text-sm text-muted-foreground">
                {run.id.slice(0, 8)}... • {run.workflow?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(run.status)}
            {run.status === 'RUNNING' && (
              <Button variant="outline" onClick={cancelRun}>
                <Pause className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button onClick={retryRun}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Run Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Started At</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(run.startedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(run.startedAt, run.completedAt)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => t.status === 'SUCCESS').length} successful
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DAG Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
              >
                <Controls />
                <Background />
                <MiniMap />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto bg-muted p-4 rounded-md font-mono text-sm">
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-1"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Node</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-mono text-sm">
                          {task.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{task.nodeName || task.nodeId}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>{task.retryCount + 1}</TableCell>
                        <TableCell>
                          {task.completedAt && task.startedAt
                            ? `${new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime()}ms`
                            : 'Running...'
                          }
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {task.error || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Success', value: metrics.successfulTasks, color: '#10b981' },
                              { name: 'Failed', value: metrics.failedTasks, color: '#ef4444' },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {[
                              { name: 'Success', value: metrics.successfulTasks, color: '#10b981' },
                              { name: 'Failed', value: metrics.failedTasks, color: '#ef4444' },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Execution Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metrics.totalTasks}</div>
                        <p className="text-sm text-muted-foreground">Total Tasks</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metrics.totalRetries}</div>
                        <p className="text-sm text-muted-foreground">Total Retries</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Math.floor(metrics.executionTime / 1000)}s</div>
                        <p className="text-sm text-muted-foreground">Execution Time</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {metrics.totalTasks > 0 ? (metrics.totalRetries / metrics.totalTasks).toFixed(1) : 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Avg Retries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </ProtectedRoute>
  );
}

// Wrapper component to provide ReactFlow context
export default function RunDetailWrapper() {
  return (
    <ReactFlowProvider>
      <RunDetail />
    </ReactFlowProvider>
  );
}
