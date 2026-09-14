import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppErrorBoundary } from '../core/errors/AppErrorBoundary';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 2, refetchOnWindowFocus: false },
          mutations: { retry: 1 },
        },
      }),
  );

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}
