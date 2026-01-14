import { useState } from "react";
import { motion } from "framer-motion";
import { FileAudio, Waves } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { ConvertButton } from "@/components/ConvertButton";
import { DownloadButton } from "@/components/DownloadButton";
import { convertMp3ToWav } from "@/lib/audioConverter";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [wavBlob, setWavBlob] = useState<Blob | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setWavBlob(null);
  };

  const handleFileClear = () => {
    setFile(null);
    setWavBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setWavBlob(null);

    try {
      const result = await convertMp3ToWav(file);
      setWavBlob(result);
      toast.success("Conversion complete!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert file. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

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
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  <FileAudio className="w-4 h-4" />
                  MP3
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="text-muted-foreground"
                >
                  →
                </motion.div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  <Waves className="w-4 h-4" />
                  WAV
                </div>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                MP3 to WAV Converter
              </h2>
              <p className="text-muted-foreground">
                Convert your audio files instantly in your browser
              </p>
            </div>

            {/* Drop Zone */}
            <DropZone
              file={file}
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
            />

            {/* Convert Button */}
            <div className="flex justify-center">
              <ConvertButton
                disabled={!file}
                isConverting={isConverting}
                onClick={handleConvert}
              />
            </div>

            {/* Download Section */}
            <DownloadButton
              wavBlob={wavBlob}
              originalFileName={file?.name || "audio.mp3"}
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
