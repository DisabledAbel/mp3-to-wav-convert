import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Files } from "lucide-react";
import { ConversionDirection } from "@/lib/audioConverter";

interface BatchDropZoneProps {
  direction: ConversionDirection;
  onFilesSelect: (files: File[]) => void;
  hasFiles: boolean;
}

export const BatchDropZone = ({ direction, onFilesSelect, hasFiles }: BatchDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const acceptedType = direction === "mp3-to-wav" ? "audio/mpeg" : "audio/wav";
  const acceptedExt = direction === "mp3-to-wav" ? ".mp3" : ".wav";
  const formatLabel = direction === "mp3-to-wav" ? "MP3" : "WAV";

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

  const validateFiles = useCallback((fileList: FileList): File[] => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isValidMp3 = direction === "mp3-to-wav" && 
        (file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3"));
      const isValidWav = direction === "wav-to-mp3" && 
        (file.type === "audio/wav" || file.type === "audio/wave" || file.name.toLowerCase().endsWith(".wav"));
      
      if (isValidMp3 || isValidWav) {
        validFiles.push(file);
      }
    }
    
    return validFiles;
  }, [direction]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
          onFilesSelect(validFiles);
        }
      }
    },
    [onFilesSelect, validateFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          onFilesSelect(validFiles);
        }
      }
      // Reset input value to allow selecting the same files again
      e.target.value = "";
    },
    [onFilesSelect, validateFiles]
  );

  return (
    <motion.label
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center w-full 
        ${hasFiles ? "h-32" : "h-64"}
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
        accept={`${acceptedExt},${acceptedType}`}
        onChange={handleFileInput}
        className="hidden"
        multiple
      />
      
      <motion.div
        animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-3"
      >
        <div className={`p-3 rounded-full bg-primary/10 ${hasFiles ? "p-2" : "p-4"}`}>
          {hasFiles ? (
            <Files className="w-5 h-5 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center">
          <p className={`font-medium text-foreground ${hasFiles ? "text-sm" : "text-lg"}`}>
            {isDragging 
              ? `Drop your ${formatLabel} files here` 
              : hasFiles 
                ? `Add more ${formatLabel} files`
                : `Drag & drop your ${formatLabel} files`
            }
          </p>
          {!hasFiles && (
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse (multiple files supported)
            </p>
          )}
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
  );
};
