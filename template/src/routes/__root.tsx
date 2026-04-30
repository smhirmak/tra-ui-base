import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/layout/header';
import Footer from '@/layout/footer';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
});
