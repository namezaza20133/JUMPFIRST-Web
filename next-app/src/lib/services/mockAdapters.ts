import { courseCards } from "@/lib/content/coursesContent";
import { memberMetrics } from "@/lib/content/memberContent";
import { mockDelay } from "@/lib/services/mockDelay";
import type { ServiceAdapters } from "@/lib/services/contracts";

const FORCE_COURSES_ERROR_FLAG = "NEXT_PUBLIC_FORCE_COURSES_ERROR";

export function createMockAdapters(): ServiceAdapters {
  return {
    auth: {
      login: async (payload) => {
        await mockDelay(280);

        if (!payload.identifier.trim() || !payload.password.trim()) {
          return { success: false, message: "Missing credentials" };
        }

        return { success: true, message: "Login successful" };
      },

      register: async (payload) => {
        await mockDelay(320);

        const requiredValues = [
          payload.fullName,
          payload.phone,
          payload.email,
          payload.username,
          payload.password,
        ];
        const hasEmptyField = requiredValues.some((value) => !value.trim());

        if (hasEmptyField) {
          return { success: false, message: "Missing registration fields" };
        }

        return { success: true, message: "Registration successful" };
      },
    },

    contact: {
      submitContact: async (payload) => {
        await mockDelay(300);

        if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) {
          return { success: false, message: "Missing contact fields" };
        }

        return { success: true, message: "Contact submitted" };
      },
    },

    courses: {
      listCourses: async () => {
        await mockDelay(450);

        if (process.env[FORCE_COURSES_ERROR_FLAG] === "1") {
          throw new Error("Mock courses service error");
        }

        return courseCards;
      },
    },

    member: {
      getMemberMetrics: async () => {
        await mockDelay(300);
        return memberMetrics;
      },
    },
  };
}
