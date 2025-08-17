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
    save: 'Save',
    download: 'Download',
    upload: 'Upload',
    generate: 'Generate',
    
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
      regenerate: 'Regenerate'
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
      spaces4: '4 Spaces'
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
      pasted: 'Pasted from clipboard'
    }
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
      decodeModeDescription: 'Automatically decode URL-encoded characters'
    },

    // JSON Tools
    json: {
      name: 'JSON Tool',
      description: 'JSON formatting, minification and conversion',
      downloadJson: 'Download JSON',
      from: 'From',
      to: 'To',
      coreFeatures: 'Core Features',
      formatDescription: 'Format JSON',
      minifyDescription: 'Minify JSON',
      convertDescription: 'JSON/YAML/XML Conversion',
      treeViewDescription: 'Tree View',
      escape: 'Escape',
      unescape: 'Unescape'
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
      unescape: 'Unescape'
    },

    // Password Generator
    password: {
      name: 'Password Generator',
      description: 'Generate secure passwords',
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
      copyPassword: 'Copy Password',
      strengthAnalysis: 'Password Strength Analysis',
      strengthLevel: 'Strength Level',
      charsetSize: 'Character Set Size',
      securityAdvice: 'Security Advice',
      entropy: 'Entropy',
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
      strength: {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        veryStrong: 'Very Strong'
      },
      crackTimeDesc: 'Estimated Time to Crack',
      crackTime: {
        lessThanMinute: 'Less than 1 minute',
        minutes: 'minutes',
        hours: 'hours',
        days: 'days',
        years: 'years',
        centuries: 'centuries'
      },
      advice: {
        length: 'Use a minimum of 12 characters for strong passwords',
        unique: 'Avoid using the same password for multiple accounts',
        regular: 'Regularly change passwords for important accounts',
        manager: 'Use a password manager to store passwords',
        twoFactor: 'Enable two-factor authentication for enhanced security'
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
