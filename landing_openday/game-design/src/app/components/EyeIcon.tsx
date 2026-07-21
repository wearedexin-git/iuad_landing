import { ControllerIcon } from "./ControllerIcon";

interface EyeIconProps {
  className?: string;
  variant?: "large" | "medium" | "small" | "tiny";
}

export function EyeIcon({ className = "", variant = "large" }: EyeIconProps) {
  return <ControllerIcon className={className} variant={variant} />;
}
