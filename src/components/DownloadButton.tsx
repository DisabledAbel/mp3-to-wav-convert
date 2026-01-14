import { motion } from "framer-motion";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  wavBlob: Blob | null;
  originalFileName: string;
}

export const DownloadButton = ({ wavBlob, originalFileName }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!wavBlob) return;

    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = originalFileName.replace(/\.mp3$/i, ".wav");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!wavBlob) return null;

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
          Download WAV
        </Button>
      </div>
    </motion.div>
  );
};
