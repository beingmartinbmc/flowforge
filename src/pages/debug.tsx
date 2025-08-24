import { useEffect, useState } from 'react';
import { getPath } from '@/lib/utils';

export default function Debug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      href: window.location.href,
      basePath: getPath(''),
      loginPath: getPath('/login'),
      isGitHubPages: window.location.hostname === 'beingmartinbmc.github.io',
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">FlowForge Debug Info</h1>
        
        <div className="grid gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Routing Information</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Test Links</h2>
            <div className="space-y-2">
              <a href={getPath('/')} className="block text-blue-500 hover:underline">
                Home: {getPath('/')}
              </a>
              <a href={getPath('/login')} className="block text-blue-500 hover:underline">
                Login: {getPath('/login')}
              </a>
              <a href="/flowforge/" className="block text-blue-500 hover:underline">
                Direct FlowForge: /flowforge/
              </a>
              <a href="/flowforge/login" className="block text-blue-500 hover:underline">
                Direct Login: /flowforge/login
              </a>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                auth_token: localStorage.getItem('auth_token') ? 'EXISTS' : 'NOT_FOUND',
                user: localStorage.getItem('user') ? 'EXISTS' : 'NOT_FOUND',
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
