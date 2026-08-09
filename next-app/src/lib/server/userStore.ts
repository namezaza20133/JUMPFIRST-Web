export type UserRecord = {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
};

export type PublicUserProfile = Omit<UserRecord, "password">;

const seededUsers = new Map<string, UserRecord>([
  [
    "admin",
    {
      fullName: "ADMIN",
      phone: "0829168692",
      email: "namezazav5@gmail.com",
      username: "admin",
      password: "admin",
    },
  ],
]);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function findUserByIdentifier(identifier: string): UserRecord | undefined {
  const normalizedIdentifier = normalize(identifier);

  for (const user of seededUsers.values()) {
    if (
      normalize(user.email) === normalizedIdentifier ||
      normalize(user.phone) === normalizedIdentifier ||
      normalize(user.username) === normalizedIdentifier
    ) {
      return user;
    }
  }

  return undefined;
}

export function verifyUserCredentials(identifier: string, password: string): UserRecord | undefined {
  const user = findUserByIdentifier(identifier);

  if (!user) {
    return undefined;
  }

  if (user.password !== password) {
    return undefined;
  }

  return user;
}

export function updateUserPasswordByIdentifier(identifier: string, password: string): boolean {
  const user = findUserByIdentifier(identifier);

  if (!user) {
    return false;
  }

  user.password = password;
  return true;
}

export function getUserByUsername(username: string): UserRecord | undefined {
  return seededUsers.get(normalize(username));
}

export function toPublicProfile(user: UserRecord): PublicUserProfile {
  return {
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    username: user.username,
  };
}