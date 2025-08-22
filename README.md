# FlowForge - Distributed Workflow Orchestrator

A modern, serverless-compatible workflow orchestration platform built with Next.js, TypeScript, and React Flow.

## 🚀 Features

### Core Functionality
- **Visual Workflow Builder**: Drag-and-drop interface for creating complex workflows
- **Multiple Node Types**: HTTP requests, Echo tasks, Custom code execution
- **Real-time Execution**: Monitor workflow runs and task status
- **Scheduler-based Processing**: Serverless-compatible task processing
- **Template System**: Pre-built workflow templates for quick start

### Scheduler System
- **Main Scheduler**: Processes tasks from both Redis and MongoDB
- **Redis Scheduler**: Processes tasks from Redis queue only
- **MongoDB Scheduler**: Processes pending tasks directly from database
- **Cron Scheduler**: External cron job support
- **Stuck Task Recovery**: Automatically handles stuck tasks (>5 minutes)

### UI Improvements
- **Guided Workflow Creation**: Template selector with categories and difficulty levels
- **Scheduler Controls**: Real-time scheduler management and monitoring
- **Tabbed Dashboard**: Organized overview, scheduler, and workflows sections
- **Modern Design**: Beautiful, responsive UI with dark/light theme support

## 🏗️ Architecture

### Frontend (Next.js)
- **React Flow**: Visual workflow builder
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Radix UI**: Accessible components

### Backend (Vercel Functions)
- **Scheduler-based**: No long-running processes
- **Redis**: Task queue management
- **MongoDB**: Data persistence
- **Prisma**: Database ORM

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Redis (optional, for queue management)

### Frontend Setup
```bash
cd flowforge
npm install
npm run dev
```

### Backend Setup
```bash
cd ../flowforge-backend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend
DATABASE_URL=mongodb://localhost:27017/flowforge
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
```

## 🎯 Usage

### Creating Workflows

1. **Template Selection**: Choose from pre-built templates or start from scratch
2. **Visual Builder**: Drag and drop nodes to create your workflow
3. **Node Configuration**: Configure each node's parameters
4. **Save & Execute**: Save your workflow and trigger execution

### Scheduler Management

1. **Access Scheduler Tab**: Navigate to the Scheduler tab in the dashboard
2. **Configure Parameters**: Set max tasks, retry queue, and run ID
3. **Trigger Processing**: Use different scheduler types as needed
4. **Monitor Results**: View processing history and task results

### Available Templates

- **Simple Echo**: Basic logging workflow
- **API Call**: HTTP request with response logging
- **Error Handling**: Demonstrates error handling patterns
- **Health Check**: Multi-service monitoring
- **Data Processing**: Fetch, process, and store data

## 🔄 Scheduler Types

### Main Scheduler (`/api/scheduler/process`)
- Processes tasks from both Redis and MongoDB
- Handles stuck tasks automatically
- Returns detailed processing results

### Redis Scheduler (`/api/scheduler/trigger`)
- Processes tasks from Redis queue only
- Configurable max tasks and retry queue

### MongoDB Scheduler (`/api/scheduler/mongo-trigger`)
- Processes pending tasks from MongoDB
- Optional run ID filtering

### Cron Scheduler (`/api/cron/process-tasks`)
- Designed for external cron services
- Supports authentication headers

## 🚀 Deployment

### Vercel Deployment
```bash
# Frontend
vercel --prod

# Backend
cd ../flowforge-backend
vercel --prod
```

### Cron Job Setup
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/scheduler/process",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

## 📊 Monitoring

### Dashboard Metrics
- Total workflows and runs
- Success rate and average execution time
- Real-time scheduler status
- Processing history

### Scheduler Monitoring
- Task processing results
- Error tracking
- Performance metrics
- Queue status

## 🔧 Development

### Project Structure
```
flowforge/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── SchedulerControl.tsx
│   │   └── workflow/
│   │       └── TemplateSelector.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── workflow-templates.ts
│   ├── stores/
│   │   ├── auth-store.ts
│   │   ├── workflow-store.ts
│   │   └── scheduler-store.ts
│   └── types/
│       └── index.ts
└── package.json
```

### Key Components

#### SchedulerControl
- Manages scheduler operations
- Real-time monitoring
- Configuration management
- Result visualization

#### TemplateSelector
- Template browsing and filtering
- Category and difficulty filtering
- Search functionality
- Template preview

#### Workflow Templates
- Pre-built workflow examples
- Categorized by use case
- Difficulty levels
- Comprehensive documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the scheduler README in the backend

## 🔄 Migration from Long-running Workers

The scheduler-based approach replaces the previous long-running worker system:

### Benefits
- ✅ Serverless compatible
- ✅ Better resource utilization
- ✅ Automatic scaling
- ✅ Cost effective
- ✅ Reliable task processing

### Migration Steps
1. Deploy new scheduler endpoints
2. Set up cron job triggers
3. Test workflow execution
4. Monitor performance
5. Remove old worker code

## 🎉 What's New

### v2.0.0 - Scheduler-based Architecture
- ✨ Scheduler-based task processing
- 🎨 Guided workflow creation with templates
- 📊 Enhanced dashboard with scheduler controls
- 🔧 Improved UI/UX with tabbed interface
- 📈 Real-time monitoring and metrics
- 🚀 Serverless deployment ready
# Updated Fri Aug 22 20:04:51 IST 2025
