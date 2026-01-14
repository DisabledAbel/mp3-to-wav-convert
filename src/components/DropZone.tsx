import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileAudio, X } from "lucide-react";

interface DropZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}

export const DropZone = ({ file, onFileSelect, onFileClear }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type === "audio/mpeg" || droppedFile.name.endsWith(".mp3")) {
          onFileSelect(droppedFile);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center w-full h-64 
              border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-300 ease-out
              ${
                isDragging
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? "Drop your MP3 here" : "Drag & drop your MP3 file"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            </motion.div>

            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none"
              />
            )}
          </motion.label>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-6 rounded-lg bg-muted/50 border border-border"
          >
            <div className="p-3 rounded-lg bg-primary/10">
              <FileAudio className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={onFileClear}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
