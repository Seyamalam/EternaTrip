export const themeConfig = {
  light: {
    primary: '#6dc4d1',          // Main brand color from hero subtitle
    secondary: '#4a390a',        // Secondary color from title
    text: '#4d4b46',            // Text color from experience content
    background: '#ffffff',       // Background color
    foreground: '#000000',      // Text on background
    muted: {
      background: '#f3f4f6',    // Muted background
      foreground: '#4d4b46'     // Muted text
    },
    accent: {
      default: '#6dc4d1',       // Accent color (same as primary)
      foreground: '#ffffff'     // Text on accent color
    },
    border: '#e5e7eb',         // Border color
  },
  dark: {
    primary: '#6dc4d1',         // Keep primary color consistent
    secondary: '#4a390a',       // Adjusted for dark mode
    text: '#e5e7eb',           // Light text for dark mode
    background: '#1a1a1a',     // Dark background
    foreground: '#ffffff',     // Text on background
    muted: {
      background: '#2a2a2a',   // Muted background for dark mode
      foreground: '#a1a1aa'    // Muted text for dark mode
    },
    accent: {
      default: '#6dc4d1',      // Keep accent consistent
      foreground: '#ffffff'    // Text on accent color
    },
    border: '#2a2a2a',        // Dark mode border
  }
}; 