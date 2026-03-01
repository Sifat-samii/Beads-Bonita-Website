export const customerAuthLinks = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Account", href: "/account" },
] as const;

export const adminAuthLinks = [
  { label: "Admin Login", href: "/login" },
] as const;

export const authMessages = {
  invalidCredentials: "Invalid email or password.",
  adminAccessRequired: "Admin access is required for this area.",
  oauthFailed: "Google sign-in could not be completed. Please try again.",
  accountCreated:
    "Your account has been created. If email confirmation is enabled, please verify your email before signing in.",
  signedOut: "You have been signed out.",
} as const;
