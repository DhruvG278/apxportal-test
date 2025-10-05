import { config } from "@/config/env";

export const token = { refresh_token: process.env.ZOHO_REFRESH_TOKEN };

let currentToken: any = {
  access_token: config.ACCESS_TOKEN,
  refresh_token: config.REFRESH_TOKEN,
  expires_at: Date.now(),
};

export function setToken(t: any) {
  currentToken = t;
}

export function getToken() {
  return currentToken;
}
