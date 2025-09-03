import { useEffect, useState } from 'react';
import { getPath } from '@/lib/utils';

// Client-side only component for localStorage access
function LocalStorageDebug() {
  const [storageInfo, setStorageInfo] = useState<any>({});

  useEffect(() => {
    setStorageInfo({
      auth_token: localStorage.getItem('auth_token') ? 'EXISTS' : 'NOT_FOUND',
      user: localStorage.getItem('user') ? 'EXISTS' : 'NOT_FOUND',
    });
  }, []);

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Local Storage (Client-Side)</h2>
      <pre className="bg-muted p-4 rounded text-sm overflow-auto">
        {JSON.stringify(storageInfo, null, 2)}
      </pre>
    </div>
  );
}

export default function Debug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
      href: typeof window !== 'undefined' ? window.location.href : 'server',
      basePath: getPath(''),
      loginPath: getPath('/login'),
      isGitHubPages: typeof window !== 'undefined' ? window.location.hostname === 'beingmartinbmc.github.io' : false,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
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
              <a href={getPath('/login')} className="block text-blue-500 hover:underline">
                Login: {getPath('/login')}
              </a>
              <a href={getPath('/')} className="block text-blue-500 hover:underline">
                Home: {getPath('/')}
              </a>
            </div>
          </div>

          <LocalStorageDebug />
        </div>
      </div>
    </div>
  );
}
