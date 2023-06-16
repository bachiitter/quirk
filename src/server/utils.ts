import Stripe from "stripe";

import type { Env } from "./env";

// A helper function to create a JSON respons
export const jsonResp = <T>(body: T, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

// A helper function to get device type from the request
export const getDeviceType = (request: Request) => {
  const userAgent = request.headers.get("User-Agent");
  const deviceType = userAgent?.match(/\((.*?)\)/)?.[1] ?? "Unknown";

  return deviceType;
};

// A helper function to get browser name from the request
export const getBrowserName = (request: Request) => {
  const userAgent = request.headers.get("User-Agent");

  let browserName: string;

  switch (true) {
    case userAgent?.includes("Firefox"): {
      const match = userAgent?.match(/Firefox\/([\d.]+)/);
      const browserVersion = match ? match[1] : "Unknown";
      browserName = `Mozilla Firefox ${browserVersion}`;
      break;
    }
    case userAgent?.includes("CriOS"):
    case userAgent?.includes("Chrome"):
    case userAgent?.includes("Chromium"): {
      const match = userAgent?.match(/(?:CriOS|Chrome|Chromium)\/([\d.]+)/);
      const browserVersion = match ? match[1] : "Unknown";
      browserName = `Google Chrome ${browserVersion}`;
      break;
    }
    case userAgent?.includes("Edg"): {
      const match = userAgent?.match(/Edg\/([\d.]+)/);
      const browserVersion = match ? match[1] : "Unknown";
      browserName = `Microsoft Edge ${browserVersion}`;
      break;
    }
    case userAgent?.includes("Safari"): {
      const match = userAgent?.match(/Version\/([\d.]+).*Safari/);
      const browserVersion = match ? match[1] : "Unknown";
      browserName = `Apple Safari ${browserVersion}`;
      break;
    }
    case userAgent?.includes("Trident"):
    case userAgent?.includes("MSIE"): {
      const match = userAgent?.match(/(?:Trident\/.*?rv:|MSIE\s)([\d.]+)/);
      const browserVersion = match ? match[1] : "Unknown";
      browserName = `Internet Explorer ${browserVersion}`;
      break;
    }
    default: {
      browserName = "Unknown";
      break;
    }
  }

  return browserName;
};

export const stripe = (env: Env) =>
  new Stripe(env.STRIPE_API_KEY, {
    apiVersion: "2022-11-15",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });
