import type { CourseCardContent, MemberMetricContent } from "@/lib/types/content";
import type {
  ContactRequest,
  LoginRequest,
  RecoveryRequest,
  ResetPasswordRequest,
  RegisterRequest,
  SocialLoginRequest,
  SubmitResult,
} from "@/lib/types/services";

export type AuthService = {
  login: (payload: LoginRequest) => Promise<SubmitResult>;
  logout: () => Promise<SubmitResult>;
  socialLogin: (payload: SocialLoginRequest) => Promise<SubmitResult>;
  recoverPassword: (payload: RecoveryRequest) => Promise<SubmitResult>;
  resetPassword: (payload: ResetPasswordRequest) => Promise<SubmitResult>;
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
