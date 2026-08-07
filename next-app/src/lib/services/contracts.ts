import type { CourseCardContent, MemberMetricContent } from "@/lib/types/content";
import type { ContactRequest, LoginRequest, RegisterRequest, SubmitResult } from "@/lib/types/services";

export type AuthService = {
  login: (payload: LoginRequest) => Promise<SubmitResult>;
  register: (payload: RegisterRequest) => Promise<SubmitResult>;
};

export type ContactService = {
  submitContact: (payload: ContactRequest) => Promise<SubmitResult>;
};

export type CoursesService = {
  listCourses: () => Promise<CourseCardContent[]>;
};

export type MemberService = {
  getMemberMetrics: () => Promise<MemberMetricContent[]>;
};

export type ServiceAdapters = {
  auth: AuthService;
  contact: ContactService;
  courses: CoursesService;
  member: MemberService;
};

export type ServiceAdapterMode = "mock" | "api";
