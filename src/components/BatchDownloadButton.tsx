import { motion, AnimatePresence } from "framer-motion";
import { Download, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchFile } from "@/components/BatchFileList";
import { ConversionDirection } from "@/lib/audioConverter";

interface BatchDownloadButtonProps {
  files: BatchFile[];
  direction: ConversionDirection;
}

export const BatchDownloadButton = ({ files, direction }: BatchDownloadButtonProps) => {
  const completedFiles = files.filter((f) => f.status === "completed" && f.outputBlob);
  const outputExt = direction === "mp3-to-wav" ? "wav" : "mp3";

  const handleDownloadSingle = (file: BatchFile) => {
    if (!file.outputBlob) return;
    
    const url = URL.createObjectURL(file.outputBlob);
    const a = document.createElement("a");
    a.href = url;
    
    const originalName = file.file.name;
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}.${outputExt}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    // Download each file individually with a small delay
    for (const file of completedFiles) {
      handleDownloadSingle(file);
      // Small delay to prevent browser from blocking multiple downloads
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  if (completedFiles.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="space-y-3"
      >
        {completedFiles.length > 1 && (
          <Button
            onClick={handleDownloadAll}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            size="lg"
          >
            <Archive className="w-5 h-5 mr-2" />
            Download All ({completedFiles.length} files)
          </Button>
        )}
        
        <div className="space-y-2">
          {completedFiles.map((file) => (
            <Button
              key={file.id}
              onClick={() => handleDownloadSingle(file)}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {file.file.name.replace(/\.[^/.]+$/, "")}.{outputExt}
              </span>
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
