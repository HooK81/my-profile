export type JwtPayload = {
  role: string;
  deviceFingerprint: string;
  iat: number;
};

export type JwtToken = JwtPayload & {
  exp: number;
};
