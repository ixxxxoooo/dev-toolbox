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
    home: '首页'
  },

  // 导航和菜单
  nav: {
    home: '首页',
    tools: '工具',
    settings: '设置',
    about: '关于',
    language: '语言'
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
        features: {
          sideBySide: '分屏对比: 左右两栏显示，便于逐行比较。',
          inline: '内联对比: 在同一文本流中高亮显示差异。',
          ignoreWhitespace: '忽略空白: 忽略行首、行尾的空格和制表符差异，专注于内容变更。',
          lineNumbers: '显示行号: 控制编辑器是否显示行号。',
          theme: '主题: 切换编辑器显示主题（深色/浅色）。'
        },
        buttons: {
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
      toYaml: '转为 YAML',
      toXml: '转为 XML',
      fromYaml: '从 YAML 转换',
      fromXml: '从 XML 转换',
      treeView: '树状视图',
      jsonPath: 'JSONPath 查询',
      input: '输入 JSON',
      output: '输出结果',
      query: '查询路径',
      queryResult: '查询结果',
      valid: 'JSON 格式正确',
      invalid: 'JSON 格式错误',
      error: '解析错误'
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
      }
    },

    // UUID 生成器
    uuid: {
      name: 'UUID 生成器',
      description: '生成全局唯一标识符',
      generate: '生成 UUID',
      version4: 'UUID v4 (随机)',
      output: '生成的 UUID',
      copySuccess: 'UUID 已复制到剪贴板'
    },

    // 文本分析
    textAnalyzer: {
      name: '文本分析',
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
      seconds: '秒'
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
      copyHash: '复制哈希值'
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
      preserve: '保持原样'
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
      centuries: '世纪'
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
