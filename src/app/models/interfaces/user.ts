export interface User {
  uid: string;
  email: string;
  password: string;
  identification: string;
  displayName: string;
  emailVerified: boolean;
  role?: string;
  user_type?: string;
}
