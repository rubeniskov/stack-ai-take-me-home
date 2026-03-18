import { ConnectorType } from "@/lib/api";

export const ConnectionNames: Record<ConnectorType, string> = {
  [ConnectorType.GDRIVE]: "Google Drive",
};
