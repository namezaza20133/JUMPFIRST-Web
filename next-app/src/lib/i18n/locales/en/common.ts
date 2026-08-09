export const common = {
  nav: {
    home: "Home",
    courses: "Courses",
    dashboard: "Dashboard",
    contact: "Contact",
  },
  auth: {
    login: "Login",
    register: "Register",
    logout: "Logout",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
  backToTop: "Back to top",
  errors: {
    network: "Network error. Please check your connection and try again.",
    validation: "Some information is invalid. Please review and try again.",
    notFound: "The requested resource was not found.",
    server: "Server error. Please try again in a moment.",
    unknown: "Something went wrong. Please try again.",
  },
  validationFields: {
    identifier: {
      required: "Please enter your email or phone number.",
      format: "Please enter a valid email or phone number.",
    },
    password: {
      required: "Please enter your password.",
      min6: "Password must be at least 6 characters.",
      min8: "Password must be at least 8 characters.",
      invalidCredentials: "Email or phone number or password is incorrect.",
    },
    fullName: {
      required: "Please enter your full name.",
      min2: "Full name must be at least 2 characters.",
    },
    phone: {
      required: "Please enter your phone number.",
      format: "Phone number format is invalid.",
    },
    email: {
      required: "Please enter your email.",
      format: "Email format is invalid.",
    },
    username: {
      required: "Please enter your username.",
      format: "Username must be 3-20 chars using letters, numbers, dot, underscore, or hyphen.",
    },
    provider: {
      required: "Please select a sign-in provider.",
      unsupported: "This sign-in provider is not supported.",
    },
    token: {
      required: "The password reset link is missing or expired.",
      invalid: "The password reset link is invalid or expired.",
    },
    otpCode: {
      required: "Please enter the 6-digit OTP.",
      format: "OTP must be exactly 6 digits.",
      invalid: "OTP is invalid or expired.",
    },
    name: {
      required: "Please enter your name.",
      min2: "Name must be at least 2 characters.",
    },
    message: {
      required: "Please enter your message.",
      min10: "Message must be at least 10 characters.",
    },
  },
} as const;
