import { motion, AnimatePresence } from "framer-motion";
import { FileAudio, X, Check, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface BatchFile {
  id: string;
  file: File;
  status: "pending" | "converting" | "completed" | "error";
  progress: number;
  outputBlob?: Blob;
  error?: string;
}

interface BatchFileListProps {
  files: BatchFile[];
  onRemoveFile: (id: string) => void;
}

export const BatchFileList = ({ files, onRemoveFile }: BatchFileListProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusIcon = (status: BatchFile["status"]) => {
    switch (status) {
      case "pending":
        return <FileAudio className="w-5 h-5 text-muted-foreground" />;
      case "converting":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "completed":
        return <Check className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusColor = (status: BatchFile["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted/50";
      case "converting":
        return "bg-primary/5 border-primary/20";
      case "completed":
        return "bg-green-500/5 border-green-500/20";
      case "error":
        return "bg-destructive/5 border-destructive/20";
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </p>
        <p className="text-sm text-muted-foreground">
          {files.filter((f) => f.status === "completed").length} / {files.length} completed
        </p>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {files.map((batchFile) => (
            <motion.div
              key={batchFile.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${getStatusColor(batchFile.status)}
              `}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(batchFile.status)}
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {batchFile.file.name}
                  </p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatFileSize(batchFile.file.size)}
                  </span>
                </div>
                
                {batchFile.status === "converting" && (
                  <Progress value={batchFile.progress} className="h-1.5" />
                )}
                
                {batchFile.error && (
                  <p className="text-xs text-destructive">{batchFile.error}</p>
                )}
              </div>
              
              {(batchFile.status === "pending" || batchFile.status === "error") && (
                <button
                  onClick={() => onRemoveFile(batchFile.id)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
