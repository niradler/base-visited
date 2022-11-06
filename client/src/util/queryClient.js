import { QueryClient } from 'react-query';

const queryClientConfig = {
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60,
            cacheTime: 1000 * 60,
            refetchOnMount: "always",
            refetchOnWindowFocus: "always",
            refetchOnReconnect: "always",
            refetchInterval: 1000 * 60,
            refetchIntervalInBackground: false,
            suspense: false,
        },
        mutations: {
            retry: 2,
        },
    },
};

export const queryClient = new QueryClient(queryClientConfig);