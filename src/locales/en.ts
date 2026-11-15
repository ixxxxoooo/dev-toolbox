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
      palette: 'Color palette',
      palettes: {
        indigo: 'Indigo',
        emerald: 'Emerald',
        rose: 'Rose',
        amber: 'Amber',
        ocean: 'Ocean',
        graphite: 'Graphite'
      },
      uiTheme: 'Interface theme',
      editorThemeHint: 'Code editor theme'
    },
    ui: {
      help: 'Help',
      close: 'Close',
      more: 'More actions'
    },
    nav: {
      search: 'Search tools',
      searchHint: 'Press / to focus search',
      pinned: 'Pinned',
      recent: 'Recent',
      all: 'All tools',
      pin: 'Pin to top',
      unpin: 'Unpin',
      noMatch: 'No matching tools',
      openPalette: 'Command palette'
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
      showGraphView: 'Show Graph View',
      hideGraphView: 'Hide Graph View',
      regenerate: 'Regenerate',
      process: 'Process',
      compare: 'Compare',
      compareLeft: 'Compare Left',
      compareRight: 'Compare Right',
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
      graphView: 'Graph View',
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
      expandSidebar: 'Expand sidebar',
      collapseSidebar: 'Collapse sidebar',
      historyItemTooLarge: 'Content is too large to add to history',
      storageFull: 'Browser storage is full. Recent changes may not be saved after refresh',
      storageTooLarge: 'Content is too large to be saved locally and will be lost after refresh',
      updateAvailable: 'A new version is available',
      updateNow: 'Refresh',
      offlineReady: 'Ready to work offline',
      copyFailed: 'Copy failed. Please check clipboard permission',
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

  // Onboarding
  onboarding: {
    buttons: {
      done: 'Done',
      next: 'Next',
      prev: 'Previous'
    },
    welcome: {
      title: 'Welcome!',
      description: 'Welcome to Dev Toolbox! You can use <b>Cmd + K</b> (Mac) or <b>Ctrl + K</b> (Windows) anytime to open the global command palette to search and switch tools.'
    },
    sidebar: {
      title: 'Expand/Collapse Sidebar',
      description: 'Click here to expand or collapse the tools list to give you more workspace.'
    },
    tools: {
      title: 'Tools List',
      description: 'All available developer tools are listed here. Click to switch.'
    },
    settings: {
      title: 'System Settings',
      description: 'You can switch the application language or toggle dark/light theme at the bottom.'
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
      putLeft: 'Put Left',
      putRight: 'Put Right',
      unicodeDecode: '\\u→Text',
      format: 'Format (JSON / XML / SQL)',
      formatLeft: 'Format Left',
      formatRight: 'Format Right',
      formatBoth: 'Format Both',
      ignoreCase: 'Ignore Case',
      ignoreCaseDescription: 'Compare lines without case differences',
      trimTrailing: 'Trim Line End',
      trimTrailingDescription: 'Strip trailing whitespace on each line before comparing',
      ignoreKeyOrder: 'Ignore Key Order',
      ignoreKeyOrderDescription: 'When both sides are valid JSON, sort object keys recursively before comparing',
      ignoreKeyOrderDisabledTip: 'Available only when both sides are valid JSON',
      diffNavigation: 'Diff navigation',
      diffPosition: '{current} / {total}',
      diffHunks: '{n} diff(s)',
      contentIdentical: 'Both sides are identical',
      similarity: 'Similarity {n}%',
      statsLeftLines: 'Left {n} lines',
      statsRightLines: 'Right {n} lines',
      statsAdded: '+{n}',
      statsRemoved: '−{n}',
      statsHunks: '{n} block(s)',
      toggleMinimap: 'Minimap',
      moreOptions: 'More options',
      formatFailed: 'Format failed',
      helpIntro: 'Compare two texts side by side or inline; use chips to ignore whitespace, case, or JSON key order.',
      sideBySideDescription: 'Two columns with synced scrolling and inline highlights.',
      inlineDescription: 'Single column with deleted and added lines merged.',
      ignoreWhitespaceDescription: 'Ignore leading and trailing whitespace per line (Monaco).',
      unicodeDecodeDesc: 'Decode \\uXXXX sequences for display; turning off restores the original text on unedited sides.',
      diffNavShortcut: 'F7 next, Shift+F7 previous'
    },

    // Base64 Encoder/Decoder
    base64: {
      binaryInput: 'Binary file: {name} ({size}) — will be encoded as raw bytes',
      binaryOutput: 'Binary data ({size}), not valid UTF-8 text. Use the download button to save it as a file',
      fileTooLarge: 'File is too large (max {size})',
      readFileFailed: 'Failed to read file',
      name: 'Base64 Encoder/Decoder',
      description: 'Base64 encoding and decoding tool',
      inputPanel: 'Input',
      resultPanel: 'Result',
      overflowMenu: 'More',
      processError: 'Processing failed',
      statusReady: 'Ready',
      statusBinary: 'Binary output',
      inputSize: '{n} chars',
      outputSize: '{n} chars',
      coreFeatures: 'Core features',
      featureEncode: 'Encode text or binary files to Base64',
      featureDecode: 'Decode Base64 to text; non-UTF-8 bytes can be downloaded',
      featureUrlSafe: 'URL-safe alphabet (- _ instead of + /, optional padding)',
      featureFile: 'Import files; binary is encoded as raw bytes in encode mode',
      wordWrap: 'Word wrap',
      urlSafeTip: 'Use URL-safe Base64 alphabet',
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
      decodeUnicode: 'Unicode Decode (\\u to text)',
      unicodeDecode: '\\u→Text',
      unicodeDecodeDesc: 'Click to enable: decode \\uXXXX in JSON strings to text; click again to turn off',
      expandNested: 'Expand Nested',
      expandNestedDesc: 'Click to enable: recursively parse JSON embedded in string values into objects/arrays; click again to turn off and restore',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      viewTooLarge: 'The content is too large for this view. Use the editor on the left instead',
      bigIntWarning: 'The input contains integers beyond the safe range (2^53) in non-strict JSON; formatting may lose precision. Use strict JSON to keep full precision.',
      keepEdited: 'Content was edited after the switch was turned on, so the current content is kept instead of restoring the original',
      sortKeys: 'Sort keys',
      sortKeysDesc: 'Recursively sort object keys in lexicographic order',
      lenientFix: 'Lenient fix',
      lenientFixDesc: 'Allow comments, single quotes, unquoted keys, and trailing commas (JSON5)',
      jsonPathPlaceholder: 'JSONPath, e.g. $.files[0].name or $..name',
      jsonPathMatches: '{n} matches',
      jsonPathNoMatch: 'No match',
      jsonPathDesc: 'JSONPath query filters text, tree, and table views in the result pane',
      pathCopied: 'Copied path {path}',
      copyTypescript: 'Copy as TypeScript types',
      copyTypescriptDone: 'TypeScript types copied',
      copyResult: 'Copy result',
      viewText: 'Text',
      viewTable: 'Table',
      tableEmpty: 'No array of objects to show as a table',
      tableEmptyHint: 'Try a JSONPath query such as $.files',
      validJson: 'Valid JSON',
      invalidAt: 'Line {line}, column {col}: {msg}',
      topLevelObject: 'Object · {n} top-level keys',
      topLevelArray: 'Array · {n} items',
      scalarType: 'Scalar',
      depth: 'Depth {n}',
      cursor: 'Ln {line}, Col {col}',
      encoding: 'UTF-8',
      indentTab: 'Tab',
      minimap: 'Minimap',
      menuImport: 'File',
      menuDiff: 'Compare'
    },

    // URL Encoder/Decoder
    url: {
      name: 'URL Encoder/Decoder',
      description: 'URL encoding and decoding tool',
      encodeMode: 'Encode Mode',
      decodeMode: 'Decode Mode',
      encodeModeDescription: 'Encode URL parameter values',
      decodeModeDescription: 'Automatically decode URL-encoded characters',
      inputPanel: 'Input',
      resultPanel: 'Result',
      overflowMenu: 'More',
      modeLabel: 'Scope',
      modeComponent: 'Component (encodeURIComponent)',
      modeUri: 'Full URI (encodeURI)',
      modeComponentShort: 'Component',
      modeUriShort: 'URI',
      processError: 'Decode failed',
      statusReady: 'Ready',
      inputSize: '{n} chars',
      outputSize: '{n} chars',
      coreFeatures: 'Core features',
      helpEncodeComponent: 'encodeURIComponent: encodes query values, spaces, and Unicode',
      helpEncodeUri: 'encodeURI: encodes a full URL while keeping : / ? # [ ] @ etc.',
      helpDecode: 'Decode mode uses decodeURIComponent / decodeURI to match',
      wordWrap: 'Word wrap',
    },

    // Timestamp Converter
    timestamp: {
      name: 'Timestamp Converter',
      description: 'Smart timestamp conversion with multiple input formats and time zones.',
      actions: {
        pasteAndParse: 'Paste and Parse',
        setCurrentTime: 'Set Current Time'
      },
      liveClock: 'Follow current time',
      liveClockDesc: 'Refresh relative time and live outputs every second without changing the input',
      helpFormatsTitle: 'Supported input formats',
      helpTimestamp: 'Unix timestamp: 10 digits (seconds) or 13 digits (milliseconds)',
      helpDateString: 'Date strings: 2023-01-01, YYYYMMDD (strict)',
      helpIso: 'ISO 8601: 2023-01-01T00:00:00Z',
      helpNatural: 'Natural language: now, today, tomorrow, etc.',
      emptyHint: 'Enter a valid time to see formatted outputs',
      statusReady: 'Waiting for input',
      statusValid: 'Valid time',
      statusStale: 'Showing last valid result',
      result: {
        title: 'Conversion Result',
        localTime: 'Local time ({offset})',
        localDate: 'Local date',
        timestampSec: 'Timestamp (seconds)',
        timestampMs: 'Timestamp (milliseconds)',
        utcTime: 'UTC (ISO 8601)',
        relativeTime: 'Relative time',
        rfc2822: 'RFC 2822',
        tzLocal: 'Local zone',
        tzUtc: 'UTC',
        tzNewYork: 'New York',
        tzLondon: 'London',
        tzTokyo: 'Tokyo',
        tzShanghai: 'Shanghai'
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
      formatDescription: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
      infoPanel: 'About',
      resultPanel: 'Result',
      hintGenerate: 'Click Generate UUID for a new cryptographically strong value.',
      statusEmpty: 'Click generate to create a UUID'
    },

    // Text Analyzer
    textAnalyzer: {
      name: 'Text Analyzer',
      description: 'Text character statistics analysis',
      coreFeatures: 'Core Features',
      inputPanel: 'Input',
      statsPanel: 'Statistics',
      overflowMenu: 'More',
      statusSummary: '{chars} chars · {words} words · {lines} lines',
      statusEmpty: 'Enter text to analyze',
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
      inputPanel: 'Input',
      resultPanel: 'Hashes',
      overflowMenu: 'More',
      statusChars: '{n} chars',
      statusEmpty: 'Enter text to compute hashes',
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
      indent2: '2 spaces',
      indent3: '3 spaces',
      indent4: '4 spaces',
      indentTab: 'Tab',
      indentLabel: 'Indent',
      coreFeatures: 'Core Features',
      formatDescription: 'Beautify SQL using the current dialect and options; output appears in the right pane.',
      minifyDescription: 'Lex-aware minification that preserves string literals.',
      escapeDescription: 'Escape quotes and special characters per dialect rules.',
      unescapeDescription: 'Restore escaped text into executable SQL.',
      escape: 'Escape',
      unescape: 'Unescape',
      unicode: 'Unicode decode',
      unicodeDesc: 'Decode \\uXXXX and similar escapes in the result',
      dialect: 'Dialect',
      dialects: {
        mysql: 'MySQL',
        postgresql: 'PostgreSQL',
        sqlite: 'SQLite',
        sqlserver: 'SQL Server',
        oracle: 'Oracle',
        standard: 'Standard SQL',
      },
      keywordCase: 'Keywords',
      keywordUpper: 'UPPER',
      keywordLower: 'lower',
      keywordPreserve: 'Keep',
      inputPanel: 'Input',
      resultPanel: 'Result',
      resultFormat: 'Formatted',
      resultMinify: 'Minified',
      resultEscape: 'Escaped',
      resultUnescape: 'Unescaped',
      statsLinesChars: '{lines} lines · {chars} chars',
      copyAs: 'Copy as…',
      copyAsHeader: 'Copy as code',
      copyTargets: {
        sql: 'Plain SQL',
        javascript: 'JavaScript template literal',
        java: 'Java text block',
        go: 'Go raw string',
        python: 'Python triple quotes',
        php: 'PHP Heredoc',
        json: 'JSON string',
        escaped: 'Single-line escaped',
      },
      copiedAs: 'Copied as {format}',
      structureOk: 'Structure OK',
      structureParen: 'Unmatched parentheses (near line {line})',
      structureBracket: 'Unmatched brackets (near line {line})',
      structureString: 'Unclosed quote (near line {line})',
      statementCount: '{n} statement(s)',
      tableJoinStats: '{tables} table(s) · {joins} JOIN(s)',
      formatFailed: 'Format failed',
      overflowMenu: 'More',
      copyOutput: 'Copy result',
      minimap: 'Minimap',
    },

    // Password Generator
    password: {
      name: 'Password Generator',
      description: 'Generate secure passwords',
      passwordType: 'Password Type',
      typeShort: {
        strong: 'Strong',
        readable: 'Readable',
        pin: 'PIN',
        memorable: 'Words'
      },
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
      emptyCharsetError: 'Please select at least one character type (uppercase/lowercase/numbers/symbols)',
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
      },
      configPanel: 'Settings',
      emptyResult: 'No passwords yet — click Generate',
      bitsUnit: 'bits',
      statusEmpty: 'Waiting to generate',
      statusEntropy: '{n} bits entropy'
    },

    // Number Converter
    numberConverter: {
      name: 'Number Base Converter',
      description: 'Convert between Binary, Octal, Decimal, and Hexadecimal',
      decimal: 'Decimal',
      hex: 'Hexadecimal',
      binary: 'Binary',
      octal: 'Octal',
      twosComplement: "Two's complement",
      twosHelp: 'Shows two\'s complement for the current decimal value at the selected bit width.',
      twosEmpty: 'Enter a valid integer to see two\'s complement',
      invalidInput: 'Invalid input: contains characters not allowed in this base (integers only)',
      overflow: 'Value exceeds the selected bit width and has been truncated',
      statusReady: 'Waiting for input',
      statusOk: 'Valid number'
    },

    // HTTP Status Codes
    httpStatus: {
      name: 'HTTP Status Codes',
      description: 'Lookup HTTP status codes and meanings',
      searchPlaceholder: 'Search code, title, or description…',
      filterAll: 'All',
      resultCount: '{n} results',
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
      placeholder: 'Paste User Agent string here...',
      desktop: 'Desktop',
      statusEmpty: 'Enter a UA string to parse',
      statusLength: '{n} chars',
      fields: {
        name: 'Name',
        version: 'Version',
        engine: 'Engine',
        platform: 'Architecture',
        vendor: 'Vendor',
        model: 'Model',
        type: 'Type'
      }
    },

    // Regex Tester
    regexTester: {
      name: 'Regex Tester',
      description: 'Test regular expressions',
      regex: 'Regular Expression',
      testString: 'Test String',
      timeout: 'Regex execution exceeded {ms}ms and was aborted (possible catastrophic backtracking). Please simplify the pattern',
      truncated: 'Too many matches; only the first 5000 are shown',
      matches: 'Matches',
      coreFeatures: 'Core Features',
      patternPlaceholder: 'Pattern…',
      replaceWith: 'Replace with',
      replaceResult: 'Replace preview',
      templates: 'Templates',
      templateEmail: 'Email address',
      templateUrl: 'HTTP(S) URL',
      templateIpv4: 'IPv4 address',
      templateHex: 'Hexadecimal',
      templateDigits: 'Digits only',
      templateChinese: 'Chinese characters',
      matchN: 'Match {n}',
      matchIndex: 'Index {n}',
      groupN: 'Group {n}',
      statusMatches: '{n} match(es)',
      statusEmpty: 'Enter a pattern and test string',
      staleHint: 'Showing last valid result',
      unknownError: 'Regex execution failed',
      helpFlags: 'Toggle g / i / m / s / u flags from the toolbar chips',
      helpWorker: 'Matching runs in a worker with debounce; execution aborts on timeout',
      helpReplace: 'Type replacement text to preview replace() output live',
      flags: {
        g: 'Global (g)',
        i: 'Case insensitive (i)',
        m: 'Multiline (m)',
        s: 'DotAll (s)',
        u: 'Unicode (u)'
      },
      flagsShort: {
        g: 'g',
        i: 'i',
        m: 'm',
        s: 's',
        u: 'u'
      }
    },

    // QR Code Generator
    qrCode: {
      name: 'QR Code Generator',
      description: 'Generate custom QR codes',
      placeholder: 'Enter text or URL...',
      options: 'Options',
      inputPanel: 'Content & options',
      previewPanel: 'Preview',
      previewAlt: 'QR code preview',
      errorCorrection: 'Error correction',
      sizePx: 'Size (px)',
      margin: 'Margin',
      colorDark: 'Foreground',
      colorLight: 'Background',
      statusReady: 'QR code ready',
      statusEmpty: 'Enter content to generate',
      statusSize: '{n}px',
      ecLevels: {
        L: 'Low (7%)',
        M: 'Medium (15%)',
        Q: 'Quartile (25%)',
        H: 'High (30%)'
      }
    },

    // Markdown Preview
    markdown: {
      name: 'Markdown Preview',
      description: 'Markdown editing with debounced live preview, TOC, and embedded Mermaid blocks.',
      copyHtml: 'Copy HTML',
      editorPanel: 'Markdown',
      previewPanel: 'Preview',
      viewEdit: 'Edit',
      viewSplit: 'Split',
      viewPreview: 'Preview',
      toc: 'Outline',
      outline: 'Outline',
      tocEmpty: 'No headings',
      coreFeatures: 'Features',
      featureLivePreview: 'Monaco editor with debounced live preview',
      featureToc: 'Collapsible outline sidebar with jump-to-heading',
      featureMermaid: 'Renders ```mermaid fenced blocks',
      featureSanitize: 'DOMPurify sanitizes HTML output',
      featureScrollSync: 'Scroll sync between editor and preview',
      wordCount: '{n} words',
      lineCount: '{n} lines',
      renderMs: 'Render {n} ms',
      previewReady: 'Preview ready',
      scrollSync: 'Scroll sync',
      placeholder: '# Hello World',
      overflowMenu: 'More',
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
      onlyNonAscii: 'Non-ASCII only',
      features: 'Features',
      statusReady: 'Waiting for input',
      statusInput: 'Input {n} chars',
      statusOutput: 'Output {n} chars'
    },

    // Mermaid Diagram
    mermaid: {
      name: 'Mermaid Diagram',
      description: 'Edit Mermaid DSL with live preview, export, and pan/zoom on the canvas.',
      downloadPng: 'Download PNG',
      pngFailed: 'PNG export failed. Try downloading SVG instead',
      downloadSvg: 'Download SVG',
      helpDrag: 'Drag to pan the diagram',
      helpZoom: 'Scroll to zoom in/out',
      editorPanel: 'Mermaid code',
      previewPanel: 'Preview',
      viewEdit: 'Edit',
      viewSplit: 'Split',
      viewPreview: 'Preview',
      fullscreen: 'Fullscreen preview',
      exitFullscreen: 'Exit fullscreen',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      zoomReset: 'Fit to view',
      zoomPercent: '{n}%',
      renderOk: 'Rendered',
      renderPending: 'Rendering…',
      renderErrorLabel: 'Syntax error',
      lineCount: '{n} lines',
      renderMs: 'Render {n} ms',
      coreFeatures: 'Features',
      overflowMenu: 'More',
      theme: 'Theme',
      look: 'Look',
      curve: 'Curve',
      themes: {
        default: 'Default',
        dark: 'Dark',
        forest: 'Forest',
        neutral: 'Neutral',
        base: 'Base',
        github: 'GitHub',
        dracula: 'Dracula',
        nord: 'Nord',
      },
      looks: {
        classic: 'Classic',
        handDrawn: 'Hand Drawn'
      },
      curves: {
        linear: 'Linear',
        basis: 'Basis',
        cardinal: 'Cardinal',
        step: 'Step',
        stepBefore: 'Step Before',
        stepAfter: 'Step After',
        natural: 'Natural',
        monotoneX: 'Monotone X'
      },
      backgrounds: {
        white: 'White',
        transparent: 'Transparent'
      },
      background: 'Background'
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
