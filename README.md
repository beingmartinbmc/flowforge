# FlowForge - Distributed Workflow Orchestrator

A modern, visual workflow management system with real-time execution monitoring and comprehensive task management.

## 🚀 Features

### 📊 Dashboard
- **Real-time Statistics**: Total workflows, runs, success rate, and average task duration
- **Recent Runs Table**: Filterable table with workflow name, run ID, status, timing, and actions
- **Live Updates**: Auto-refresh functionality for real-time data
- **Dark Mode Toggle**: Beautiful dark/light theme switching

### 🔧 Workflow Builder
- **Visual DAG Editor**: Drag-and-drop workflow creation using React Flow
- **Multiple Node Types**: HTTP requests, Echo tasks, and custom code nodes
- **Real-time Configuration**: Inline node configuration with live preview
- **Export/Import**: JSON-based workflow export and import functionality
- **Version Control**: Built-in workflow versioning system

### 📈 Run Execution Monitoring
- **Live DAG Visualization**: Real-time workflow execution with color-coded status
- **Animated Status Updates**: Smooth transitions for task state changes
- **Comprehensive Logs**: Real-time execution logs with timestamps
- **Detailed Metrics**: Success rates, execution times, and retry statistics
- **Interactive Charts**: Pie charts and metrics visualization using Recharts

### 🚨 Dead Letter Queue (DLQ)
- **Failed Task Management**: Centralized view of all failed tasks
- **Smart Filtering**: Filter by workflow, task type, and error messages
- **Retry Functionality**: One-click task retry with retry count tracking
- **Error Classification**: Automatic error type detection and categorization
- **Bulk Operations**: Delete and retry multiple tasks

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Accessible Components**: Built with Radix UI primitives
- **TypeScript Support**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts
- **Workflow Visualization**: React Flow
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Theme**: Next Themes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── dashboard/          # Dashboard-specific components
│   └── workflow/           # Workflow builder components
├── pages/
│   ├── index.tsx          # Dashboard page
│   ├── workflow/new.tsx   # Workflow builder
│   ├── runs/[id].tsx      # Run detail page
│   └── dlq.tsx            # Dead Letter Queue
├── lib/
│   ├── api.ts             # API client
│   ├── utils.ts           # Utility functions
│   └── websocket.ts       # WebSocket connections
├── types/
│   └── index.ts           # TypeScript type definitions
└── styles/
    └── globals.css        # Global styles and CSS variables
```

## 🎯 Key Components

### Dashboard (`/`)
- **Stats Cards**: Overview of system metrics
- **Recent Runs Table**: Filterable list of workflow executions
- **Navigation**: Quick access to workflow builder and DLQ

### Workflow Builder (`/workflow/new`)
- **React Flow Canvas**: Visual workflow editor
- **Node Palette**: Drag-and-drop task nodes
- **Configuration Panel**: Inline node settings
- **Save/Export**: Workflow persistence and sharing

### Run Details (`/runs/[id]`)
- **Live DAG**: Real-time execution visualization
- **Status Tracking**: Color-coded task states
- **Logs Tab**: Streaming execution logs
- **Metrics Tab**: Performance analytics
- **Tasks Tab**: Detailed task information

### Dead Letter Queue (`/dlq`)
- **Failed Tasks**: Comprehensive error management
- **Retry Logic**: Smart retry with limits
- **Error Analysis**: Automatic error categorization
- **Bulk Operations**: Efficient task management

## 🔌 API Integration

The frontend integrates with your backend API through the `apiClient` in `src/lib/api.ts`. Key endpoints:

- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/runs` - List runs
- `GET /api/runs/:id` - Get run details
- `GET /api/runs/:id/tasks` - Get run tasks
- `POST /api/tasks/:id/retry` - Retry failed task

## 🎨 Design System

The application uses a comprehensive design system with:

- **CSS Variables**: Theme-aware color system
- **Component Variants**: Consistent button, card, and form styles
- **Responsive Breakpoints**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode**: Automatic theme switching

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_WS_URL`: WebSocket endpoint (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API integration guide

---

**FlowForge** - Empowering developers with visual workflow orchestration 🚀
# Updated Thu Aug 21 08:17:42 IST 2025
# Updated Vercel URL - Thu Aug 21 08:29:07 IST 2025
# Updated Vercel URL - Thu Aug 21 14:48:52 IST 2025
