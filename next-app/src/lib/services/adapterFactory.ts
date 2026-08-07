import { createApiAdapters } from "@/lib/services/apiAdapters";
import { createMockAdapters } from "@/lib/services/mockAdapters";
import type { ServiceAdapterMode, ServiceAdapters } from "@/lib/services/contracts";

const ADAPTER_MODE_ENV = "NEXT_PUBLIC_SERVICE_ADAPTER";

let cachedAdapters: ServiceAdapters | null = null;

function resolveMode(): ServiceAdapterMode {
  if (process.env[ADAPTER_MODE_ENV] === "api") {
    return "api";
  }

  return "mock";
}

export function getServiceAdapters(): ServiceAdapters {
  if (cachedAdapters) {
    return cachedAdapters;
  }

  const mode = resolveMode();
  cachedAdapters = mode === "api" ? createApiAdapters() : createMockAdapters();

  return cachedAdapters;
}
