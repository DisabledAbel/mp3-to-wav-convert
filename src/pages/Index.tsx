import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, RotateCcw } from "lucide-react";
import { BatchDropZone } from "@/components/BatchDropZone";
import { BatchFileList, BatchFile } from "@/components/BatchFileList";
import { ConvertButton } from "@/components/ConvertButton";
import { BatchDownloadButton } from "@/components/BatchDownloadButton";
import { DirectionToggle } from "@/components/DirectionToggle";
import { QualitySelector, Bitrate } from "@/components/QualitySelector";
import { convertAudio, ConversionDirection } from "@/lib/audioConverter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [direction, setDirection] = useState<ConversionDirection>("mp3-to-wav");
  const [bitrate, setBitrate] = useState<Bitrate>(192);

  const handleFilesSelect = useCallback((files: File[]) => {
    const newBatchFiles: BatchFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: "pending" as const,
      progress: 0,
    }));
    
    setBatchFiles((prev) => [...prev, ...newBatchFiles]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setBatchFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setBatchFiles([]);
  }, []);

  const handleToggleDirection = () => {
    setDirection((prev) => (prev === "mp3-to-wav" ? "wav-to-mp3" : "mp3-to-wav"));
    setBatchFiles([]);
  };

  const updateFileStatus = useCallback(
    (id: string, updates: Partial<BatchFile>) => {
      setBatchFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const handleConvert = async () => {
    const pendingFiles = batchFiles.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsConverting(true);

    for (const batchFile of pendingFiles) {
      updateFileStatus(batchFile.id, { status: "converting", progress: 10 });

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setBatchFiles((prev) =>
            prev.map((f) =>
              f.id === batchFile.id && f.status === "converting" && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 100);

        const result = await convertAudio(batchFile.file, direction, bitrate);

        clearInterval(progressInterval);
        updateFileStatus(batchFile.id, {
          status: "completed",
          progress: 100,
          outputBlob: result,
        });
      } catch (error) {
        console.error("Conversion error:", error);
        updateFileStatus(batchFile.id, {
          status: "error",
          error: "Conversion failed",
        });
      }
    }

    setIsConverting(false);
    
    const completedCount = batchFiles.filter((f) => f.status === "completed").length + 
      pendingFiles.filter((f) => batchFiles.find((bf) => bf.id === f.id)?.status !== "error").length;
    
    if (completedCount > 0) {
      toast.success(`Converted ${pendingFiles.length} file${pendingFiles.length !== 1 ? "s" : ""}!`);
    }
  };

  const inputFormat = direction === "mp3-to-wav" ? "MP3" : "WAV";
  const outputFormat = direction === "mp3-to-wav" ? "WAV" : "MP3";
  const hasPendingFiles = batchFiles.some((f) => f.status === "pending");
  const hasCompletedFiles = batchFiles.some((f) => f.status === "completed");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Waves className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-xl text-foreground">
            AudioConvert
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          {/* Card */}
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
            {/* Title */}
            <div className="text-center space-y-4">
              <DirectionToggle 
                direction={direction} 
                onToggle={handleToggleDirection} 
              />
              <h2 className="font-display text-3xl font-bold text-foreground">
                {inputFormat} to {outputFormat} Converter
              </h2>
              <p className="text-muted-foreground">
                Convert your audio files instantly in your browser
              </p>
            </div>

            {/* Drop Zone */}
            <BatchDropZone
              direction={direction}
              onFilesSelect={handleFilesSelect}
              hasFiles={batchFiles.length > 0}
            />

            {/* Batch File List */}
            <AnimatePresence mode="wait">
              {batchFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <BatchFileList
                    files={batchFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                  
                  {/* Clear All Button */}
                  {!isConverting && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear all files
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quality Selector (only for WAV to MP3) */}
            <AnimatePresence>
              {direction === "wav-to-mp3" && (
                <QualitySelector bitrate={bitrate} onChange={setBitrate} />
              )}
            </AnimatePresence>

            {/* Convert Button */}
            <div className="flex justify-center">
              <ConvertButton
                disabled={!hasPendingFiles}
                isConverting={isConverting}
                direction={direction}
                onClick={handleConvert}
              />
            </div>

            {/* Download Section */}
            <BatchDownloadButton
              files={batchFiles}
              direction={direction}
            />
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            🔒 All conversions happen locally in your browser
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
