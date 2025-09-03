import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { getPath } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Don't redirect if we're still loading or if we're already redirecting
    if (loading || redirecting) return;
    
    // Don't redirect if we're in the middle of SPA routing
    if (typeof window !== 'undefined' && window.location.search.includes('?/')) {
      return;
    }
    
    // Don't redirect if we have malformed URLs (like ?/flowforge)
    if (typeof window !== 'undefined' && window.location.search.includes('?/flowforge')) {
      return;
    }
    
    // Only redirect if we're not authenticated
    if (!isAuthenticated) {
      setRedirecting(true);
      // Add a small delay to prevent rapid redirects
      setTimeout(() => {
        router.push(getPath('/login'));
      }, 100);
    }
  }, [isAuthenticated, loading, router, redirecting]);

  // Reset redirecting state when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      setRedirecting(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
