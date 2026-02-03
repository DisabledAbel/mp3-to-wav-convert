
# Make the Convert Button Larger and More Prominent

## Overview
Enhance the convert button to be more visually striking and easier to find, making it the clear focal point of the converter interface.

## Changes

### Visual Improvements to ConvertButton.tsx

1. **Increase button size**
   - Make the button full-width on all screen sizes
   - Increase padding and font size for better visibility
   - Add larger icon sizing

2. **Enhanced styling**
   - Add a subtle pulsing animation when the button is ready to convert (files are queued)
   - Increase border radius for a more modern look
   - Add a stronger gradient and glow effect
   - Improve hover state with scale transform

3. **Better visual hierarchy**
   - Add an icon indicating the output format (music note for MP3, waveform for WAV)
   - Display the format conversion direction directly on the button (e.g., "MP3 → WAV")

---

## Technical Details

**File to modify:** `src/components/ConvertButton.tsx`

**Key changes:**
- Increase `py-6` padding to `py-8` and font from `text-lg` to `text-xl`
- Add `scale-[1.02]` hover transform for interactivity feedback
- Include format icons (FileAudio for MP3, Waves for WAV) 
- Show full conversion direction: "Convert MP3 → WAV"
- Add subtle pulse animation using Framer Motion when files are pending
- Increase icon sizes from `w-5 h-5` to `w-6 h-6`
- Make button full-width with `w-full` class
