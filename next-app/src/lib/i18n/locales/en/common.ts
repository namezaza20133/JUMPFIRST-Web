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
      required: "Please enter username, email, or phone number.",
    },
    password: {
      required: "Please enter your password.",
      min6: "Password must be at least 6 characters.",
      min8: "Password must be at least 8 characters.",
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
