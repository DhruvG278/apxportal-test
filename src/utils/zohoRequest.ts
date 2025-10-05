import axios from "axios";
import { config } from "@/config/env";
import { token, setToken, getToken } from "./cache"; // <-- ensure set/get methods exist

// 🌍 Choose your Zoho region (important!)
const ZOHO_ACCOUNTS_BASE = "https://accounts.zoho.com"; // change to .com, .eu, etc. if needed
const ZOHO_API_BASE = "https://www.zohoapis.com/crm/v2"; // must match the region above

// 🧠 In-memory token cache (fast access)
let zoho_access_token = getToken()?.access_token || config.ACCESS_TOKEN;
let zoho_refresh_token = getToken()?.refresh_token || config.REFRESH_TOKEN;
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// 🧰 Generic Zoho API request handler
export async function zohoApiRequest(
  method: string,
  endpoint: string,
  data?: any
) {
  try {
    // 🚀 First attempt
    const response = await axios({
      method,
      url: `${ZOHO_API_BASE}/${endpoint}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${zoho_access_token}`,
        "Content-Type": "application/json",
      },
      data,
    });

    return {
      data: response.data,
      access_token: zoho_access_token,
      refresh_token: zoho_refresh_token,
    };
  } catch (error: any) {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // 🧩 If token invalid, refresh once and retry
    if (status === 401 || code === "INVALID_TOKEN") {
      console.warn("Access token invalid, refreshing...");

      const new_access_token = await refreshAccessToken(
        zoho_refresh_token ?? ""
      );
      zoho_access_token = new_access_token;

      // 🔄 Retry with the new token
      const retryResponse = await axios({
        method,
        url: `${ZOHO_API_BASE}/${endpoint}`,
        headers: {
          Authorization: `Zoho-oauthtoken ${new_access_token}`,
          "Content-Type": "application/json",
        },
        data,
      });

      return {
        data: retryResponse.data,
        access_token: new_access_token,
        refresh_token: zoho_refresh_token,
      };
    }

    // 🧨 If not auth issue, throw
    throw error;
  }
}

// ♻️ Safely refresh Zoho access token (with queue)
async function refreshAccessToken(refresh_token: string): Promise<string> {
  if (isRefreshing && refreshPromise) {
    console.log("Refresh already in progress, waiting...");
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    console.log("refreshing token", refresh_token);
    try {
      const response = await axios.post(
        `${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`,
        null,
        {
          params: {
            refresh_token,
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            grant_type: "refresh_token",
          },
        }
      );
      console.log("firs========================-t", response.data);
      const new_access_token = response.data.access_token;
      console.log("✅ Token refreshed successfully:", new_access_token);

      // 💾 Update both memory + cache
      zoho_access_token = new_access_token;
      setToken({
        access_token: new_access_token,
        refresh_token,
        expires_at: Date.now() + 3600 * 1000, // 1 hour expiry
      });

      return new_access_token;
    } catch (error: any) {
      const errData = error.response?.data || error.message;
      console.error("❌ Error refreshing Zoho token:", errData);

      // Handle Zoho rate limit or access denied gracefully
      if (errData?.error_description?.includes("too many requests")) {
        throw new Error(
          "Zoho rate limit reached — please wait a few minutes before retrying."
        );
      }

      throw new Error("Unable to refresh Zoho access token");
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
