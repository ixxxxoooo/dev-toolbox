export default {
  // Application Basic Info
  app: {
    title: 'Dev Toolbox',
    subtitle: 'Developer Toolbox',
    backToHome: 'Back to Home',
    example: 'Example'
  },

  // Common Text
  common: {
    // Basic Operations
    copy: 'Copy',
    paste: 'Paste',
    clear: 'Clear',
    undo: 'Undo',
    redo: 'Redo',
    editorTheme: {
      title: 'Editor Theme',
      select: 'Select Theme',
      auto: 'Auto',
    },
    save: 'Save',
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark',
      lightMode: 'Light',
      language: 'Language',
      history: 'History',
      historyLimit: 'History Limit',
    },
    download: 'Download',
    upload: 'Upload',
    generate: 'Generate',
    apply: 'Apply',

    // Buttons
    buttons: {
      importFile: 'Import File',
      downloadResult: 'Download Result',
      clearAll: 'Clear All',
      pasteAndParse: 'Paste and Parse',
      setCurrentTime: 'Set Current Time',
      generateUuid: 'Generate UUID',
      useAsInput: 'Use as Input',
      showTreeView: 'Show Tree View',
      hideTreeView: 'Hide Tree View',
      regenerate: 'Regenerate',
      process: 'Process',
      compare: 'Compare',
      history: 'History',
      select: 'Select'
    },

    // History
    history: {
      title: 'History Storage',
      empty: 'No history yet',
      clear: 'Clear History',
      placeholder: 'Search history...',
      lastUsed: 'Last used',
      use: 'Use',
      useLeft: 'Use Left',
      useRight: 'Use Right',
      copy: 'Copy',
      delete: 'Delete'
    },

    // Labels
    labels: {
      input: 'Input',
      output: 'Output',
      result: 'Result',
      mode: 'Mode',
      encode: 'Encode',
      decode: 'Decode',
      format: 'Format',
      minify: 'Minify',
      convert: 'Convert',
      autoProcess: 'Auto Process',
      autoWrap: 'Auto Wrap',
      urlSafe: 'URL Safe',
      treeView: 'Tree View',
      indent: 'Indent',
      spaces2: '2 Spaces',
      spaces4: '4 Spaces',
      navigate: 'Navigate',
      toolCount: 'tools found'
    },

    // Placeholders
    placeholders: {
      searchTools: 'Search tools...',
      clickToGenerate: 'Click generate button',
      enterText: 'Please enter text...',
      enterTimestamp: 'Enter timestamp, date string or natural language...'
    },

    // Messages
    messages: {
      invalidJson: 'Invalid JSON, cannot generate tree view',
      cannotReadClipboard: 'Cannot read clipboard',
      formatFailed: 'Format failed',
      minifyFailed: 'Minify failed',
      unrecognizedDateFormat: 'Unrecognized date format',
      copied: 'Copied to clipboard',
      pasted: 'Pasted from clipboard',
      searchPlaceholder: 'Search tools... (↑↓ to navigate, Enter to select)',
      noResults: 'No tools found matching your search.'
    }
  },

  // Navigation
  nav: {
    tools: 'Tools Menu',
    language: 'Language Switcher'
  },

  // Home Page
  home: {
    title: 'Choose the tools you need',
    subtitle: 'A collection of practical tools to improve development efficiency',
    recentTools: 'Recently Used',
    allTools: 'All Tools'
  },

  // Tool Modules
  tools: {
    // Text Diff
    diff: {
      name: 'Text Diff',
      mode: 'Diff Mode',
      description: 'Compare differences between two texts',
      leftPanel: 'Left Text',
      rightPanel: 'Right Text',
      sideBySide: 'Side by Side',
      inline: 'Inline',
      ignoreWhitespace: 'Ignore Whitespace',
      wordWrap: 'Word Wrap',
      darkTheme: 'Dark Theme',
      lightTheme: 'Light Theme',
      theme: 'Theme',
      showLineNumbers: 'Show Line Numbers',
      previousDiff: 'Previous Diff',
      nextDiff: 'Next Diff',
      swapContent: 'Swap Content',
      pasteLeft: 'Paste Left',
      pasteRight: 'Paste Right',
      copyLeft: 'Copy Left',
      copyRight: 'Copy Right',
      clearAll: 'Clear All',
      sideBySideDescription: 'Side by Side Mode',
      inlineDescription: 'Inline Mode',
      ignoreWhitespaceDescription: 'Ignore Whitespace'
    },

    // Base64 Encoder/Decoder
    base64: {
      name: 'Base64 Encoder/Decoder',
      description: 'Base64 encoding and decoding tool',
      encodeMode: 'Encode Mode',
      decodeMode: 'Decode Mode',
      encodeModeDescription: 'Encode URL parameter values',
      decodeModeDescription: 'Automatically decode URL-encoded characters',
      help: {
        features: {
          urlSafe: 'URL Safe'
        }
      }
    },

    // JSON Tools
    json: {
      name: 'JSON Tool',
      description: 'JSON formatting, minification, escape and unescape',
      downloadJson: 'Download JSON',
      coreFeatures: 'Core Features',
      formatDescription: 'Format JSON',
      minifyDescription: 'Minify JSON',
      treeViewDescription: 'Tree View',
      escape: 'Escape',
      unescape: 'Unescape',
      escapeDescription: 'Escape special characters in JSON strings',
      unescapeDescription: 'Unescape special characters in JSON strings',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All'
    },

    // URL Encoder/Decoder
    url: {
      name: 'URL Encoder/Decoder',
      description: 'URL encoding and decoding tool'
    },

    // Timestamp Converter
    timestamp: {
      name: 'Timestamp Converter',
      description: 'Smart timestamp conversion tool',
      actions: {
        pasteAndParse: 'Paste and Parse',
        setCurrentTime: 'Set Current Time'
      },
      result: {
        title: 'Conversion Result',
        localTime: 'Local Time (UTC+8)',
        localDate: 'Local Date',
        timestampSec: 'Timestamp (seconds)',
        timestampMs: 'Timestamp (milliseconds)',
        utcTime: 'UTC Time (ISO 8601)',
        relativeTime: 'Relative Time',
        rfc2822: 'RFC 2822'
      }
    },

    // UUID Generator
    uuid: {
      name: 'UUID Generator',
      description: 'Generate globally unique identifiers',
      coreFeatures: 'Core Features',
      uuidv4: 'UUID v4',
      uuidv4Description: 'Randomly generated globally unique identifiers',
      format: 'Format',
      formatDescription: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    },

    // Text Analyzer
    textAnalyzer: {
      name: 'Text Analyzer',
      description: 'Text character statistics analysis',
      coreFeatures: 'Core Features',
      stats: {
        charsWithSpaces: 'Characters (with spaces)',
        charsWithoutSpaces: 'Characters (without spaces)',
        words: 'Words',
        lines: 'Lines',
        paragraphs: 'Paragraphs',
        charsWithSpacesDesc: 'Count characters including spaces',
        charsWithoutSpacesDesc: 'Count characters excluding spaces',
        wordsDesc: 'Count words in the text',
        linesDesc: 'Count lines in the text',
        paragraphsDesc: 'Count paragraphs in the text'
      }
    },

    // Hash Generator
    hash: {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA and other hash values',
      result: 'Hash Result',
      coreFeatures: 'Core Features',
      md5Description: '128-bit hash value',
      sha1Description: '160-bit secure hash',
      sha256Description: '256-bit secure hash',
      sha512Description: '512-bit high-security hash'
    },

    // SQL Formatter
    sql: {
      name: 'SQL Formatter',
      description: 'Format and beautify SQL statements',
      database: 'Database',
      wordWrap: 'Word Wrap',
      importFile: 'Import File',
      downloadSql: 'Download SQL',
      indent2: '2 Spaces',
      indent3: '3 Spaces',
      indent4: '4 Spaces',
      coreFeatures: 'Core Features',
      formatDescription: 'Format SQL statements',
      minifyDescription: 'Minify SQL statements',
      escapeDescription: 'Escape special characters',
      unescapeDescription: 'Unescape special characters',
      escape: 'Escape',
      unescape: 'Unescape',
      unicode: 'Unicode to Chinese'
    },

    // Password Generator
    password: {
      name: 'Password Generator',
      description: 'Generate secure passwords',
      passwordType: 'Password Type',
      passwordLength: 'Password Length',
      recommendedLength: 'Recommended',
      characters: 'chars',
      characterTypes: 'Character Types',
      uppercase: 'Uppercase',
      lowercase: 'Lowercase',
      numbers: 'Numbers',
      symbols: 'Symbols',
      excludeAmbiguous: 'Exclude Ambiguous',
      configOptions: 'Configuration',
      capitalizeWords: 'Capitalize Words',
      wordCount: 'Word Count',
      generatedPasswords: 'Generated Passwords',
      copyPassword: 'Copy Password',
      strengthAnalysis: 'Strength Analysis',
      strengthLevel: 'Strength Level',
      charsetSize: 'Charset Size',
      securityAdvice: 'Security Advice',
      entropy: 'Entropy',
      types: {
        strong: 'Strong (Recommended)',
        strongDesc: 'High entropy password with mixed characters',
        readable: 'Readable',
        readableDesc: 'Easy to type, excludes ambiguous characters',
        pin: 'PIN',
        pinDesc: 'Numeric only, suitable for PIN codes',
        memorable: 'Memorable',
        memorableDesc: 'Based on random words, easy to remember'
      },
      strength: {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        veryStrong: 'Very Strong'
      },
      crackTimeDesc: 'Estimated Crack Time',
      crackTime: {
        lessThanMinute: '< 1 minute',
        minutes: 'minutes',
        hours: 'hours',
        days: 'days',
        years: 'years',
        centuries: 'centuries'
      },
      advice: {
        length: 'Use 12+ characters for better security',
        unique: 'Never reuse passwords across accounts',
        regular: 'Rotate important passwords periodically',
        manager: 'Use a password manager',
        twoFactor: 'Enable 2FA where possible'
      }
    },

    // Number Converter
    numberConverter: {
      name: 'Number Base Converter',
      description: 'Convert between Binary, Octal, Decimal, and Hexadecimal',
      decimal: 'Decimal',
      hex: 'Hexadecimal',
      binary: 'Binary',
      octal: 'Octal'
    },

    // HTTP Status Codes
    httpStatus: {
      name: 'HTTP Status Codes',
      description: 'Lookup HTTP status codes and meanings',
      codes: [
        // 1xx Informational
        { code: 100, title: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: 'Informational' },
        { code: 101, title: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.', category: 'Informational' },

        // 2xx Success
        { code: 200, title: 'OK', description: 'Standard response for successful HTTP requests.', category: 'Success' },
        { code: 201, title: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource.', category: 'Success' },
        { code: 202, title: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.', category: 'Success' },
        { code: 204, title: 'No Content', description: 'The server successfully processed the request and is not returning any content.', category: 'Success' },

        // 3xx Redirection
        { code: 301, title: 'Moved Permanently', description: 'The requested page has moved to a new URL.', category: 'Redirection' },
        { code: 302, title: 'Found', description: 'The requested page has moved temporarily to a new URL.', category: 'Redirection' },
        { code: 304, title: 'Not Modified', description: 'Indicates that the resource has not been modified since the version specified by the request headers.', category: 'Redirection' },

        // 4xx Client Error
        { code: 400, title: 'Bad Request', description: 'The server cannot or will not process the request due to an apparent client error.', category: 'Client Error' },
        { code: 401, title: 'Unauthorized', description: 'Authentication is required and has failed or has not been yet provided.', category: 'Client Error' },
        { code: 403, title: 'Forbidden', description: 'The request was valid, but the server is refusing action.', category: 'Client Error' },
        { code: 404, title: 'Not Found', description: 'The requested resource could not be found but may be available in the future.', category: 'Client Error' },
        { code: 405, title: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.', category: 'Client Error' },
        { code: 429, title: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.', category: 'Client Error' },

        // 5xx Server Error
        { code: 500, title: 'Internal Server Error', description: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.', category: 'Server Error' },
        { code: 502, title: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.', category: 'Server Error' },
        { code: 503, title: 'Service Unavailable', description: 'The server is currently unavailable (because it is overloaded or down for maintenance).', category: 'Server Error' },
        { code: 504, title: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.', category: 'Server Error' },
      ]
    },

    // User Agent Parser
    userAgent: {
      name: 'User Agent Parser',
      description: 'Parse User Agent strings',
      browser: 'Browser',
      os: 'Operating System',
      device: 'Device',
      useMyUa: 'Use My UA',
      placeholder: 'Paste User Agent string here...'
    },

    // Regex Tester
    regexTester: {
      name: 'Regex Tester',
      description: 'Test regular expressions',
      regex: 'Regular Expression',
      testString: 'Test String',
      matches: 'Matches'
    },

    // QR Code Generator
    qrCode: {
      name: 'QR Code Generator',
      description: 'Generate custom QR codes',
      placeholder: 'Enter text or URL...',
      options: 'Options'
    },

    // Markdown Preview
    markdown: {
      name: 'Markdown Preview',
      description: 'Markdown editor with real-time preview',
      copyHtml: 'Copy HTML'
    },

    // Image Tools
    imageTools: {
      name: 'Image Tools',
      description: 'Compress and crop images',
      compress: 'Compress',
      crop: 'Crop',
      resize: 'Resize',
      rotate: 'Rotate/Flip',
      convert: 'Convert',
      base64: 'Base64',
      dropText: 'Drop image here',
      supportText: 'Supports JPG, PNG, WebP',
      quality: 'Quality',
      width: 'Width',
      height: 'Height',
      maintainAspectRatio: 'Maintain Aspect Ratio',
      rotateLeft: 'Rotate Left',
      rotateRight: 'Rotate Right',
      flipHorizontal: 'Flip Horizontal',
      flipVertical: 'Flip Vertical',
      adjustQuality: 'Adjust quality to reduce file size.',
      dragToCrop: 'Drag to crop. Click Apply to save changes.',
      base64Help: 'Base64 representation of the current image.',
      helpTitle: 'Image Tools Help',
      helpContent: {
        intro: 'A comprehensive suite of image manipulation tools:',
        compress: 'Compress: Reduce file size while maintaining quality.',
        crop: 'Crop: Trim unwanted outer areas.',
        resize: 'Resize: Change image dimensions.',
        rotate: 'Rotate/Flip: Orient your image correctly.',
        convert: 'Convert: Switch between PNG, JPEG, and WEBP formats.',
        base64: 'Base64: Get the Base64 string for embedding.'
      }
    },

    // Watermark Tool
    watermark: {
      name: 'Watermark Tool',
      description: 'Add or remove watermarks from images/videos',
      remove: 'Remove Watermark',
      add: 'Add Watermark',
      mode: 'Mode',
      removeMode: 'Remove Mode',
      addMode: 'Add Mode',
      text: 'Text Watermark',
      imageType: 'Image',
      video: 'Video',
      content: 'Content',
      color: 'Color',
      size: 'Size',
      opacity: 'Opacity',
      position: 'Position',
      x: 'X Position',
      y: 'Y Position',
      dropImage: 'Drop or click to upload image',
      dropVideo: 'Drop or click to upload video',
      supportImage: 'Supports JPG, PNG, WebP',
      supportVideo: 'Supports MP4, WebM',
      brushSize: 'Brush Size',
      paintInstruction: 'Paint over the watermark area',
      videoInstruction: 'Drag the selection box to mark watermark area',
      help: 'A powerful watermark processing tool. In "Remove Mode", mark watermark areas by painting (images) or selection box (videos) and remove them. In "Add Mode", add text watermarks to images or videos.'
    },

    // Unicode Converter
    unicodeConverter: {
      name: 'Unicode Converter',
      description: 'Convert between Unicode and text',
      textToUnicode: 'Text to Unicode',
      unicodeToText: 'Unicode to Text',
      textToUnicodeDesc: 'Convert text to Unicode escape sequences (\\uXXXX)',
      unicodeToTextDesc: 'Convert Unicode escape sequences to readable text',
      inputPlaceholder: 'Enter text or Unicode...',
      outputPlaceholder: 'Conversion result will appear here...',
      swap: 'Swap input/output',
      features: 'Features'
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
    toggle: 'Toggle Theme'
  },

  // Error Messages
  errors: {
    invalidTimestamp: 'Unrecognized date format',
    noResults: 'No results found',
    tryAdjustKeywords: 'Try adjusting your search keywords',
    pasteFailed: 'Paste failed'
  }
}
