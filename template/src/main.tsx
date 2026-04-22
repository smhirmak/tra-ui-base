import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/contexts/theme/ThemeProvider';
import { routeTree } from './routeTree.gen';
import './styles.css';

// ─── Router type registration ──────────────────────────────────────────────
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ─── RouterSetup ──────────────────────────────────────────────────────────
const RouterSetup = () => {
  const [router] = useState(() =>
    createRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      scrollRestoration: true,
      defaultStructuralSharing: true,
      defaultPreloadStaleTime: 0,
    }),
  );

  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </>
  );
};

// ─── Render ────────────────────────────────────────────────────────────────
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThemeProvider defaultTheme="light" storageKey="tra-ui-theme">
      <QueryClientProvider client={queryClient}>
        {/* [i18n]      → LocaleProvider sarın (npx tra-ui add i18n) */}
        {/* [auth/http] → AuthProvider sarın (npx tra-ui add http) */}
        {/* [signalr]   → MessageHubProvider sarın (npx tra-ui add signalr) */}
        <RouterSetup />
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: false,
            },
          ]}
        />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
