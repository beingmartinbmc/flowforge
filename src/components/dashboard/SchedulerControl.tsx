import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Database, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useSchedulerStore } from '@/stores/scheduler-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function SchedulerControl() {
  const {
    isProcessing,
    lastResult,
    error,
    processingHistory,
    triggerScheduler,
    triggerRedisScheduler,
    triggerMongoScheduler,
    triggerCronScheduler,
    clearError,
    clearHistory,
  } = useSchedulerStore();

  const [config, setConfig] = useState({
    maxTasks: 10,
    processRetryQueue: true,
    runId: '',
  });

  const handleTriggerScheduler = async () => {
    try {
      await triggerScheduler(config);
      toast.success('Scheduler triggered successfully');
    } catch (error) {
      toast.error('Failed to trigger scheduler');
    }
  };

  const handleTriggerRedisScheduler = async () => {
    try {
      await triggerRedisScheduler(config);
      toast.success('Redis scheduler triggered successfully');
    } catch (error) {
      toast.error('Failed to trigger Redis scheduler');
    }
  };

  const handleTriggerMongoScheduler = async () => {
    try {
      await triggerMongoScheduler(config);
      toast.success('MongoDB scheduler triggered successfully');
    } catch (error) {
      toast.error('Failed to trigger MongoDB scheduler');
    }
  };

  const handleTriggerCronScheduler = async () => {
    try {
      await triggerCronScheduler();
      toast.success('Cron scheduler triggered successfully');
    } catch (error) {
      toast.error('Failed to trigger cron scheduler');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
      case 'processed_stuck':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'error_stuck':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      processed: { color: 'bg-green-500', text: 'Processed' },
      error: { color: 'bg-red-500', text: 'Error' },
      processed_stuck: { color: 'bg-yellow-500', text: 'Stuck Fixed' },
      error_stuck: { color: 'bg-orange-500', text: 'Stuck Error' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
    
    return (
      <Badge className={`${config.color} text-white text-xs`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Scheduler Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Scheduler Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxTasks">Max Tasks</Label>
              <Input
                id="maxTasks"
                type="number"
                value={config.maxTasks}
                onChange={(e) => setConfig(prev => ({ ...prev, maxTasks: parseInt(e.target.value) || 10 }))}
                min="1"
                max="50"
              />
            </div>
            <div>
              <Label htmlFor="processRetryQueue">Process Retry Queue</Label>
              <Select
                value={config.processRetryQueue.toString()}
                onValueChange={(value) => setConfig(prev => ({ ...prev, processRetryQueue: value === 'true' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="runId">Run ID (Optional)</Label>
              <Input
                id="runId"
                value={config.runId}
                onChange={(e) => setConfig(prev => ({ ...prev, runId: e.target.value }))}
                placeholder="Specific run ID"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Button
              onClick={handleTriggerScheduler}
              disabled={isProcessing}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Main Scheduler'}
            </Button>
            <Button
              onClick={handleTriggerRedisScheduler}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              <Database className="mr-2 h-4 w-4" />
              Redis Scheduler
            </Button>
            <Button
              onClick={handleTriggerMongoScheduler}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              <Database className="mr-2 h-4 w-4" />
              MongoDB Scheduler
            </Button>
            <Button
              onClick={handleTriggerCronScheduler}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cron Scheduler
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <XCircle className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Last Result */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Last Scheduler Run</span>
              <span className="text-sm text-muted-foreground">
                {new Date(lastResult.timestamp).toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{lastResult.processedTasks}</div>
                <div className="text-sm text-muted-foreground">Processed Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lastResult.redisTasksProcessed}</div>
                <div className="text-sm text-muted-foreground">Redis Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{lastResult.pendingTasksFound}</div>
                <div className="text-sm text-muted-foreground">Pending Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{lastResult.stuckTasksFound}</div>
                <div className="text-sm text-muted-foreground">Stuck Found</div>
              </div>
            </div>

            {/* Results List */}
            {lastResult.results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Task Results:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {lastResult.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className="font-mono">{result.taskId}</span>
                        {result.nodeId && (
                          <span className="text-muted-foreground">({result.nodeId})</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(result.status)}
                        <Badge variant="outline" className="text-xs">
                          {result.source}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processing History */}
      {processingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Processing History</CardTitle>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {processingHistory.slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {result.processedTasks} tasks processed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {result.redisTasksProcessed} Redis
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {result.pendingTasksFound} Pending
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
