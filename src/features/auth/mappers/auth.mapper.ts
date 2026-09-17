import type { AuthLoginDto } from "../schemas/auth.schema";
import type { AuthSession } from "../types/auth";

export function toAuthSession(dto: AuthLoginDto): AuthSession {
  return {
    token: dto.accessToken,
    user: {
      id: dto.id,
      username: dto.username,
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
      ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      ...(dto.image !== undefined ? { image: dto.image } : {}),
    },
  };
}
