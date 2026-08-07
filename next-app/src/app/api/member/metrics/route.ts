import { okResponse } from "@/lib/api/response";
import { memberMetrics } from "@/lib/content/memberContent";
import type { MemberMetricContent } from "@/lib/types/content";

export async function GET() {
  return okResponse<MemberMetricContent[]>(memberMetrics);
}
