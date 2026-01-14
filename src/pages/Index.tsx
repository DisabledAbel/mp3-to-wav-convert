import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { ConvertButton } from "@/components/ConvertButton";
import { DownloadButton } from "@/components/DownloadButton";
import { DirectionToggle } from "@/components/DirectionToggle";
import { QualitySelector, Bitrate } from "@/components/QualitySelector";
import { convertAudio, ConversionDirection } from "@/lib/audioConverter";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [direction, setDirection] = useState<ConversionDirection>("mp3-to-wav");
  const [bitrate, setBitrate] = useState<Bitrate>(192);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOutputBlob(null);
  };

  const handleFileClear = () => {
    setFile(null);
    setOutputBlob(null);
  };

  const handleToggleDirection = () => {
    setDirection(prev => prev === "mp3-to-wav" ? "wav-to-mp3" : "mp3-to-wav");
    setFile(null);
    setOutputBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setOutputBlob(null);

    try {
      const result = await convertAudio(file, direction, bitrate);
      setOutputBlob(result);
      toast.success("Conversion complete!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert file. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const inputFormat = direction === "mp3-to-wav" ? "MP3" : "WAV";
  const outputFormat = direction === "mp3-to-wav" ? "WAV" : "MP3";

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
            <DropZone
              file={file}
              direction={direction}
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
            />

            {/* Quality Selector (only for WAV to MP3) */}
            <AnimatePresence>
              {direction === "wav-to-mp3" && (
                <QualitySelector bitrate={bitrate} onChange={setBitrate} />
              )}
            </AnimatePresence>

            {/* Convert Button */}
            <div className="flex justify-center">
              <ConvertButton
                disabled={!file}
                isConverting={isConverting}
                direction={direction}
                onClick={handleConvert}
              />
            </div>

            {/* Download Section */}
            <DownloadButton
              outputBlob={outputBlob}
              originalFileName={file?.name || "audio"}
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
