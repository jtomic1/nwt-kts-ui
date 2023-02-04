export enum Role {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER',
  DRIVER = 'ROLE_DRIVER',
}

export function getAvatarClass(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return 'shadow-gold';
    case Role.DRIVER:
      return 'shadow-blue';
    case Role.USER:
      return 'shadow-white';
    default:
      return 'shadow-white';
  }
}
