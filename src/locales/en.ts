export default {
  // Application Common
  app: {
    title: 'Dev Toolbox',
    subtitle: 'Developer Toolbox',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    export: 'Export',
    import: 'Import',
    copy: 'Copy',
    paste: 'Paste',
    clear: 'Clear',
    reset: 'Reset',
    download: 'Download',
    upload: 'Upload',
    format: 'Format',
    minify: 'Minify',
    validate: 'Validate',
    generate: 'Generate',
    analyze: 'Analyze',
    convert: 'Convert',
    swap: 'Swap',
    previous: 'Previous',
    next: 'Next',
    help: 'Help',
    back: 'Back',
    home: 'Home'
  },

  // Navigation and Menu
  nav: {
    home: 'Home',
    tools: 'Tools',
    settings: 'Settings',
    about: 'About',
    language: 'Language'
  },

  // Home Page
  home: {
    title: 'Choose the tools you need',
    subtitle: 'A collection of practical tools to improve development efficiency',
    searchPlaceholder: 'Search tools...',
    recentTools: 'Recently Used',
    allTools: 'All Tools'
  },

  // Tool Modules
  tools: {
    // Text Diff
    diff: {
      name: 'Text Diff',
      description: 'Compare differences between two texts',
      leftPanel: 'Left Text',
      rightPanel: 'Right Text',
      sideBySide: 'Side by Side',
      inline: 'Inline',
      ignoreWhitespace: 'Ignore Whitespace',
      wordWrap: 'Word Wrap',
      darkTheme: 'Dark Theme',
      lightTheme: 'Light Theme',
      uploadFile: 'Upload File',
      downloadDiff: 'Download Diff',
      mode: 'Mode',
      theme: 'Theme',
      showLineNumbers: 'Show Line Numbers',
      showWhitespace: 'Show Whitespace',
      previousDiff: 'Previous Difference',
      nextDiff: 'Next Difference',
      swapContent: 'Swap Content',
      clearAll: 'Clear All',
      pasteLeft: 'Paste to Left',
      pasteRight: 'Paste to Right',
      copyLeft: 'Copy Left',
      copyRight: 'Copy Right',
      help: {
        title: 'Text Diff Tool Guide',
        description: 'Powerful text comparison tool based on Monaco Editor, supports real-time editing and highlighted differences.',
        features: {
          sideBySide: 'Side by Side: Display in two columns for easy line-by-line comparison.',
          inline: 'Inline: Highlight differences within the same text flow.',
          ignoreWhitespace: 'Ignore Whitespace: Ignore leading and trailing spaces and tabs, focus on content changes.',
          lineNumbers: 'Show Line Numbers: Control whether the editor displays line numbers.',
          theme: 'Theme: Switch editor display theme (dark/light).'
        },
        buttons: {
          navigation: 'Previous/Next: Quickly jump to difference points.',
          swap: 'Swap Content: Exchange text between left and right editors.',
          clear: 'Clear All: Clear all text content.',
          clipboard: 'Paste/Copy: Independently operate left and right editor content.'
        }
      },
      stats: {
        added: 'Added',
        deleted: 'Deleted',
        modified: 'Modified',
        unchanged: 'Unchanged'
      }
    },

    // Base64 Encoder/Decoder
    base64: {
      name: 'Base64 Encoder/Decoder',
      description: 'Base64 encoding and decoding tool',
      encode: 'Encode',
      decode: 'Decode',
      input: 'Input Text',
      output: 'Output Result',
      urlSafe: 'URL Safe Mode',
      uploadFile: 'Import File',
      downloadResult: 'Download Result',
      copyToClipboard: 'Copy to Clipboard',
      pasteFromClipboard: 'Paste from Clipboard',
      clearAll: 'Clear',
      mode: 'Mode',
      standard: 'Standard Mode',
      help: {
        title: 'Base64 Encoder/Decoder Guide',
        description: 'A RFC 4648 compliant Base64 encoding/decoding tool that correctly handles UTF-8 characters including Chinese.',
        features: {
          encoding: 'Encoding Mode: Convert text or file content to Base64 format.',
          decoding: 'Decoding Mode: Restore Base64 strings to original content.',
          urlSafe: 'URL Safe Mode: Use URL and filename safe Base64 character set.',
          utf8: 'UTF-8 Support: Correctly handle multi-byte characters like Chinese.'
        }
      }
    },

    // JSON Tools
    json: {
      name: 'JSON Tools',
      description: 'JSON formatting, minifying and conversion',
      format: 'Format',
      minify: 'Minify',
      validate: 'Validate',
      toYaml: 'To YAML',
      toXml: 'To XML',
      fromYaml: 'From YAML',
      fromXml: 'From XML',
      treeView: 'Tree View',
      jsonPath: 'JSONPath Query',
      input: 'Input JSON',
      output: 'Output Result',
      query: 'Query Path',
      queryResult: 'Query Result',
      valid: 'JSON is valid',
      invalid: 'JSON is invalid',
      error: 'Parse error'
    },

    // URL Encoder/Decoder
    url: {
      name: 'URL Encoder/Decoder',
      description: 'URL encoding and decoding tool',
      encode: 'Encode',
      decode: 'Decode',
      encodeComponent: 'encodeURIComponent',
      encodeUri: 'encodeURI',
      decodeComponent: 'decodeURIComponent',
      decodeUri: 'decodeURI',
      input: 'Input URL',
      output: 'Output Result'
    },

    // Timestamp Converter
    timestamp: {
      name: 'Timestamp Converter',
      description: 'Convert between timestamp and date formats',
      input: 'Input Time',
      timestamp: 'Timestamp',
      datetime: 'Date Time',
      format: 'Format',
      timezone: 'Timezone',
      local: 'Local Time',
      utc: 'UTC Time',
      iso: 'ISO 8601',
      rfc2822: 'RFC 2822',
      relative: 'Relative Time',
      currentTime: 'Current Time',
      setCurrent: 'Set to Current',
      milliseconds: 'Milliseconds',
      seconds: 'Seconds',
      intelligent: 'Smart Recognition',
      formats: {
        local: 'Local Time',
        utc: 'UTC Time',
        timestamp: 'Timestamp (seconds)',
        timestampMs: 'Timestamp (milliseconds)',
        iso: 'ISO 8601',
        rfc2822: 'RFC 2822',
        relative: 'Relative Time'
      }
    },

    // UUID Generator
    uuid: {
      name: 'UUID Generator',
      description: 'Generate globally unique identifiers',
      generate: 'Generate UUID',
      version4: 'UUID v4 (Random)',
      output: 'Generated UUID',
      copySuccess: 'UUID copied to clipboard'
    },

    // Text Analyzer
    textAnalyzer: {
      name: 'Text Analyzer',
      description: 'Count characters, lines and other text statistics',
      input: 'Input Text',
      stats: 'Statistics',
      characters: 'Characters',
      charactersNoSpaces: 'Characters (no spaces)',
      words: 'Words',
      wordsZh: 'Chinese Words',
      lines: 'Lines',
      paragraphs: 'Paragraphs',
      bytes: 'Bytes',
      readingTime: 'Reading Time',
      minute: 'minute',
      seconds: 'seconds'
    },

    // Hash Generator
    hash: {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA and other hash values',
      input: 'Input Text',
      algorithms: 'Algorithms',
      md5: 'MD5',
      sha1: 'SHA-1',
      sha256: 'SHA-256',
      sha512: 'SHA-512',
      result: 'Hash Result',
      copyHash: 'Copy Hash'
    },

    // SQL Formatter
    sql: {
      name: 'SQL Formatter',
      description: 'Format and beautify SQL statements',
      input: 'Input SQL',
      output: 'Formatted Result',
      format: 'Format',
      database: 'Database Type',
      indentSize: 'Indent Size',
      keywordCase: 'Keyword Case',
      uppercase: 'Uppercase',
      lowercase: 'Lowercase',
      preserve: 'Preserve'
    },

    // Password Generator
    password: {
      name: 'Password Generator',
      description: 'Generate secure passwords',
      generate: 'Generate Password',
      type: 'Password Type',
      strongType: 'Strong Password',
      readable: 'Readable Password',
      pin: 'PIN Code',
      memorable: 'Memorable Password',
      length: 'Length',
      includeUppercase: 'Include Uppercase',
      includeLowercase: 'Include Lowercase',
      includeNumbers: 'Include Numbers',
      includeSymbols: 'Include Symbols',
      excludeSimilar: 'Exclude Similar Characters',
      strength: 'Password Strength',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
      entropy: 'Entropy',
      crackTime: 'Crack Time',
      instantLy: 'Instantly',
      seconds: 'seconds',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      months: 'months',
      years: 'years',
      centuries: 'centuries'
    }
  },

  // Tool Categories
  categories: {
    'text': 'Text Processing',
    'encoding': 'Encoding Tools',
    'time': 'Time Tools',
    'data': 'Data Formats',
    'development': 'Development Tools'
  },

  // Theme
  theme: {
    light: 'Light Theme',
    dark: 'Dark Theme',
    system: 'Follow System',
    toggle: 'Toggle Theme'
  },

  // Shortcuts
  shortcuts: {
    copy: 'Ctrl+C / Cmd+C',
    paste: 'Ctrl+V / Cmd+V',
    selectAll: 'Ctrl+A / Cmd+A',
    undo: 'Ctrl+Z / Cmd+Z',
    redo: 'Ctrl+Shift+Z / Cmd+Shift+Z'
  },

  // Error Messages
  errors: {
    invalidJson: 'Invalid JSON format',
    invalidUrl: 'Invalid URL format',
    invalidTimestamp: 'Invalid timestamp format',
    invalidInput: 'Invalid input format',
    copyFailed: 'Copy failed',
    pasteFailed: 'Paste failed',
    uploadFailed: 'File upload failed',
    downloadFailed: 'File download failed',
    networkError: 'Network error',
    unknownError: 'Unknown error',
    noResults: 'No results found',
    tryAdjustKeywords: 'Try adjusting your search keywords'
  },

  // Success Messages
  success: {
    copied: 'Copied to clipboard',
    pasted: 'Pasted from clipboard',
    uploaded: 'File uploaded successfully',
    downloaded: 'File downloaded successfully',
    cleared: 'Cleared',
    reset: 'Reset',
    saved: 'Saved'
  },

  // Help Information
  help: {
    diff: {
      title: 'Text Diff Tool Usage',
      content: 'Enter the text to compare in the left and right editors, the system will automatically highlight differences. Supports file upload, multiple comparison modes and theme switching.'
    },
    base64: {
      title: 'Base64 Encoder/Decoder Usage',
      content: 'Enter text or upload files for Base64 encoding or decoding. Supports standard mode and URL safe mode.'
    },
    json: {
      title: 'JSON Tools Usage',
      content: 'Supports JSON formatting, minifying, validation, and mutual conversion with YAML and XML formats. Also provides JSONPath query functionality.'
    }
  }
}
