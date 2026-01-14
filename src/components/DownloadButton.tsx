import { motion } from "framer-motion";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionDirection } from "@/lib/audioConverter";

interface DownloadButtonProps {
  outputBlob: Blob | null;
  originalFileName: string;
  direction: ConversionDirection;
}

export const DownloadButton = ({ outputBlob, originalFileName, direction }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!outputBlob) return;

    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    
    if (direction === "mp3-to-wav") {
      a.download = originalFileName.replace(/\.mp3$/i, ".wav");
    } else {
      a.download = originalFileName.replace(/\.wav$/i, ".mp3");
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!outputBlob) return null;

  const outputFormat = direction === "mp3-to-wav" ? "WAV" : "MP3";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full"
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-center gap-2 text-accent">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Conversion complete!</span>
        </div>
        <Button
          onClick={handleDownload}
          size="lg"
          variant="outline"
          className="w-full sm:w-auto px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="w-5 h-5 mr-2" />
          Download {outputFormat}
        </Button>
      </div>
    </motion.div>
  );
};
