import AppWrapper from "./AppWrapper";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { NodeProvider } from "@/context/NodeContext";
import { SearchProvider } from "@/context/SearchContext";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const { system } = await api.get(API_ENDPOINTS.fetchThemeConfig);

  return (
    <html lang="en">
      <body>
        <NodeProvider>
          <SearchProvider>
            <AppWrapper session={session} themeConfig={system}>
              {children}
            </AppWrapper>
          </SearchProvider>
        </NodeProvider>
      </body>
    </html>
  );
}
