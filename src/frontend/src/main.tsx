import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

/**
 * Internet Identity AuthClient options for full-day session persistence.
 *
 * - idleOptions.disableIdle: true — disables the IdleManager entirely so
 *   inactivity never triggers an automatic logout during a working day.
 * - idleOptions.disableDefaultIdleCallback: true — even if the IdleManager
 *   were active, the default "reload the window" behaviour is suppressed.
 * - idleOptions.idleTimeout: 24 hours — belt-and-suspenders in case idle
 *   detection is re-enabled; it would fire after a full day, not 10 minutes.
 *
 * The delegation maxTimeToLive (30 days) is set inside the provider's login()
 * call and is not configurable here. This config only controls client-side
 * idle behaviour, not the cryptographic expiry of the II delegation.
 */
const iiCreateOptions = {
  idleOptions: {
    disableIdle: true,
    disableDefaultIdleCallback: true,
    idleTimeout: 24 * 60 * 60 * 1_000, // 24 hours in ms — fallback safety
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retain cached data for 5 minutes to reduce unnecessary refetches
      // during normal navigation within a working session.
      staleTime: 5 * 60 * 1_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider createOptions={iiCreateOptions}>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
