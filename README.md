# mp3-to-wav-convertit

A **static, browser-based audio conversion website** that supports **MP3 → WAV** and **WAV → MP3** directly in the browser. No installation, no backend, no command line, and no server-side processing required.

The application is designed for fast, simple, and privacy-friendly audio format conversion.

---

## Features

* Web-based audio converter
* Bidirectional format support

  * MP3 → WAV
  * WAV → MP3
* Runs entirely in the browser
* No file uploads to a server
* Works on desktop and mobile browsers
* Simple drag-and-drop interface

---

## How It Works

This is a **fully static website**. All functionality is implemented using client-side JavaScript and standard browser APIs. There is **no backend**, **no server logic**, and **no database**. The site can be hosted on any static hosting provider.

```text
[ User Browser ]
      |
      v
[ Select / Drop Audio File ]
      |
      v
[ In-Browser Transcoding ]
      |
      v
[ Download Converted File ]
```

---

## Live App
<a href="https://mp3towav.lovable.app/" class="custom-link"
   style="display: inline-flex; align-items: center; gap: 8px; background-color: transparent; color: #8B5CF6; 
          font-size: 24px; padding: 22px 24px; 
          text-decoration: underline; text-underline-offset: 4px; transition: all 0.3s ease;">
    ⭐ Open Application
</a>

### Input

* MP3
* WAV

### Output

* WAV (PCM)
* MP3

The output format is automatically determined based on the user’s selection.

---

## Usage

1. Open the website
2. Upload or drag an audio file (MP3 or WAV)
3. Choose the output format
4. Click **Convert**
5. Download the converted file

No account or setup required.

---

## Browser Compatibility

Tested and supported on:

* Chrome (latest)
* Edge (latest)
* Firefox (latest)
* Safari (latest)

Note: Older browsers may not support required Web Audio or WebAssembly features.

---

## Performance Notes

* Conversion speed depends on device CPU and file size
* Large files may take longer on low-power devices
* All processing occurs locally

---

## Project Structure

```text
mp3-to-wav-convertit/
├── index.html        # Main UI
├── styles.css        # Styling
├── app.js            # Conversion logic
├── /assets           # Icons and static files
└── README.md         # Documentation
```

---

## Limitations

* No batch conversion
* No metadata (ID3) preservation
* Not intended for extremely large audio files

---

## Roadmap

* Batch file conversion
* Adjustable bitrate and sample rate
* Metadata passthrough
* Progressive Web App (PWA) support

---

## License

MIT License

---

## Privacy Statement

All audio conversion happens locally in your browser. Files are never uploaded, stored, or transmitted to any server.
