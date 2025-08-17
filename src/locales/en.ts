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
    home: 'Home',
    backToHome: 'Back to Home'
  },

  // Navigation and Menu
  nav: {
    home: 'Home',
    tools: 'Tools',
    settings: 'Settings',
    about: 'About',
    language: 'Language'
  },

  // Common UI Text
  ui: {
    buttons: {
      importFile: 'Import File',
      downloadResult: 'Download Result',
      downloadFile: 'Download File',
      clearAll: 'Clear All',
      pasteAndParse: 'Paste and Parse',
      setCurrentTime: 'Set Current Time',
      generateUuid: 'Generate UUID',
      generatePassword: 'Generate Password',
      useAsInput: 'Use as Input',
      showTreeView: 'Show',
      hideTreeView: 'Hide',
      regenerate: 'Regenerate',
      pasteFromClipboard: 'Paste from Clipboard',
      copyToClipboard: 'Copy to Clipboard'
    },
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
      escape: 'Escape',
      unescape: 'Unescape',
      autoProcess: 'Auto Process',
      autoWrap: 'Auto Wrap',
      urlSafe: 'URL Safe',
      treeView: 'Tree View',
      indent: 'Indent',
      spaces2: '2 Spaces',
      spaces4: '4 Spaces'
    },
    titles: {
      topBar: 'Top Bar',
      topHeader: 'Top Header',
      mainContent: 'Main Content',
      mainContentArea: 'Main Content Area',
      toolbar: 'Toolbar',
      inputEditor: 'Input Editor',
      outputEditor: 'Output Editor',
      generatedResult: 'Generated Result',
      conversionResult: 'Conversion Result',
      statisticsResult: 'Statistics Result'
    },
    placeholders: {
      searchTools: 'Search tools...',
      clickToGenerate: 'Click generate button',
      enterText: 'Please enter text...',
      enterTimestamp: 'Enter timestamp, date string or natural language...'
    },
    messages: {
      invalidJson: 'Invalid JSON, cannot generate tree view',
      cannotReadClipboard: 'Cannot read clipboard',
      formatFailed: 'Format failed',
      minifyFailed: 'Minify failed',
      unrecognizedDateFormat: 'Unrecognized date format',
      processingError: 'Processing Error',
      fileImported: 'File Imported',
      resultDownloaded: 'Result Downloaded'
    }
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
       previousDiff: 'Previous Diff',
       nextDiff: 'Next Diff',
       swapContent: 'Swap Content',
       clearAll: 'Clear All',
       pasteLeft: 'Paste Left',
       pasteRight: 'Paste Right',
       copyLeft: 'Copy Left',
       copyRight: 'Copy Right',
      help: {
        title: 'Text Diff Tool Guide',
        description: 'Powerful text comparison tool based on Monaco Editor, supports real-time editing and highlighted differences.',
        coreFeatures: 'Core Features',
        features: {
          sideBySide: 'Side by Side: Display in two columns for easy line-by-line comparison.',
          inline: 'Inline: Highlight differences within the same text flow.',
          ignoreWhitespace: 'Ignore Whitespace: Ignore leading and trailing spaces and tabs, focus on content changes.',
          lineNumbers: 'Show Line Numbers: Control whether the editor displays line numbers.',
          theme: 'Theme: Switch editor display theme (dark/light).'
        },
        buttons: {
          title: 'Button Guide',
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
      name: 'JSON Tool',
      description: 'JSON formatting, minification and conversion tool',
      format: 'Format',
      minify: 'Minify',
      validate: 'Validate',
      convert: 'Convert',
      escape: 'Escape',
      unescape: 'Unescape',
      treeView: 'Tree View',
      from: 'From',
      to: 'To',
      downloadJson: 'Download JSON',
      invalidJsonTreeView: 'Invalid JSON, cannot generate tree view',
      toYaml: 'To YAML',
      toXml: 'To XML',
      fromYaml: 'From YAML',
      fromXml: 'From XML',
      jsonPath: 'JSONPath Query',
      input: 'Input JSON',
      output: 'Output Result',
      query: 'Query Path',
      queryResult: 'Query Result',
      valid: 'JSON is valid',
      invalid: 'JSON is invalid',
      error: 'Parse error',
      help: {
        title: 'JSON Tool Help',
        description: 'This is a multi-functional JSON processing tool that supports formatting, minification and various data format conversions.',
        coreFeatures: 'Core Features',
        features: {
          editor: 'Input/Output Editor',
          editorDesc: 'Supports syntax highlighting, real-time validation and code folding.',
          treeView: 'Tree View',
          treeViewDesc: 'Intuitively displays JSON structure for easy browsing of complex data.',
          format: 'Format',
          formatDesc: 'Beautify JSON layout with 2 or 4 space indentation support.',
          minify: 'Minify',
          minifyDesc: 'Remove all whitespace characters from JSON to reduce size.',
          convert: 'Convert',
          convertDesc: 'Support mutual conversion between JSON, YAML, and XML.'
        },
        buttons: {
          title: 'Button Description',
          importFile: 'Import File',
          importFileDesc: 'Load content from local file to input box.',
          downloadJson: 'Download JSON',
          downloadJsonDesc: 'Download result as .json file.',
          clear: 'Clear',
          clearDesc: 'Clear all input and output content.',
          toggleTreeView: 'Show/Hide Tree View',
          toggleTreeViewDesc: 'Toggle the display state of the middle tree view.',
          autoProcess: 'Auto Process',
          autoProcessDesc: 'When checked, automatically process when input content changes.'
        }
      }
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
      output: 'Output Result',
      intro: {
        title: 'URL Encoder/Decoder Guide',
        description: 'Professional URL encoding and decoding tool supporting multiple encoding modes and automatic processing.',
        modes: {
          title: 'Encoding Modes',
          encode: 'Encode (Encoding)',
          component: 'Component: Encode URL parameters and query strings, suitable for form data.',
          uri: 'URI: Encode complete URLs while preserving URL structure characters.',
          decode: 'Decode (Decoding)',
          componentDecode: 'Component: Decode URL-encoded parameters back to original text.',
          uriDecode: 'URI: Decode complete URLs back to readable format.'
        },
        example: {
          title: 'Example (Component Mode)',
          input: 'Input',
          inputExample: 'Hello World! 你好世界',
          output: 'Output',
          outputExample: 'Hello%20World%21%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
        }
      },
      actions: {
        clear: 'Clear',
        encode: 'Encode',
        decode: 'Decode'
      },
      options: {
        mode: 'Mode',
        autoProcess: 'Auto Process',
        autoWrap: 'Auto Wrap'
      },
      sections: {
        input: 'Input',
        result: 'Result'
      },
      buttons: {
        paste: 'Paste',
        copy: 'Copy',
        useAsInput: 'Use as Input'
      }
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
      intro: {
        title: 'Smart Timestamp Converter Tool Guide',
        inputSupport: {
          title: 'Input Support',
          timestamp: 'Unix Timestamp: Supports both second and millisecond precision.',
          dateString: 'Date String: Standard date formats like YYYY-MM-DD, MM/DD/YYYY, etc.',
          naturalLanguage: 'Natural Language: "now", "today", "yesterday", "1 hour ago", etc.',
          iso: 'ISO 8601: International standard format with timezone information.'
        },
        outputFormats: {
          title: 'Output Formats',
          local: 'Local Time (UTC+8): Time in your current timezone.',
          localDate: 'Local Date: Date portion only.',
          timestampSec: 'Timestamp (seconds): Unix timestamp in seconds.',
          timestampMs: 'Timestamp (milliseconds): Unix timestamp in milliseconds.',
          utcIso: 'UTC Time (ISO 8601): International standard UTC format.',
          relative: 'Relative Time: Human-readable relative time description.'
        },
        buttons: {
          title: 'Button Guide',
          pasteAndParse: 'Paste and Parse: Paste from clipboard and automatically parse the time format.',
          setCurrent: 'Set Current Time: Use the current system time as input for conversion.'
        }
      },
      actions: {
        pasteAndParse: 'Paste and Parse',
        setCurrent: 'Set Current Time'
      },
      placeholder: 'Enter timestamp, date string or natural language...',
      result: {
        title: 'Conversion Result',
        localTime: 'Local Time (UTC+8)',
        localDate: 'Local Date',
        timestampSec: 'Timestamp (seconds)',
        timestampMs: 'Timestamp (milliseconds)',
        utcTime: 'UTC Time (ISO 8601)',
        relativeTime: 'Relative Time'
      },
      formats: {
        local: 'Local Time',
        utc: 'UTC Time',
        timestamp: 'Timestamp (seconds)',
        timestampMs: 'Timestamp (milliseconds)',
        iso: 'ISO 8601',
        rfc2822: 'RFC 2822',
        relative: 'Relative Time'
      },
      help: {
        title: 'Timestamp Converter Guide',
        description: 'Powerful time conversion tool supporting multiple formats and intelligent recognition of various time inputs.',
        features: {
          intelligent: 'Smart Recognition: Automatically detect timestamp, date strings, and natural language time expressions.',
          multiFormat: 'Multiple Formats: Support Unix timestamp, ISO 8601, RFC 2822, and custom formats.',
          timezone: 'Timezone Support: Convert between local time and UTC, with timezone awareness.',
          relative: 'Relative Time: Display human-readable relative time (e.g., "2 hours ago").'
        },
        formats: {
          timestamp: 'Unix Timestamp: Seconds since January 1, 1970 UTC.',
          timestampMs: 'Millisecond Timestamp: Milliseconds since January 1, 1970 UTC.',
          iso: 'ISO 8601: International standard date-time format (YYYY-MM-DDTHH:mm:ss.sssZ).',
          rfc2822: 'RFC 2822: Email and HTTP header date format.',
          local: 'Local Time: Time in your current timezone.',
          utc: 'UTC Time: Coordinated Universal Time.'
        },
        buttons: {
          setCurrent: 'Set Current: Use the current system time as input.',
          convert: 'Convert: Transform between different time formats.'
        }
      }
    },

    // UUID Generator
    uuid: {
      name: 'UUID Generator',
      description: 'Generate globally unique identifiers',
      generate: 'Generate UUID',
      version4: 'UUID v4 (Random)',
      output: 'Generated UUID',
      copySuccess: 'UUID copied to clipboard',
      help: {
        title: 'UUID Generator Guide',
        description: 'Generate RFC 4122 compliant Universally Unique Identifiers (UUID), ensuring global uniqueness.',
        features: {
          version4: 'UUID v4: Uses random or pseudo-random numbers, providing 122 bits of entropy.',
          format: 'Standard Format: 8-4-4-4-12 hexadecimal digits, e.g., 550e8400-e29b-41d4-a716-446655440000.',
          uniqueness: 'Global Uniqueness: Extremely low probability of collision, suitable for distributed systems.',
          applications: 'Common Uses: Database primary keys, session IDs, file names, API request IDs.'
        },
        buttons: {
          generate: 'Generate: Create a new UUID v4.',
          copy: 'Copy: Copy the generated UUID to clipboard for easy use.'
        }
      }
    },

    // Text Analyzer
    textAnalyzer: {
      name: 'Text Analyzer',
      description: 'Analyze text statistics and information',
      input: 'Input Text',
      characters: 'Characters',
      charactersNoSpaces: 'Characters (No Spaces)',
      words: 'Words',
      wordsZh: 'Chinese Words',
      lines: 'Lines',
      paragraphs: 'Paragraphs',
      bytes: 'Bytes',
      readingTime: 'Reading Time',
      minute: 'minute',
      seconds: 'seconds',
      intro: {
        title: 'Text Statistics Tool Guide',
        description: 'Comprehensive text analysis tool that provides detailed statistics on characters, words, and document structure.',
        features: {
          title: 'Feature Description',
          realtime: 'Real-time Analysis: Statistics update automatically as you type.',
          comprehensive: 'Comprehensive Metrics: Character count, word count, line count, paragraph count and more.',
          multilingual: 'Multi-language Support: Accurate analysis for both English and Chinese text.',
          readingTime: 'Reading Time Estimation: Calculate estimated reading time based on average reading speed.'
        }
      },
      actions: {
        paste: 'Paste',
        clear: 'Clear'
      },
      stats: {
        charactersWithSpaces: 'Characters (with spaces)',
        charactersNoSpaces: 'Characters (no spaces)',
        words: 'Words',
        lines: 'Lines',
        paragraphs: 'Paragraphs'
      },
      help: {
        title: 'Text Analyzer Guide',
        description: 'Comprehensive text statistics analysis tool that provides detailed character, word, and structure information.',
        features: {
          characters: 'Character Count: Total characters including spaces and special characters.',
          charactersNoSpaces: 'Characters (No Spaces): Character count excluding spaces and line breaks.',
          words: 'Word Count: English words separated by spaces or punctuation.',
          wordsZh: 'Chinese Words: Chinese character count, each character counted as one word.',
          lines: 'Line Count: Total number of lines including empty lines.',
          paragraphs: 'Paragraph Count: Text blocks separated by empty lines.',
          bytes: 'Byte Count: UTF-8 encoded byte size, useful for storage calculations.',
          readingTime: 'Reading Time: Estimated reading time based on average reading speed (200 words/minute).'
        }
      }
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
      copyHash: 'Copy Hash',
      help: {
        title: 'Hash Generator Guide',
        description: 'Generate cryptographic hash values using multiple algorithms, suitable for data integrity verification and security applications.',
        coreFeatures: 'Core Features',
        algorithms: {
          md5: 'MD5: 128-bit hash, fast but not cryptographically secure, suitable for checksums.',
          sha1: 'SHA-1: 160-bit hash, better than MD5 but deprecated for security applications.',
          sha256: 'SHA-256: 256-bit hash, part of SHA-2 family, currently secure and widely used.',
          sha512: 'SHA-512: 512-bit hash, highest security level, suitable for high-security requirements.'
        },
        applications: {
          integrity: 'Data Integrity: Verify file or data hasn\'t been tampered with.',
          passwords: 'Password Storage: Hash passwords before storing (recommend adding salt).',
          fingerprinting: 'Digital Fingerprinting: Create unique identifiers for data.',
          blockchain: 'Blockchain: Used in cryptocurrency and distributed ledger systems.'
        },
        buttons: {
          copy: 'Copy Hash: Copy the generated hash value to clipboard.'
        }
      }
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
      preserve: 'Preserve',
      intro: {
        title: 'SQL Formatter Tool Guide',
        description: 'Professional SQL statement formatting tool that supports multiple database dialects and provides intelligent formatting capabilities.',
        features: {
          title: 'Core Features',
          multiDatabase: 'Multi-Database Support: Compatible with MySQL, PostgreSQL, SQLite, SQL Server and other mainstream databases.',
          smartFormatting: 'Smart Formatting: Automatic indentation, line breaks, and keyword alignment for better readability.',
          customOptions: 'Custom Options: Adjustable indent size, keyword case, and formatting style to meet different coding standards.',
          syntaxHighlight: 'Syntax Highlighting: Clear visual distinction of keywords, strings, comments and other SQL elements.'
        },
        buttons: {
          title: 'Button Guide',
          clear: 'Clear: Clear all input content.',
          paste: 'Paste: Paste content from clipboard.',
          copy: 'Copy: Copy formatted result to clipboard.',
          format: 'Format: Beautify and organize SQL statements.',
          compress: 'Compress: Remove unnecessary whitespace and line breaks.',
          escape: 'Escape: Escape special characters in SQL strings.',
          unescape: 'Unescape: Remove escape characters from SQL strings.'
        },
        smartProcessing: {
          title: 'Smart Processing',
          autoDetect: 'Automatic detection of SQL dialect and intelligent formatting.',
          preserveComments: 'Preserve comments and maintain original semantic structure.',
          errorHandling: 'Robust error handling for malformed SQL statements.'
        }
      },
      actions: {
        clear: 'Clear',
        paste: 'Paste',
        copy: 'Copy',
        format: 'Format',
        compress: 'Compress',
        escape: 'Escape',
        unescape: 'Unescape'
      },
      options: {
        database: 'Database',
        indent: 'Indent',
        spaces2: '2 Spaces',
        spaces3: '3 Spaces',
        spaces4: '4 Spaces',
        autoWrap: 'Auto Wrap'
      },
      editor: {
        title: 'SQL Editor',
        placeholder: 'Enter your SQL statement here...'
      },
      help: {
        title: 'SQL Formatter Guide',
        description: 'Professional SQL statement formatting tool that supports multiple database dialects and customizable formatting options.',
        features: {
          multiDatabase: 'Multi-Database Support: Compatible with MySQL, PostgreSQL, SQLite, SQL Server and other databases.',
          formatting: 'Smart Formatting: Automatic indentation, line breaks, and keyword alignment.',
          customization: 'Custom Options: Adjustable indent size, keyword case, and formatting style.',
          syntax: 'Syntax Highlighting: Clear visual distinction of keywords, strings, and comments.'
        },
        options: {
          indentSize: 'Indent Size: Control the number of spaces for each indentation level.',
          keywordCase: 'Keyword Case: Choose between uppercase, lowercase, or preserve original case.',
          database: 'Database Type: Select specific database dialect for optimal formatting.'
        },
        buttons: {
          format: 'Format: Beautify and organize your SQL statements.',
          copy: 'Copy: Copy the formatted SQL to clipboard.'
        }
      }
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
      centuries: 'centuries',
      types: {
        strong: 'Strong Password (Recommended)',
        strongDesc: 'High-strength passwords containing uppercase, lowercase, numbers and symbols',
        readable: 'Readable Password',
        readableDesc: 'Passwords excluding confusing characters, easy for manual input',
        pin: 'PIN Code',
        pinDesc: 'Numeric-only passwords, suitable for PIN scenarios',
        memorable: 'Memorable Password',
        memorableDesc: 'Easy-to-remember passwords based on common word combinations'
      },
      passwordType: 'Password Type',
      passwordLength: 'Password Length',
      recommendedLength: 'Recommended Length',
      characters: 'characters',
      characterTypes: 'Character Types',
      uppercase: 'Uppercase Letters',
      lowercase: 'Lowercase Letters',
      numbers: 'Numbers',
      symbols: 'Symbols',
      excludeAmbiguous: 'Exclude Ambiguous Characters',
      configOptions: 'Configuration Options',
      capitalizeWords: 'Capitalize Words',
      wordCount: 'Word Count',
      generatedPasswords: 'Generated Passwords',
      regenerate: 'Regenerate',
      copyPassword: 'Copy Password',
      strengthAnalysis: 'Password Strength Analysis',
      strengthLevel: 'Strength Level',
      charsetSize: 'Character Set Size',
      securityAdvice: 'Security Advice',
      crackTimeValues: {
        lessThanMinute: 'Less than 1 minute',
        minutesFormat: '{count} minutes',
        hoursFormat: '{count} hours',
        daysFormat: '{count} days',
        yearsFormat: '{count} years',
        centuriesFormat: 'Tens of thousands of years'
      },
      advice: {
        lengthAdvice: 'Use passwords with 12+ characters for security',
        unique: 'Do not use the same password for multiple accounts',
        regular: 'Regularly change passwords for important accounts',
        manager: 'Use a password manager to store passwords',
        twoFactor: 'Enable two-factor authentication for enhanced security'
      },
      help: {
        title: 'Password Generator Guide',
        description: 'Advanced password generator with multiple types and security analysis to create strong, secure passwords.',
        types: {
          strong: 'Strong Password: Mix of uppercase, lowercase, numbers, and symbols for maximum security.',
          readable: 'Readable Password: Excludes ambiguous characters (0, O, l, I) for easier typing.',
          pin: 'PIN Code: Numeric-only passwords for PIN requirements.',
          memorable: 'Memorable Password: Uses common words and patterns for easier memorization.'
        },
        options: {
          length: 'Length: Longer passwords provide exponentially better security.',
          uppercase: 'Uppercase Letters: Include A-Z characters.',
          lowercase: 'Lowercase Letters: Include a-z characters.',
          numbers: 'Numbers: Include 0-9 digits.',
          symbols: 'Symbols: Include special characters (!@#$%^&*).',
          excludeSimilar: 'Exclude Similar: Remove confusing characters like 0/O, l/I/1.'
        },
        security: {
          entropy: 'Entropy: Measures password randomness and unpredictability.',
          strength: 'Strength Meter: Visual indicator of password security level.',
          crackTime: 'Crack Time: Estimated time for brute-force attacks.',
          recommendations: 'Use at least 12 characters, mix character types, avoid personal information.'
        },
        buttons: {
          generate: 'Generate: Create a new password with current settings.',
          regenerate: 'Regenerate: Create another password with same settings.',
          copy: 'Copy: Copy the generated password to clipboard.'
        }
      }
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
