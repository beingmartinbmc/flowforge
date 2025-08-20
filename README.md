# FlowForge Frontend - Distributed Workflow Orchestrator

A modern, responsive web interface for managing and monitoring distributed workflows. Built with Next.js, React Flow, and Tailwind CSS.

## Features

- **Workflow Designer**: Visual drag-and-drop workflow builder with React Flow
- **Real-time Monitoring**: Live status updates via WebSocket
- **Run Management**: View, manage, and retry workflow executions
- **Metrics Dashboard**: Comprehensive analytics and performance metrics
- **Task Configuration**: Intuitive node configuration panels
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication**: Secure login and user management

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Workflow Designer**: React Flow
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: WebSocket

## Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Workflow Designer
![Workflow Designer](https://via.placeholder.com/800x400?text=Workflow+Designer+Screenshot)

### Run Details
![Run Details](https://via.placeholder.com/800x400?text=Run+Details+Screenshot)

## Prerequisites

- Node.js 18+
- FlowForge Backend running on port 3001

## Installation

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
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   
   # WebSocket Configuration
   NEXT_PUBLIC_WS_URL=ws://localhost:3001
   
   # Authentication
   NEXT_PUBLIC_AUTH_ENABLED=true
   
   # Development
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Usage

### Authentication

1. Navigate to the login page
2. Register a new account or login with existing credentials
3. You'll be redirected to the dashboard upon successful authentication

### Creating Workflows

1. **Access the Workflow Designer**
   - Click on the "Designer" tab in the sidebar
   - Or click "New Workflow" from the Workflows page

2. **Add Nodes**
   - Drag nodes from the palette on the left
   - Available node types:
     - **HTTP Request**: Make REST API calls
     - **Echo**: Log messages
     - **Start/End**: Workflow boundaries

3. **Configure Nodes**
   - Click on any node to open the configuration panel
   - Set node-specific parameters (URL, method, headers, etc.)
   - Configure node names and descriptions

4. **Connect Nodes**
   - Drag from a node's output to another node's input
   - This defines the workflow execution order

5. **Save Workflow**
   - Enter a workflow name and description
   - Click "Save Workflow" to persist your design

### Running Workflows

1. **From Workflow List**
   - Navigate to the "Workflows" tab
   - Click the "Run" button on any workflow card
   - Provide input data if required

2. **From Workflow Designer**
   - Click "Test Run" to execute the current workflow
   - View real-time execution status

### Monitoring Runs

1. **View Run List**
   - Navigate to the "Runs" tab
   - See all workflow executions with status and timing

2. **Run Details**
   - Click "View" on any run to see detailed information
   - Monitor individual task status and logs
   - Retry failed tasks if needed

3. **Real-time Updates**
   - Status updates appear automatically via WebSocket
   - No need to refresh the page

### Analytics Dashboard

1. **System Metrics**
   - View overall system performance
   - Monitor success rates and execution times
   - Track active workflows and tasks

2. **Workflow-specific Metrics**
   - Drill down into individual workflow performance
   - Analyze task-level metrics
   - Identify bottlenecks and optimization opportunities

## Project Structure

```
src/
├── components/           # React components
│   ├── dashboard/       # Dashboard components
│   │   ├── Dashboard.tsx
│   │   ├── Metrics.tsx
│   │   ├── RunList.tsx
│   │   ├── WorkflowList.tsx
│   │   └── RunDetails.tsx
│   └── workflow/        # Workflow designer components
│       ├── WorkflowDesigner.tsx
│       └── NodeConfigPanel.tsx
├── lib/                 # Utilities and services
│   ├── api.ts          # API client
│   └── websocket.ts    # WebSocket client
├── stores/              # State management
│   ├── auth-store.ts   # Authentication state
│   └── workflow-store.ts # Workflow state
├── pages/               # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── index.tsx       # Dashboard page
│   └── login.tsx       # Login page
├── styles/              # Global styles
│   └── globals.css     # Tailwind CSS
└── types/               # TypeScript types
    └── index.ts        # Shared types
```

## API Integration

The frontend communicates with the backend through:

- **REST API**: For CRUD operations and data fetching
- **WebSocket**: For real-time status updates
- **Authentication**: JWT-based token management

### Key API Endpoints Used

- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/[id]/runs` - Trigger workflow execution
- `GET /api/runs` - List runs
- `GET /api/runs/[id]` - Get run details
- `GET /api/metrics` - Get system metrics
- `WS /api/ws` - Real-time updates

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting (configured via ESLint)

### State Management

The application uses Zustand for state management with two main stores:

- **AuthStore**: Manages authentication state and user information
- **WorkflowStore**: Manages workflow data, runs, and API interactions

### Component Architecture

- **Functional Components**: All components use React hooks
- **Custom Hooks**: Reusable logic extracted into custom hooks
- **TypeScript**: Full type safety throughout the application

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js configuration

2. **Environment Variables**
   - Set the following in Vercel dashboard:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_WS_URL`
     - `NEXT_PUBLIC_AUTH_ENABLED`

3. **Deploy**
   - Push to main branch for automatic deployment
   - Or trigger manual deployment from Vercel dashboard

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use `npm run build` and `npm run start`
- **AWS Amplify**: Configure build settings for Next.js
- **Docker**: Use the provided Dockerfile

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure backend is running on port 3001
   - Check `NEXT_PUBLIC_WS_URL` environment variable
   - Verify CORS configuration on backend

2. **API Requests Failing**
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure backend is running and accessible
   - Verify authentication token is valid

3. **Workflow Designer Not Loading**
   - Check browser console for React Flow errors
   - Ensure all dependencies are installed
   - Clear browser cache if needed

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works on all screen sizes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting section

## Roadmap

- [ ] Advanced workflow templates
- [ ] Workflow versioning and rollback
- [ ] Advanced task types (database, file operations)
- [ ] Workflow scheduling and cron jobs
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile app companion
- [ ] API rate limiting and quotas
# flowforge
