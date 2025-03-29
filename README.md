# MediTranslate

A modern, real-time healthcare translation application that enables seamless communication between patients and healthcare providers across language barriers.

![MediTranslate](./screenshots/meditranslate.png)

## Features

- Real-time speech-to-text conversion with immediate feedback
- Instant translation between multiple languages using free API
- Text-to-speech playback of translations
- Modern UI with light/dark mode support
- Mobile-first responsive design
- Language swap functionality
- Support for 8 common languages
- No data storage - privacy focused
- Works entirely in the browser

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS with custom theme
- Web Speech API for voice recognition
- Monocles Translate API (free and open-source)
- Browser Speech Synthesis for text-to-speech
- Local storage for preferences

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Select source and target languages from the dropdown menus
2. Click the microphone button to start recording
3. Speak clearly into your microphone
4. View the real-time transcript and translation
5. Click the play button to hear the translation spoken aloud
6. Use the copy button to copy translations to clipboard
7. Toggle between light and dark themes using the theme button

## AI-Assisted Development

This project was developed with the assistance of various AI tools. For details about the AI-assisted development process, see [AI_DEVELOPMENT.md](./AI_DEVELOPMENT.md).

## Security & Privacy

- No data is stored or transmitted except for translation requests
- All processing happens in the browser
- No authentication required
- No tracking or analytics

## Browser Support

Requires a modern browser with support for:
- Web Speech API
- Speech Synthesis API
- Fetch API
- LocalStorage API

## License

MIT