import { defineStorage } from '@aws-amplify/backend';

enum ERoles {
  ADMINS = 'ADMINS',
  EDITORS = 'EDITORS',
  VIEWERS = 'VIEWERS',
}

export const storage = defineStorage({
  name: 'avatar-bucket',
  isDefault: true,
  access: (allow) => {
    const groupsAllowedToWriteOwnAvatar = Object.values(ERoles).map(
      (role) => role,
    ) as string[];

    const groupAccess = {
      'private/{entity_id}/*': [
        allow
          .groups(groupsAllowedToWriteOwnAvatar)
          .to(['write', 'read', 'delete']),
      ],
    };

    return groupAccess;
  },
});
