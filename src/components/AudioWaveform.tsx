import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AudioWaveformProps {
  audioUrl: string | null;
  progress: number;
  isPlaying: boolean;
  variant?: "original" | "converted";
  onSeek?: (progress: number) => void;
}

export const AudioWaveform = ({
  audioUrl,
  progress,
  isPlaying,
  variant = "original",
  onSeek,
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!audioUrl) {
      setWaveformData([]);
      return;
    }

    const analyzeAudio = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);
        const samples = 80;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        const multiplier = Math.max(...filteredData) ** -1;
        const normalizedData = filteredData.map((n) => n * multiplier);

        setWaveformData(normalizedData);
        await audioContext.close();
      } catch (error) {
        console.error("Error analyzing audio:", error);
        setWaveformData([]);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeAudio();
  }, [audioUrl]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    onSeek(clickPosition * 100);
  };

  const isConverted = variant === "converted";
  const activeColor = isConverted ? "hsl(var(--accent))" : "hsl(var(--primary))";
  const inactiveColor = "hsl(var(--border))";

  if (isLoading) {
    return (
      <div className="h-12 flex items-center justify-center gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-border rounded-full"
            animate={{
              height: [8, 24, 8],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    );
  }

  if (waveformData.length === 0) {
    return null;
  }

  return (
    <div
      className="h-12 flex items-center gap-[2px] cursor-pointer group"
      onClick={handleClick}
    >
      {waveformData.map((value, index) => {
        const barProgress = (index / waveformData.length) * 100;
        const isActive = barProgress <= progress;

        return (
          <motion.div
            key={index}
            className="flex-1 rounded-full transition-colors duration-150"
            style={{
              height: `${Math.max(value * 100, 10)}%`,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: 1,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
            transition={{
              scaleY: { duration: 0.3, delay: index * 0.01 },
              backgroundColor: { duration: 0.15 },
            }}
            whileHover={{ scaleY: 1.2 }}
          />
        );
      })}
    </div>
  );
};
