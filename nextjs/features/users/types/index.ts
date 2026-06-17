export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "accountant";
  crc: string | null;
  office_name: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormPayload {
  name: string;
  email: string;
  role: "admin" | "accountant";
  password?: string;
  crc?: string;
  office_name?: string;
  active?: boolean;
}
