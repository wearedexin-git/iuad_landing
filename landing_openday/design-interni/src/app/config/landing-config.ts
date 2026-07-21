import openDayConfig from "./openday-config.json";

export const IS_ORIENTAMENTO = openDayConfig.is_orientamento === true;

export function getApiOrigin(): string[] {
  const origin = openDayConfig.origin ?? ["website", "landing", "openday"];

  if (!IS_ORIENTAMENTO) {
    return origin;
  }

  return origin.map((item) => (item === "openday" ? "orientamento" : item));
}
