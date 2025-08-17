export default {
  // 应用通用
  app: {
    title: 'Dev Toolbox',
    subtitle: '开发者工具箱',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    export: '导出',
    import: '导入',
    copy: '复制',
    paste: '粘贴',
    clear: '清空',
    reset: '重置',
    download: '下载',
    upload: '上传',
    format: '格式化',
    minify: '压缩',
    validate: '验证',
    generate: '生成',
    analyze: '分析',
    convert: '转换',
    swap: '交换',
    previous: '上一个',
    next: '下一个',
    help: '帮助',
    back: '返回',
    home: '首页',
    backToHome: '返回主页'
  },

  // 导航和菜单
  nav: {
    home: '首页',
    tools: '工具',
    settings: '设置',
    about: '关于',
    language: '语言'
  },

  // 通用UI文本
  ui: {
    buttons: {
      importFile: '导入文件',
      downloadResult: '下载结果',
      downloadFile: '下载文件',
      clearAll: '清空',
      pasteAndParse: '粘贴并解析',
      setCurrentTime: '设为当前时间',
      generateUuid: '生成 UUID',
      generatePassword: '生成密码',
      useAsInput: '作为输入',
      showTreeView: '显示',
      hideTreeView: '隐藏',
      regenerate: '重新生成',
      pasteFromClipboard: '从剪贴板粘贴',
      copyToClipboard: '复制到剪贴板'
     },
     labels: {
      input: '输入',
      output: '结果',
      result: '结果',
      mode: '模式',
      encode: '编码',
      decode: '解码',
      format: '格式化',
      minify: '压缩',
      convert: '转换',
      escape: '转义',
      unescape: '去转义',
      autoProcess: '自动处理',
      autoWrap: '自动换行',
      urlSafe: 'URL安全',
      treeView: '树状视图',
      indent: '缩进',
      spaces2: '2空格',
      spaces4: '4空格',
      standard: '标准模式'
    },
    titles: {
      topHeader: '顶部标题栏',
      mainContent: '主要内容区域',
      toolbar: '工具栏',
      inputEditor: '输入编辑器',
      outputEditor: '输出编辑器',
      generatedResult: '生成的结果',
      conversionResult: '转换结果',
      statisticsResult: '统计结果'
    },
    placeholders: {
      searchTools: '搜索工具...',
      clickToGenerate: '点击生成按钮',
      enterText: '请输入文本...',
      enterTimestamp: '输入时间戳、日期字符串或自然语言...'
    },
    messages: {
      invalidJson: '无效的JSON，无法生成树状视图',
      cannotReadClipboard: '无法读取剪贴板',
      formatFailed: '格式化失败',
      minifyFailed: '压缩失败',
      unrecognizedDateFormat: '无法识别的日期格式'
    }
  },

  // 首页
  home: {
    title: '选择您需要的工具',
    subtitle: '提升开发效率的实用工具集合',
    searchPlaceholder: '搜索工具...',
    recentTools: '最近使用',
    allTools: '所有工具'
  },

  // 工具模块
  tools: {
    // 文本对比
    diff: {
       name: '文本对比',
       description: '比较两个文本之间的差异',
       leftPanel: '左侧文本',
       rightPanel: '右侧文本',
       sideBySide: '并排对比',
       inline: '内联对比',
       ignoreWhitespace: '忽略空白',
       wordWrap: '自动换行',
       darkTheme: '深色主题',
       lightTheme: '浅色主题',
       uploadFile: '上传文件',
       downloadDiff: '下载对比结果',
       mode: '模式',
       theme: '主题',
       showLineNumbers: '显示行号',
       showWhitespace: '显示空白字符',
       previousDiff: '上一个差异',
       nextDiff: '下一个差异',
       swapContent: '交换内容',
       clearAll: '清空全部',
       pasteLeft: '粘贴到左侧',
       pasteRight: '粘贴到右侧',
       copyLeft: '复制左侧',
       copyRight: '复制右侧',
      help: {
         title: '文本对比工具说明',
         description: '基于Monaco Editor的强大文本对比工具，支持实时编辑和高亮差异。',
         coreFeatures: '核心功能',
         features: {
           sideBySide: '分屏对比: 左右两栏显示，便于逐行比较。',
           inline: '内联对比: 在同一文本流中高亮显示差异。',
           ignoreWhitespace: '忽略空白: 忽略行首、行尾的空格和制表符差异，专注于内容变更。',
           lineNumbers: '显示行号: 控制编辑器是否显示行号。',
           theme: '主题: 切换编辑器显示主题（深色/浅色）。'
         },
         buttons: {
           title: '按钮说明',
           navigation: '上一个/下一个: 快速跳转到差异点。',
           swap: '交换内容: 交换左右两边编辑器的文本。',
           clear: '清空全部: 清空所有文本内容。',
           clipboard: '粘贴/复制: 独立操作左右编辑器的内容。'
         }
       },
      stats: {
        added: '新增',
        deleted: '删除',
        modified: '修改',
        unchanged: '未变'
      }
    },

    // Base64 编解码
    base64: {
      name: 'Base64 编解码',
      description: 'Base64 编码和解码工具',
      encode: '编码',
      decode: '解码',
      input: '输入文本',
      output: '输出结果',
      urlSafe: 'URL 安全模式',
      uploadFile: '导入文件',
      downloadResult: '下载结果',
      copyToClipboard: '复制到剪贴板',
      pasteFromClipboard: '从剪贴板粘贴',
      clearAll: '清空',
      mode: '模式',
      standard: '标准模式',
      help: {
        title: 'Base64 编解码工具说明',
        description: '一个符合RFC 4648标准的Base64编解码工具，能正确处理包括中文在内的UTF-8字符。',
        features: {
          encoding: '编码模式: 将文本或文件内容转换为Base64格式。',
          decoding: '解码模式: 将Base64字符串还原为原始内容。',
          urlSafe: 'URL安全模式: 使用URL和文件名安全的Base64字符集。',
          utf8: 'UTF-8支持: 正确处理中文等多字节字符。'
        }
      }
    },

    // JSON 工具
    json: {
      name: 'JSON 工具',
      description: 'JSON 格式化、压缩和转换',
      format: '格式化',
      minify: '压缩',
      validate: '验证',
      convert: '转换',
      escape: '转义',
      unescape: '去转义',
      treeView: '树状视图',
      from: '从',
      to: '到',
      downloadJson: '下载JSON',
      invalidJsonTreeView: '无效的JSON，无法生成树状视图',
      toYaml: '转为 YAML',
      toXml: '转为 XML',
      fromYaml: '从 YAML 转换',
      fromXml: '从 XML 转换',
      jsonPath: 'JSONPath 查询',
      input: '输入 JSON',
      output: '输出结果',
      query: '查询路径',
      queryResult: '查询结果',
      valid: 'JSON 格式正确',
      invalid: 'JSON 格式错误',
      error: '解析错误',
      help: {
        title: 'JSON 工具说明',
        description: '这是一个多功能的JSON处理工具，支持格式化、压缩和多种数据格式转换。',
        coreFeatures: '核心功能',
        features: {
          editor: '输入/输出编辑器',
          editorDesc: '支持语法高亮、实时校验和代码折叠。',
          treeView: '树状视图',
          treeViewDesc: '直观展示JSON结构，便于浏览复杂数据。',
          format: '格式化',
          formatDesc: '将JSON美化排版，支持2或4空格缩进。',
          minify: '压缩',
          minifyDesc: '移除JSON中的所有空白字符，减小体积。',
          convert: '转换',
          convertDesc: '支持JSON与YAML、XML之间的相互转换。'
        },
        buttons: {
          title: '按钮说明',
          importFile: '导入文件',
          importFileDesc: '从本地文件加载内容到输入框。',
          downloadJson: '下载JSON',
          downloadJsonDesc: '将结果下载为.json文件。',
          clear: '清空',
          clearDesc: '清空所有输入和输出内容。',
          toggleTreeView: '显示/隐藏树状视图',
          toggleTreeViewDesc: '切换中间树状视图的显示状态。',
          autoProcess: '自动处理',
          autoProcessDesc: '勾选后，输入内容变化时自动进行处理。'
        }
      }
    },

    // URL 编解码
    url: {
      name: 'URL 编解码',
      description: 'URL 编码和解码工具',
      encode: '编码',
      decode: '解码',
      encodeComponent: 'encodeURIComponent',
      encodeUri: 'encodeURI',
      decodeComponent: 'decodeURIComponent',
      decodeUri: 'decodeURI',
      input: '输入 URL',
      output: '输出结果'
    },

    // 时间戳转换
    timestamp: {
      name: '时间戳转换',
      description: '时间戳与日期格式相互转换',
      input: '输入时间',
      timestamp: '时间戳',
      datetime: '日期时间',
      format: '格式',
      timezone: '时区',
      local: '本地时间',
      utc: 'UTC 时间',
      iso: 'ISO 8601',
      rfc2822: 'RFC 2822',
      relative: '相对时间',
      currentTime: '当前时间',
      setCurrent: '设为当前时间',
      milliseconds: '毫秒',
      seconds: '秒',
      intelligent: '智能识别',
      formats: {
        local: '本地时间',
        utc: 'UTC 时间',
        timestamp: '时间戳（秒）',
        timestampMs: '时间戳（毫秒）',
        iso: 'ISO 8601',
        rfc2822: 'RFC 2822',
        relative: '相对时间'
      },
      help: {
        title: '智能时间戳转换工具说明',
        description: '一个智能的时间转换工具，支持多种输入格式并实时显示多种输出结果。',
        inputSupport: {
          timestamp: '时间戳: 10位 (秒) 或 13位 (毫秒) 纯数字，自动识别。',
          dateString: '日期字符串: 如 "2025-08-01 23:56:17"。',
          iso8601: 'ISO 8601: 如 "2025-08-01T15:56:17Z"。',
          naturalLanguage: '自然语言日期: 如 "August 1, 2025 11:56 PM" (英文)。'
        },
        outputFormats: {
          description: '本地时间 (UTC+8), 本地日期, 时间戳 (秒/毫秒), UTC时间 (ISO 8601), RFC 2822, 相对时间。'
        },
        buttons: {
          pasteAndParse: '粘贴并解析: 从剪贴板粘贴内容并自动解析。',
          setCurrentTime: '设为当前时间: 将输入框设置为当前时间并解析。',
          copy: '复制: 复制对应行的结果到剪贴板。'
        },
        example: {
          input: '输入',
          output: '输出 (本地时间)'
        },
        placeholder: '输入时间戳、日期字符串或自然语言...',
        resultTitle: '转换结果',
        copyTitle: '复制',
        formats: {
          localTime: '本地时间 (UTC+8)',
          localDate: '本地日期',
          timestampSeconds: '时间戳 (秒)',
          timestampMs: '时间戳 (毫秒)',
          utcTime: 'UTC 时间 (ISO 8601)',
          relativeTime: '相对时间'
        }
      }
    },

    // UUID 生成器
    uuid: {
      name: 'UUID 生成器',
      description: '生成全局唯一标识符',
      generate: '生成 UUID',
      version4: 'UUID v4 (随机)',
      output: '生成的 UUID',
      copySuccess: 'UUID 已复制到剪贴板',
      help: {
        title: 'UUID 生成器说明',
        description: '用于生成全局唯一标识符 (UUID)。',
        features: {
          uuidv4: 'UUID v4: 基于随机数生成，是最常用的UUID版本。'
        },
        buttons: {
          generate: '生成 UUID: 生成一个新的UUID。',
          copy: '复制: 复制当前显示的UUID到剪贴板。',
          clear: '清空: 清空UUID显示区域。'
        },
        placeholder: '点击生成 UUID 按钮',
        copyTitle: '复制 UUID'
      }
    },

    // 文本分析
    textAnalyzer: {
      name: '字符统计工具',
      description: '统计文本的字符数、行数等信息',
      input: '输入文本',
      stats: '统计信息',
      characters: '字符数',
      charactersNoSpaces: '字符数（不含空格）',
      words: '单词数',
      wordsZh: '中文字数',
      lines: '行数',
      paragraphs: '段落数',
      bytes: '字节数',
      readingTime: '阅读时间',
      minute: '分钟',
      seconds: '秒',
      help: {
        title: '字符统计工具说明',
        description: '实时统计文本的字数、字符数、行数、段落数等信息。',
        features: {
          charactersWithSpaces: '字符数 (含空格): 统计所有字符，包括空格和换行符。',
          charactersNoSpaces: '字符数 (不含空格): 统计非空白字符。',
          words: '字数: 统计英文单词数量和中文汉字数量。',
          lines: '行数: 统计文本行数。',
          paragraphs: '段落数: 统计段落数量 (以连续换行符分隔)。'
        },
        buttons: {
          paste: '粘贴',
          clear: '清空'
        }
      }
    },

    // 哈希生成器
    hash: {
      name: '哈希生成器',
      description: '生成文本的 MD5、SHA 等哈希值',
      input: '输入文本',
      algorithms: '算法',
      md5: 'MD5',
      sha1: 'SHA-1',
      sha256: 'SHA-256',
      sha512: 'SHA-512',
      result: '哈希结果',
      copyHash: '复制哈希值',
      help: {
        title: '哈希生成器说明',
        description: '用于生成文本的各种哈希值，如MD5、SHA-1、SHA-256等。',
        coreFeatures: '功能说明',
        features: {
          md5: '广泛使用的哈希算法，生成128位哈希值。',
          sha1: '160位哈希算法，安全性低于SHA-256。',
          sha256: '256位哈希算法，安全性较高。',
          sha512: '512位哈希算法，安全性最高。'
        },
        buttons: {
          paste: '粘贴',
          clear: '清空',
          copy: '复制'
        },
        inputTitle: '输入文本',
        resultTitle: '哈希结果'
      }
    },

    // SQL 格式化
    sql: {
      name: 'SQL 格式化',
      description: 'SQL 语句格式化和美化',
      input: '输入 SQL',
      output: '格式化结果',
      format: '格式化',
      database: '数据库类型',
      indentSize: '缩进大小',
      keywordCase: '关键字大小写',
      uppercase: '大写',
      lowercase: '小写',
      preserve: '保持原样',
      help: {
        title: 'SQL 格式化工具说明',
        description: '这是一个专业的SQL格式化工具，支持多种数据库语法的美化和处理。',
        features: {
          editor: 'SQL编辑器: 支持SQL语法高亮、实时编辑和代码折叠。',
          multiDatabase: '多数据库支持: 支持MySQL、PostgreSQL、TiDB、SQLite等。'
        },
        coreFunctions: {
          format: '格式化: 一键美化SQL语句，提升可读性。',
          minify: '压缩: 一键移除多余空白字符，生成紧凑SQL。',
          escape: '转义/去转义: 一键处理字符串转义字符。'
        },
        buttons: {
          format: '格式化: 美化选中文本或全部SQL语句。',
          minify: '压缩: 压缩选中文本或全部SQL，多段SQL各自压缩。',
          escape: '转义/去转义: 处理选中文本或全部内容的转义字符。',
          importFile: '导入文件: 从本地.sql文件加载内容到编辑器。',
          downloadSql: '下载SQL: 将编辑器内容下载为.sql文件。'
        },
        smartProcessing: {
          title: '智能处理',
          selectedText: '选中文本优先: 有选中文本时仅处理选中部分。',
          multiSql: '多段SQL压缩: 自动识别多个SQL语句，各自压缩。'
        },
        controls: {
          database: '数据库',
          indent: '缩进',
          spaces2: '2空格',
          spaces3: '3空格',
          spaces4: '4空格',
          wordWrap: '自动换行'
        },
        editor: {
          title: 'SQL 编辑器',
          paste: '粘贴',
          copy: '复制',
          format: '格式化',
          minify: '压缩',
          escape: '转义',
          unescape: '去转义'
        }
      }
    },

    // 密码生成器
    password: {
      name: '密码生成器',
      description: '生成安全密码',
      generate: '生成密码',
      type: '密码类型',
      strongType: '强密码',
      readable: '可读密码',
      pin: 'PIN 码',
      memorable: '易记密码',
      length: '长度',
      includeUppercase: '包含大写字母',
      includeLowercase: '包含小写字母',
      includeNumbers: '包含数字',
      includeSymbols: '包含符号',
      excludeSimilar: '排除相似字符',
      strength: '密码强度',
      weak: '弱',
      medium: '中等',
      strong: '强',
      veryStrong: '很强',
      entropy: '熵值',
      crackTime: '破解时间',
      instantLy: '瞬间',
      seconds: '秒',
      minutes: '分钟',
      hours: '小时',
      days: '天',
      months: '月',
      years: '年',
      centuries: '世纪',
      types: {
        strong: '强密码 (推荐)',
        strongDesc: '包含大小写字母、数字和符号的高强度密码',
        readable: '易读密码',
        readableDesc: '排除易混淆字符的密码，便于手动输入',
        pin: 'PIN码',
        pinDesc: '纯数字密码，适用于PIN码场景',
        memorable: '记忆性密码',
        memorableDesc: '基于常见单词组合的易记忆密码'
      },
      passwordType: '密码类型',
      passwordLength: '密码长度',
      recommendedLength: '推荐长度',
      characters: '位',
      characterTypes: '字符类型',
      uppercase: '大写字母',
      lowercase: '小写字母',
      numbers: '数字',
      symbols: '符号',
      excludeAmbiguous: '排除易混淆字符',
      configOptions: '配置选项',
      capitalizeWords: '单词首字母大写',
      wordCount: '单词数量',
      generatedPasswords: '生成的密码',
      regenerate: '重新生成',
      copyPassword: '复制密码',
      strengthAnalysis: '密码强度分析',
      strengthLevel: '强度等级',
      charsetSize: '字符集大小',
      securityAdvice: '安全建议',
      help: {
        title: '密码生成器说明',
        description: '基于业界最佳实践生成安全密码。',
        types: {
          strong: '强密码: 包含大小写字母、数字和符号，长度12-64位',
          readable: '易读密码: 避免易混淆字符(0,O,l,1等)，便于输入',
          pin: 'PIN码: 纯数字密码，适用于银行卡等场景',
          memorable: '记忆性密码: 使用词组组合，易于记忆但安全'
        },
        recommendation: '建议使用12位以上强密码以确保安全性',
        buttons: {
          generate: '生成密码',
          clear: '清空'
        },
        config: {
          passwordType: '密码类型',
          passwordLength: '密码长度',
          recommendedLength: '推荐长度',
          characterTypes: '字符类型',
          uppercase: '大写字母 (A-Z)',
          lowercase: '小写字母 (a-z)',
          numbers: '数字 (0-9)',
          symbols: '符号 (!@#$%^&*)',
          excludeConfusing: '排除易混淆字符',
          memorableConfig: '配置选项',
          includeNumbers: '包含数字',
          capitalizeWords: '单词首字母大写',
          wordCount: '单词数量'
        },
        analysis: {
          title: '密码强度分析',
          strengthLevel: '强度等级',
          entropy: '熵值',
          crackTime: '破解时间',
          charsetSize: '字符集大小'
        },
        security: {
          title: '安全建议',
          tips: [
            '使用12位以上的密码以确保安全性',
            '不要在多个账户使用相同密码',
            '定期更换重要账户的密码',
            '使用密码管理器存储密码',
            '启用双因素认证增强安全性'
          ]
        },
        timeUnits: {
          lessThanMinute: '少于1分钟',
          minutes: '分钟',
          hours: '小时',
          days: '天',
          years: '年',
          thousandsOfYears: '数万年以上'
        }
      }
    }
  },

  // 工具类别
  categories: {
    'text': '文本处理',
    'encoding': '编码工具',
    'time': '时间工具',
    'data': '数据格式',
    'development': '开发工具'
  },

  // 主题
  theme: {
    light: '浅色主题',
    dark: '深色主题',
    system: '跟随系统',
    toggle: '切换主题'
  },

  // 快捷键
  shortcuts: {
    copy: 'Ctrl+C / Cmd+C',
    paste: 'Ctrl+V / Cmd+V',
    selectAll: 'Ctrl+A / Cmd+A',
    undo: 'Ctrl+Z / Cmd+Z',
    redo: 'Ctrl+Shift+Z / Cmd+Shift+Z'
  },

  // 错误消息
  errors: {
    invalidJson: 'JSON 格式无效',
    invalidUrl: 'URL 格式无效',
    invalidTimestamp: '时间戳格式无效',
    invalidInput: '输入格式无效',
    copyFailed: '复制失败',
    pasteFailed: '粘贴失败',
    uploadFailed: '文件上传失败',
    downloadFailed: '文件下载失败',
    networkError: '网络错误',
    unknownError: '未知错误',
    noResults: '没有找到结果',
    tryAdjustKeywords: '尝试调整搜索关键词'
  },

  // 成功消息
  success: {
    copied: '已复制到剪贴板',
    pasted: '已从剪贴板粘贴',
    uploaded: '文件上传成功',
    downloaded: '文件下载成功',
    cleared: '已清空',
    reset: '已重置',
    saved: '已保存'
  },

  // 帮助信息
  help: {
    diff: {
      title: '文本对比工具使用说明',
      content: '在左右两个编辑器中输入要对比的文本，系统会自动高亮显示差异。支持文件上传、多种对比模式和主题切换。'
    },
    base64: {
      title: 'Base64 编解码使用说明',
      content: '输入文本或上传文件进行 Base64 编码或解码。支持标准模式和 URL 安全模式。'
    },
    json: {
      title: 'JSON 工具使用说明',
      content: '支持 JSON 格式化、压缩、验证，以及与 YAML、XML 格式的相互转换。还提供 JSONPath 查询功能。'
    }
  }
}
