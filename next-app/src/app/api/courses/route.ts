import { okResponse } from "@/lib/api/response";
import { courseCards } from "@/lib/content/coursesContent";
import type { CourseCardContent } from "@/lib/types/content";

export async function GET() {
  return okResponse<CourseCardContent[]>(courseCards);
}
