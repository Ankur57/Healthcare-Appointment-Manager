export const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
};