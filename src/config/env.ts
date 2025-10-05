export const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "dsjnfesfjwefjwejfwenfewnfwehnfwenfwenfjwebfwebfbewfb",
};
