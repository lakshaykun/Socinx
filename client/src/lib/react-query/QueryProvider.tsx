import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children} : {children: ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
