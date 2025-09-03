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

  useEffect(() => {
    // GitHub Pages SPA redirect logic
    if (typeof window !== 'undefined' && !hasProcessedRedirect.current) {
      const l = window.location;
      
      // Check if this is a redirect from 404.html
      if (l.search[1] === '/' ) {
        try {
          hasProcessedRedirect.current = true;
          
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          
          // Clean up the path and navigate properly
          const cleanPath = decoded.startsWith('/') ? decoded : `/${decoded}`;
          
          // Prevent infinite loops by checking if we're already on the right path
          if (router.pathname !== cleanPath) {
            console.log('SPA redirect:', cleanPath);
            router.replace(cleanPath);
          }
        } catch (error) {
          console.error('Error processing SPA redirect:', error);
          // Fallback: redirect to home page
          if (router.pathname !== '/') {
            router.replace('/');
          }
        }
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
