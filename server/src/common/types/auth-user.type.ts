import { Role } from '../constants/roles';

export interface AuthUser {
  id: string;
  role: Role;
  telegramId?: string;
  email?: string;
}
