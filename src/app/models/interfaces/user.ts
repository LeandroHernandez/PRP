export interface User {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  identification?: string;
  displayName?: string;
  emailVerified?: boolean;
  role?: string;
  role_name?: string;
  user_type?: string;
  status_u?:boolean;
}
