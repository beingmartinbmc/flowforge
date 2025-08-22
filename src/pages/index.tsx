import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Eye,
  RefreshCw,
  AlertTriangle,
  LogOut,
  User,
  Trash2,
  CheckSquare,
  Square,
  Settings
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Run, WorkflowDefinition } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import SchedulerControl from '@/components/dashboard/SchedulerControl';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';

interface DashboardStats {
  totalWorkflows: number;
  totalRuns: number;
  successRate: number;
  avgTaskDuration: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    totalRuns: 0,
    successRate: 0,
    avgTaskDuration: 0,
  });
  const [runs, setRuns] = useState<Run[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    workflow: '',
    status: '',
    search: '',
  });
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [runsData, workflowsData, systemMetrics] = await Promise.all([
        apiClient.getRuns(undefined, 1, 10),
        apiClient.getWorkflows(1, 100),
        apiClient.getSystemMetrics(),
      ]);

      // Add null checks and provide defaults
      setRuns(runsData?.data || []);
      setWorkflows(workflowsData?.data || []);
      
      // Calculate stats from metrics with safe defaults
      setStats({
        totalWorkflows: workflowsData?.data?.length || 0,
        totalRuns: systemMetrics?.totalRuns || 0,
        successRate: systemMetrics?.successRate || 0,
        avgTaskDuration: systemMetrics?.avgTaskDuration || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set empty defaults on error
      setRuns([]);
      setWorkflows([]);
      setStats({
        totalWorkflows: 0,
        totalRuns: 0,
        successRate: 0,
        avgTaskDuration: 0,
      });
    } finally {
      setLoading(false);
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

  const handleWorkflowSelection = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkflows.length === workflows.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(workflows.map(w => w.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedWorkflows.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedWorkflows.length} workflow(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await apiClient.deleteWorkflows(selectedWorkflows);
      toast.success(`Successfully deleted ${selectedWorkflows.length} workflow(s)`);
      setSelectedWorkflows([]);
      loadDashboardData(); // Refresh the data
    } catch (error) {
      console.error('Failed to delete workflows:', error);
      toast.error('Failed to delete workflows');
    } finally {
      setDeleting(false);
    }
  };

  const filteredRuns = (runs || []).filter(run => {
    if (filters.workflow && filters.workflow !== 'all' && run.workflow?.name !== filters.workflow) return false;
    if (filters.status && filters.status !== 'all' && run.status !== filters.status) return false;
    if (filters.search && !run.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">FlowForge</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dlq')}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Dead Letter Queue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/workflow/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
                    <p className="text-xs text-muted-foreground">Active workflows</p>
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
                    <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRuns}</div>
                    <p className="text-xs text-muted-foreground">All time executions</p>
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
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Successful executions</p>
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
                    <CardTitle className="text-sm font-medium">Avg Task Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgTaskDuration.toFixed(1)}s</div>
                    <p className="text-xs text-muted-foreground">Average execution time</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Runs Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Runs</CardTitle>
                    <Button variant="outline" size="sm" onClick={loadDashboardData}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by Run ID..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="max-w-sm"
                      />
                    </div>
                    <Select value={filters.workflow} onValueChange={(value) => setFilters(prev => ({ ...prev, workflow: value }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Workflows" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Workflows</SelectItem>
                        {workflows.map(workflow => (
                          <SelectItem key={workflow.id} value={workflow.name}>
                            {workflow.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="RUNNING">Running</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CANCELED">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="rounded-md border min-w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Workflow Name</TableHead>
                          <TableHead className="w-[200px]">Run ID</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[180px]">Started At</TableHead>
                          <TableHead className="w-[120px]">Duration</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : filteredRuns.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No runs found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRuns.map((run) => (
                            <TableRow key={run.id}>
                              <TableCell className="font-medium">
                                {run.workflow?.name || 'Unknown'}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {run.id}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(run.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(run.startedAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {formatDuration(run.startedAt, run.completedAt)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/runs/${run.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
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
          </TabsContent>

          {/* Scheduler Tab */}
          <TabsContent value="scheduler">
            <SchedulerControl />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Workflows</CardTitle>
                    <div className="flex items-center space-x-2">
                      {selectedWorkflows.length > 0 && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleBulkDelete}
                          disabled={deleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deleting ? 'Deleting...' : `Delete ${selectedWorkflows.length}`}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => router.push('/workflow/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Workflow
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflows.length > 0 ? (
                      <div className="space-y-2">
                        {workflows.map((workflow) => (
                          <div 
                            key={workflow.id} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleWorkflowSelection(workflow.id)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {selectedWorkflows.includes(workflow.id) ? (
                                  <CheckSquare className="h-4 w-4" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </button>
                              <div>
                                <div className="font-medium">{workflow.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Version {workflow.version} • {workflow.nodes.length} nodes
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/workflow/${workflow.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/workflow/new?id=${workflow.id}`)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No workflows found. Create your first workflow to get started.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
