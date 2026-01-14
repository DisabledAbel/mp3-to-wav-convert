import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

export type Bitrate = 128 | 192 | 256 | 320;

interface QualitySelectorProps {
  bitrate: Bitrate;
  onChange: (bitrate: Bitrate) => void;
}

const bitrateOptions: { value: Bitrate; label: string; description: string }[] = [
  { value: 128, label: "128 kbps", description: "Smaller file" },
  { value: 192, label: "192 kbps", description: "Balanced" },
  { value: 256, label: "256 kbps", description: "High quality" },
  { value: 320, label: "320 kbps", description: "Best quality" },
];

export const QualitySelector = ({ bitrate, onChange }: QualitySelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Settings2 className="w-4 h-4" />
        <span>Output Quality</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {bitrateOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
              ${
                bitrate === option.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {bitrate === option.value && (
              <motion.div
                layoutId="quality-indicator"
                className="absolute inset-0 border-2 border-primary rounded-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="font-medium text-sm relative z-10">{option.label}</span>
            <span className="text-xs text-muted-foreground relative z-10">{option.description}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
