import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const queryClient = new QueryClient();

const Layout: FC<{children: ReactNode}> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Layout;
