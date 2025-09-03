import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hasProcessedRedirect = useRef(false);
  const redirectAttempts = useRef(0);

  useEffect(() => {
    // Bulletproof GitHub Pages SPA redirect logic
    if (typeof window !== 'undefined' && !hasProcessedRedirect.current) {
      const l = window.location;
      
      // Check if this is a redirect from 404.html
      if (l.search[1] === '/' && redirectAttempts.current < 3) {
        try {
          redirectAttempts.current += 1;
          
          // Decode the route from the query string
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          
          // Clean up the path and ensure it's valid
          let cleanPath = decoded.startsWith('/') ? decoded : `/${decoded}`;
          
          // Remove any duplicate /flowforge prefixes
          if (cleanPath.startsWith('/flowforge/')) {
            cleanPath = cleanPath.substring('/flowforge/'.length);
            if (!cleanPath.startsWith('/')) {
              cleanPath = '/' + cleanPath;
            }
          }
          
          // Prevent infinite loops by checking if we're already on the right path
          if (router.pathname !== cleanPath && cleanPath !== '/') {
            console.log('SPA redirect:', cleanPath, 'attempt:', redirectAttempts.current);
            hasProcessedRedirect.current = true;
            router.replace(cleanPath);
          } else {
            hasProcessedRedirect.current = true;
          }
        } catch (error) {
          console.error('Error processing SPA redirect:', error);
          hasProcessedRedirect.current = true;
          // Fallback: redirect to home page only if not already there
          if (router.pathname !== '/') {
            router.replace('/');
          }
        }
      } else if (redirectAttempts.current >= 3) {
        // Prevent infinite loops by stopping after 3 attempts
        console.warn('Too many redirect attempts, stopping to prevent infinite loop');
        hasProcessedRedirect.current = true;
      }
    }
  }, [router]);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
