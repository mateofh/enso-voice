export type EntitlementSource = "free" | "community" | "internal" | "personal" | "workspace";

export type EntitlementStatus = "active" | "grace" | "inactive";

export type Capability =
  "managed_cloud" | "cloud_sync" | "meetings" | "notes" | "custom_prompts" | "byok";

export interface Entitlement {
  source: EntitlementSource;
  tier: "free" | "pro";
  status: EntitlementStatus;
  capabilities: Capability[];
  expiresAt: string | null;
}

export interface CreditBalance {
  unit: "minute";
  granted: number;
  usedSeconds: number;
  remainingSeconds: number;
  resetsAt: string;
}

export const FREE_ENTITLEMENT: Entitlement = {
  source: "free",
  tier: "free",
  status: "active",
  capabilities: ["byok"],
  expiresAt: null,
};

export function hasCapability(
  entitlement: Entitlement | null | undefined,
  capability: Capability
): boolean {
  return (
    entitlement?.status !== "inactive" && entitlement?.capabilities.includes(capability) === true
  );
}
