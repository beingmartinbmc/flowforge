import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RotateCcw, 
  Filter, 
  Search, 
  RefreshCw,
  Trash2,
  Eye,
  Clock,
  XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Task } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-hot-toast';

interface DLQTask extends Task {
  workflowName?: string;
}

export default function DeadLetterQueue() {
  const [tasks, setTasks] = useState<DLQTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    workflow: '',
    taskType: '',
    search: '',
  });

  useEffect(() => {
    loadDLQTasks();
  }, []);

  const loadDLQTasks = async () => {
    try {
      setLoading(true);
      // In a real implementation, you'd have a dedicated DLQ endpoint
      // For now, we'll simulate failed tasks
      const mockDLQTasks: DLQTask[] = [
        {
          id: '1',
          runId: 'run-123',
          workflowId: 'wf-1',
          nodeId: 'node-1',
          status: 'FAILED',
          input: { data: 'test' },
          error: 'Connection timeout after 30 seconds',
          retryCount: 3,
          maxRetries: 3,
          startedAt: new Date(Date.now() - 3600000),
          completedAt: new Date(Date.now() - 3500000),
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3500000),
          nodeName: 'HTTP Request',
          nodeType: 'http',
          workflowName: 'Order Processing Pipeline',
        },
        {
          id: '2',
          runId: 'run-124',
          workflowId: 'wf-2',
          nodeId: 'node-2',
          status: 'FAILED',
          input: { email: 'test@example.com' },
          error: 'Invalid email format',
          retryCount: 2,
          maxRetries: 3,
          startedAt: new Date(Date.now() - 7200000),
          completedAt: new Date(Date.now() - 7100000),
          createdAt: new Date(Date.now() - 7200000),
          updatedAt: new Date(Date.now() - 7100000),
          nodeName: 'Send Email',
          nodeType: 'email',
          workflowName: 'Email Notification System',
        },
        {
          id: '3',
          runId: 'run-125',
          workflowId: 'wf-3',
          nodeId: 'node-3',
          status: 'FAILED',
          input: { webhook: 'https://api.example.com/webhook' },
          error: 'Webhook endpoint returned 500 error',
          retryCount: 1,
          maxRetries: 3,
          startedAt: new Date(Date.now() - 10800000),
          completedAt: new Date(Date.now() - 10700000),
          createdAt: new Date(Date.now() - 10800000),
          updatedAt: new Date(Date.now() - 10700000),
          nodeName: 'Webhook Call',
          nodeType: 'webhook',
          workflowName: 'Data Sync Workflow',
        },
      ];

      setTasks(mockDLQTasks);
    } catch (error) {
      console.error('Failed to load DLQ tasks:', error);
      toast.error('Failed to load failed tasks');
    } finally {
      setLoading(false);
    }
  };

  const retryTask = async (taskId: string) => {
    try {
      setRetrying(taskId);
      await apiClient.retryTask(taskId);
      toast.success('Task retry initiated successfully');
      loadDLQTasks(); // Reload to get updated status
    } catch (error) {
      console.error('Failed to retry task:', error);
      toast.error('Failed to retry task');
    } finally {
      setRetrying(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to permanently delete this failed task?')) {
      return;
    }

    try {
      // In a real implementation, you'd have a delete endpoint
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getErrorType = (error: string) => {
    if (error.includes('timeout')) return 'Timeout';
    if (error.includes('connection')) return 'Connection';
    if (error.includes('500')) return 'Server Error';
    if (error.includes('400')) return 'Bad Request';
    if (error.includes('Invalid')) return 'Validation';
    return 'Unknown';
  };

  const getErrorColor = (error: string) => {
    const type = getErrorType(error);
    switch (type) {
      case 'Timeout':
        return 'bg-orange-500';
      case 'Connection':
        return 'bg-red-500';
      case 'Server Error':
        return 'bg-red-600';
      case 'Bad Request':
        return 'bg-yellow-500';
      case 'Validation':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredTasks = (tasks || []).filter(task => {
    if (filters.workflow && filters.workflow !== 'all' && task.workflowName !== filters.workflow) return false;
    if (filters.taskType && filters.taskType !== 'all' && task.nodeType !== filters.taskType) return false;
    if (filters.search && !task.error.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const uniqueWorkflows = Array.from(new Set((tasks || []).map(task => task.workflowName).filter(Boolean)));
  const uniqueTaskTypes = Array.from(new Set((tasks || []).map(task => task.nodeType).filter(Boolean)));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dead Letter Queue</h1>
            <Badge variant="destructive" className="bg-red-500">
              {tasks.length} Failed Tasks
            </Badge>
          </div>
          <Button onClick={loadDLQTasks} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Failed Tasks</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{tasks.length}</div>
                <p className="text-xs text-muted-foreground">Tasks in DLQ</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Max Retries Exceeded</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {tasks.filter(t => t.retryCount >= t.maxRetries).length}
                </div>
                <p className="text-xs text-muted-foreground">Cannot retry</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retryable Tasks</CardTitle>
                <RotateCcw className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {tasks.filter(t => t.retryCount < t.maxRetries).length}
                </div>
                <p className="text-xs text-muted-foreground">Can be retried</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Workflows</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">{uniqueWorkflows.length}</div>
                <p className="text-xs text-muted-foreground">Affected workflows</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by error message..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <Select value={filters.workflow} onValueChange={(value) => setFilters(prev => ({ ...prev, workflow: value }))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Workflows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workflows</SelectItem>
                    {uniqueWorkflows.map(workflow => (
                      <SelectItem key={workflow} value={workflow}>
                        {workflow}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.taskType} onValueChange={(value) => setFilters(prev => ({ ...prev, taskType: value }))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Task Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Task Types</SelectItem>
                    {uniqueTaskTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Failed Tasks Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Failed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Node</TableHead>
                      <TableHead>Error Type</TableHead>
                      <TableHead>Failed At</TableHead>
                      <TableHead>Retries</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Loading failed tasks...
                        </TableCell>
                      </TableRow>
                    ) : filteredTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No failed tasks found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-mono text-sm">
                            {task.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="font-medium">
                            {task.workflowName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{task.nodeName}</span>
                              <Badge variant="outline" className="text-xs">
                                {task.nodeType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getErrorColor(task.error)} text-white`}>
                              {getErrorType(task.error)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(task.completedAt!).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{task.retryCount}/{task.maxRetries}</span>
                              {task.retryCount >= task.maxRetries && (
                                <Badge variant="destructive" className="text-xs">
                                  Max Exceeded
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Show error details in a modal or expand row
                                  alert(`Error: ${task.error}`);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {task.retryCount < task.maxRetries && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => retryTask(task.id)}
                                  disabled={retrying === task.id}
                                >
                                  <RotateCcw className={`h-4 w-4 ${retrying === task.id ? 'animate-spin' : ''}`} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
