import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (role: string) => {
  if (!role || typeof role !== 'string') {
    throw new Error('Roles decorator requires a non-empty string argument.');
  }
  return SetMetadata(ROLES_KEY, [role]);
};
