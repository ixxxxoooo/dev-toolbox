export default {
  // 应用基础信息
  app: {
    title: 'Dev Toolbox',
    subtitle: '开发者工具箱',
    backToHome: '返回主页',
    example: '示例'
  },

  // 通用文本
  common: {
    // 基础操作
    copy: '复制',
    paste: '粘贴',
    clear: '清空',
    undo: '撤销',
    redo: '重做',
    editorTheme: {
      title: '编辑器主题',
      select: '选择主题',
      auto: '跟随系统',
    },
    save: '保存',
    settings: {
      title: '系统设置',
      appearance: '外观设置',
      darkMode: '深色模式',
      lightMode: '浅色模式',
      language: '语言选择',
      history: '历史记录',
      historyLimit: '保留记录数量',
      palette: '主题配色',
      palettes: {
        indigo: '靛蓝',
        emerald: '翠绿',
        rose: '玫瑰',
        amber: '琥珀',
        ocean: '海洋',
        graphite: '石墨'
      },
      uiTheme: '界面主题',
      editorThemeHint: '代码编辑器配色'
    },
    ui: {
      help: '帮助',
      close: '关闭',
      more: '更多操作'
    },
    nav: {
      search: '搜索工具',
      searchHint: '按 / 聚焦搜索',
      pinned: '已固定',
      recent: '最近使用',
      all: '全部工具',
      pin: '固定到顶部',
      unpin: '取消固定',
      noMatch: '没有匹配的工具',
      openPalette: '命令面板'
    },
    download: '下载',
    upload: '上传',
    generate: '生成',
    apply: '应用',

    // 按钮
    buttons: {
      importFile: '导入文件',
      downloadResult: '下载结果',
      clearAll: '清空',
      pasteAndParse: '粘贴并解析',
      setCurrentTime: '设为当前时间',
      generateUuid: '生成 UUID',
      useAsInput: '作为输入',
      showTreeView: '显示树状视图',
      hideTreeView: '隐藏树状视图',
      showGraphView: '显示关系图',
      hideGraphView: '隐藏关系图',
      regenerate: '重新生成',
      process: '处理',
      compare: '对比',
      compareLeft: '左对比',
      compareRight: '右对比',
      history: '历史记录',
      select: '进入'
    },

    // 历史记录
    history: {
      title: '历史记录',
      empty: '暂无历史记录',
      clear: '清空历史',
      placeholder: '搜索历史...',
      lastUsed: '上次使用',
      use: '使用',
      useLeft: '使用左侧',
      useRight: '使用右侧',
      copy: '复制',
      delete: '删除'
    },

    // 标签
    labels: {
      input: '输入',
      output: '输出',
      result: '结果',
      mode: '模式',
      encode: '编码',
      decode: '解码',
      format: '格式化',
      minify: '压缩',
      convert: '转换',
      autoProcess: '自动处理',
      autoWrap: '自动换行',
      urlSafe: 'URL安全',
      treeView: '树状视图',
      graphView: '关系图视图',
      indent: '缩进',
      spaces2: '2空格',
      spaces4: '4空格',
      navigate: '导航',
      toolCount: '个工具'
    },

    // 占位符
    placeholders: {
      searchTools: '搜索工具...',
      clickToGenerate: '点击生成按钮',
      enterText: '请输入文本...',
      enterTimestamp: '输入时间戳、日期字符串或自然语言...'
    },

    // 消息
    messages: {
      expandSidebar: '展开侧边栏',
      collapseSidebar: '折叠侧边栏',
      historyItemTooLarge: '内容过大，未加入历史记录',
      storageFull: '浏览器存储空间已满，最近的修改刷新后可能丢失',
      storageTooLarge: '内容过大，无法保存到本地，刷新后将丢失',
      updateAvailable: '发现新版本',
      updateNow: '立即刷新',
      offlineReady: '已可离线使用',
      copyFailed: '复制失败，请检查剪贴板权限',
      invalidJson: '无效的JSON，无法生成树状视图',
      cannotReadClipboard: '无法读取剪贴板',
      formatFailed: '格式化失败',
      minifyFailed: '压缩失败',
      unrecognizedDateFormat: '无法识别的日期格式',
      copied: '已复制到剪贴板',
      pasted: '已从剪贴板粘贴',
      searchPlaceholder: '搜索工具... (↑↓ 选择, Enter 进入)',
      noResults: '未找到符合条件的工具'
    }
  },

  // 导航
  nav: {
    tools: '工具菜单',
    language: '语言切换'
  },

  // 新手引导
  onboarding: {
    buttons: {
      done: '完成',
      next: '下一步',
      prev: '上一步'
    },
    welcome: {
      title: '欢迎体验!',
      description: '欢迎使用 Dev Toolbox！你可以随时使用 <b>Cmd + K</b> (Mac) 或 <b>Ctrl + K</b> (Windows) 唤起全局命令面板来搜索和切换工具。'
    },
    sidebar: {
      title: '展开/折叠侧边栏',
      description: '点击这里可以展开或折叠工具列表，方便给你留出更多操作空间。'
    },
    tools: {
      title: '工具列表',
      description: '这里列出了所有可用的开发者工具，点击即可切换体验。'
    },
    settings: {
      title: '系统设置',
      description: '您可以在这里通过底部栏切换应用的显示语言 (中/英) 或配置亮暗主题。'
    }
  },

  // 首页
  home: {
    title: '选择您需要的工具',
    subtitle: '提升开发效率的实用工具集合',
    recentTools: '最近使用',
    allTools: '所有工具'
  },

  // 工具模块
  tools: {
    // 文本对比
    diff: {
      name: '文本对比',
      mode: '对比方式',
      description: '比较两个文本之间的差异',
      leftPanel: '左侧文本',
      rightPanel: '右侧文本',
      sideBySide: '并排对比',
      inline: '内联对比',
      ignoreWhitespace: '忽略空白',
      wordWrap: '自动换行',
      darkTheme: '深色主题',
      lightTheme: '浅色主题',
      theme: '主题',
      showLineNumbers: '显示行号',
      previousDiff: '上一个差异',
      nextDiff: '下一个差异',
      swapContent: '交换内容',
      pasteLeft: '粘贴到左侧',
      pasteRight: '粘贴到右侧',
      copyLeft: '复制左侧',
      copyRight: '复制右侧',
      clearAll: '清空全部',
      putLeft: '左对比',
      putRight: '右对比',
      unicodeDecode: '\\u转中文',
      format: '格式化 (JSON / XML / SQL)',
      formatLeft: '格式化左侧',
      formatRight: '格式化右侧',
      formatBoth: '两侧格式化',
      ignoreCase: '忽略大小写',
      ignoreCaseDescription: '对比时忽略英文字母大小写',
      trimTrailing: '去除行尾空格',
      trimTrailingDescription: '对比前裁剪每行末尾空白字符',
      ignoreKeyOrder: '忽略键顺序',
      ignoreKeyOrderDescription: '两侧均为合法 JSON 时，递归排序对象键后再对比',
      ignoreKeyOrderDisabledTip: '仅当左右两侧都是合法 JSON 时可开启',
      diffNavigation: '差异导航',
      diffPosition: '{current} / {total}',
      diffHunks: '{n} 处差异',
      contentIdentical: '两侧内容一致',
      similarity: '相似度 {n}%',
      statsLeftLines: '左 {n} 行',
      statsRightLines: '右 {n} 行',
      statsAdded: '+{n}',
      statsRemoved: '−{n}',
      statsHunks: '{n} 块',
      toggleMinimap: '小地图',
      moreOptions: '更多选项',
      formatFailed: '格式化失败',
      helpIntro: '并排或内联对比两段文本；可用选项忽略空白、大小写或 JSON 键顺序差异。',
      sideBySideDescription: '左右分栏，各自滚动，差异在行间对齐高亮。',
      inlineDescription: '单栏内联，删除与新增在同一视图里展示。',
      ignoreWhitespaceDescription: '忽略行首行尾空白（Monaco 内置规则）。',
      unicodeDecodeDesc: '开启后把 \\uXXXX 序列解码为 Unicode 字符显示；再次关闭时未改动的侧会还原为原文。',
      diffNavShortcut: 'F7 下一处，Shift+F7 上一处'
    },

    // Base64 编解码
    base64: {
      binaryInput: '二进制文件：{name}（{size}）— 将按原始字节编码',
      binaryOutput: '二进制数据（{size}），不是合法的 UTF-8 文本，请点击下载按钮保存为文件',
      fileTooLarge: '文件过大（上限 {size}）',
      readFileFailed: '读取文件失败',
      name: 'Base64 编解码',
      description: 'Base64 编码和解码工具',
      inputPanel: '输入',
      resultPanel: '结果',
      overflowMenu: '更多',
      processError: '处理失败',
      statusReady: '就绪',
      statusBinary: '二进制输出',
      inputSize: '{n} 字符',
      outputSize: '{n} 字符',
      coreFeatures: '核心功能',
      featureEncode: '将文本或二进制文件编码为 Base64',
      featureDecode: '将 Base64 解码为文本；非 UTF-8 时保留原始字节供下载',
      featureUrlSafe: 'URL 安全变体（+ / 替换为 - _，可去掉填充 =）',
      featureFile: '支持导入文件；编码模式下二进制按原始字节处理',
      wordWrap: '自动换行',
      urlSafeTip: '使用 URL 安全的 Base64 字母表',
      help: {
        features: {
          urlSafe: 'URL安全'
        }
      }
    },

    // JSON 工具
    json: {
      name: 'JSON 工具',
      description: 'JSON 格式化、压缩、转义和去转义',
      downloadJson: '下载JSON',
      coreFeatures: '核心功能',
      formatDescription: '美化JSON格式',
      minifyDescription: '压缩JSON大小',
      treeViewDescription: '树状结构显示',
      escape: '转义',
      unescape: '反转义',
      escapeDescription: '转义 JSON 字符串中的特殊字符。',
      unescapeDescription: '还原 JSON 字符串中的特殊字符。',
      decodeUnicode: 'Unicode 解码（\\u 转中文）',
      unicodeDecode: '\\u转中文',
      unicodeDecodeDesc: '点击开启：把 JSON 字符串值里的 \\uXXXX 解码成中文；再次点击关闭',
      expandNested: '展开嵌套',
      expandNestedDesc: '点击开启：递归把字符串值里的嵌套 JSON 解析成对象/数组；再次点击关闭并还原',
      expandAll: '展开全部',
      collapseAll: '折叠全部',
      viewTooLarge: '内容过大，此视图已停用，请使用左侧编辑器查看',
      bigIntWarning: '输入中含有超出安全范围（2^53）的整数且不是严格 JSON，格式化可能丢失精度。请使用严格 JSON 以保留完整精度。',
      keepEdited: '开启开关后内容已被修改，已保留当前内容，未还原为原文',
      sortKeys: '键排序',
      sortKeysDesc: '递归按字典序排序所有对象键',
      lenientFix: '宽松修复',
      lenientFixDesc: '容忍注释、单引号、无引号键、尾逗号（JSON5）',
      jsonPathPlaceholder: 'JSONPath，例如 $.files[0].name 或 $..name',
      jsonPathMatches: '{n} 个结果',
      jsonPathNoMatch: '无匹配',
      jsonPathDesc: 'JSONPath 查询：右侧结果区实时过滤文本/树/表格视图',
      pathCopied: '已复制路径 {path}',
      copyTypescript: '复制为 TypeScript 类型',
      copyTypescriptDone: '已复制 TypeScript 类型',
      copyResult: '复制结果',
      viewText: '文本',
      viewTable: '表格',
      tableEmpty: '没有可表格化的对象数组',
      tableEmptyHint: '试试 JSONPath 查询，例如 $.files',
      validJson: '有效 JSON',
      invalidAt: '第 {line} 行 第 {col} 列：{msg}',
      topLevelObject: '对象 · {n} 个顶层键',
      topLevelArray: '数组 · {n} 项',
      scalarType: '标量',
      depth: '深度 {n}',
      cursor: '行 {line}，列 {col}',
      encoding: 'UTF-8',
      indentTab: 'Tab',
      minimap: '小地图',
      menuImport: '文件',
      menuDiff: '对比'
    },

    // URL 编解码
    url: {
      name: 'URL 编解码',
      description: 'URL 编码和解码工具',
      encodeMode: '编码模式',
      decodeMode: '解码模式',
      encodeModeDescription: '编码URL参数值',
      decodeModeDescription: '自动识别并解码URL编码的字符',
      inputPanel: '输入',
      resultPanel: '结果',
      overflowMenu: '更多',
      modeLabel: '范围',
      modeComponent: '组件 (encodeURIComponent)',
      modeUri: '完整 URI (encodeURI)',
      modeComponentShort: 'Component',
      modeUriShort: 'URI',
      processError: '解码失败',
      statusReady: '就绪',
      inputSize: '{n} 字符',
      outputSize: '{n} 字符',
      coreFeatures: '核心功能',
      helpEncodeComponent: 'encodeURIComponent：编码查询参数值、空格与 Unicode 等字符',
      helpEncodeUri: 'encodeURI：编码完整 URL，保留 : / ? # [ ] @ 等 URI 结构字符',
      helpDecode: '解码模式自动匹配对应的 decodeURIComponent / decodeURI',
      wordWrap: '自动换行',
    },

    // 时间戳转换
    timestamp: {
      name: '时间戳转换',
      description: '智能时间戳转换工具，支持多种输入格式与时区展示。',
      actions: {
        pasteAndParse: '粘贴并解析',
        setCurrentTime: '设为当前时间'
      },
      liveClock: '跟随当前时间',
      liveClockDesc: '每秒刷新相对时间与当前时刻相关结果，不修改输入框',
      helpFormatsTitle: '支持的输入格式',
      helpTimestamp: 'Unix 时间戳：10 位（秒）或 13 位（毫秒）',
      helpDateString: '日期字符串：2023-01-01、YYYYMMDD（严格校验）',
      helpIso: 'ISO 8601：2023-01-01T00:00:00Z',
      helpNatural: '自然语言：now、today、tomorrow 等',
      emptyHint: '输入有效时间后将显示各格式结果',
      statusReady: '等待输入',
      statusValid: '时间有效',
      statusStale: '当前结果为上一次有效解析',
      result: {
        title: '转换结果',
        localTime: '本地时间 ({offset})',
        localDate: '本地日期',
        timestampSec: '时间戳 (秒)',
        timestampMs: '时间戳 (毫秒)',
        utcTime: 'UTC 时间 (ISO 8601)',
        relativeTime: '相对时间',
        rfc2822: 'RFC 2822',
        tzLocal: '本地时区',
        tzUtc: 'UTC',
        tzNewYork: '纽约',
        tzLondon: '伦敦',
        tzTokyo: '东京',
        tzShanghai: '上海'
      }
    },

    // UUID 生成器
    uuid: {
      name: 'UUID 生成器',
      description: '生成全局唯一标识符',
      coreFeatures: '核心功能',
      uuidv4: 'UUID v4',
      uuidv4Description: '随机生成的全局唯一标识符',
      format: '格式',
      formatDescription: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
      infoPanel: '说明',
      resultPanel: '结果',
      hintGenerate: '点击「生成 UUID」获取新的密码学安全随机值。',
      statusEmpty: '点击生成按钮创建 UUID'
    },

    // 文本分析
    textAnalyzer: {
      name: '字符统计工具',
      description: '文本字符统计分析',
      coreFeatures: '核心功能',
      inputPanel: '输入',
      statsPanel: '统计',
      overflowMenu: '更多',
      statusSummary: '{chars} 字符 · {words} 词 · {lines} 行',
      statusEmpty: '输入文本以开始统计',
      stats: {
        charsWithSpaces: '字符数 (含空格)',
        charsWithoutSpaces: '字符数 (不含空格)',
        words: '字数',
        lines: '行数',
        paragraphs: '段落数',
        charsWithSpacesDesc: '统计文本中包含空格的字符数',
        charsWithoutSpacesDesc: '统计文本中不包含空格的字符数',
        wordsDesc: '统计文本中的单词数',
        linesDesc: '统计文本中的行数',
        paragraphsDesc: '统计文本中的段落数'
      }
    },

    // 哈希生成器
    hash: {
      name: '哈希生成器',
      description: '生成文本的 MD5、SHA 等哈希值',
      result: '哈希结果',
      coreFeatures: '核心功能',
      inputPanel: '输入',
      resultPanel: '哈希结果',
      overflowMenu: '更多',
      statusChars: '{n} 字符',
      statusEmpty: '输入文本以计算哈希',
      md5Description: '128位哈希值',
      sha1Description: '160位安全哈希',
      sha256Description: '256位安全哈希',
      sha512Description: '512位高安全哈希'
    },

    // SQL 格式化
    sql: {
      name: 'SQL 格式化',
      description: 'SQL 语句格式化和美化',
      database: '数据库',
      wordWrap: '自动换行',
      importFile: '导入文件',
      downloadSql: '下载 SQL',
      indent2: '2 空格',
      indent3: '3 空格',
      indent4: '4 空格',
      indentTab: 'Tab',
      indentLabel: '缩进',
      coreFeatures: '核心功能',
      formatDescription: '按当前方言与选项美化 SQL，结果显示在右侧面板。',
      minifyDescription: '词法感知地压缩 SQL，保留字符串内容。',
      escapeDescription: '按方言规则转义引号与特殊字符。',
      unescapeDescription: '反转义为可执行 SQL 文本。',
      escape: '转义',
      unescape: '去转义',
      unicode: 'Unicode 解码',
      unicodeDesc: '对结果解码 \\uXXXX 等 Unicode 转义',
      dialect: '方言',
      dialects: {
        mysql: 'MySQL',
        postgresql: 'PostgreSQL',
        sqlite: 'SQLite',
        sqlserver: 'SQL Server',
        oracle: 'Oracle',
        standard: '标准 SQL',
      },
      keywordCase: '关键字',
      keywordUpper: '大写',
      keywordLower: '小写',
      keywordPreserve: '保持',
      inputPanel: '输入',
      resultPanel: '结果',
      resultFormat: '格式化结果',
      resultMinify: '压缩结果',
      resultEscape: '转义结果',
      resultUnescape: '去转义结果',
      statsLinesChars: '{lines} 行 · {chars} 字符',
      copyAs: '复制为…',
      copyAsHeader: '复制为代码',
      copyTargets: {
        sql: '纯 SQL',
        javascript: 'JavaScript 模板字符串',
        java: 'Java 文本块',
        go: 'Go 原始字符串',
        python: 'Python 三引号',
        php: 'PHP Heredoc',
        json: 'JSON 字符串',
        escaped: '单行转义字符串',
      },
      copiedAs: '已复制为 {format}',
      structureOk: '语法结构正常',
      structureParen: '括号不匹配（约第 {line} 行）',
      structureBracket: '方括号不匹配（约第 {line} 行）',
      structureString: '引号未闭合（约第 {line} 行）',
      statementCount: '{n} 条语句',
      tableJoinStats: '{tables} 张表 · {joins} 个 JOIN',
      formatFailed: '格式化失败',
      overflowMenu: '更多',
      copyOutput: '复制结果',
      minimap: '小地图',
    },

    // 密码生成器
    password: {
      name: '密码生成器',
      description: '生成安全密码',
      passwordType: '密码类型',
      typeShort: {
        strong: '强',
        readable: '易读',
        pin: 'PIN',
        memorable: '词组'
      },
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
      copyPassword: '复制密码',
      strengthAnalysis: '密码强度分析',
      strengthLevel: '强度等级',
      charsetSize: '字符集大小',
      securityAdvice: '安全建议',
      entropy: '熵值',
      emptyCharsetError: '请至少选择一种字符类型（大写/小写/数字/符号）',
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
      strength: {
        weak: '弱',
        medium: '中等',
        strong: '强',
        veryStrong: '很强'
      },
      crackTimeDesc: '估计破解时间',
      crackTime: {
        lessThanMinute: '少于1分钟',
        minutes: '分钟',
        hours: '小时',
        days: '天',
        years: '年',
        centuries: '世纪'
      },
      advice: {
        length: '使用12位以上的密码以确保安全性',
        unique: '不要在多个账户使用相同密码',
        regular: '定期更换重要账户的密码',
        manager: '使用密码管理器存储密码',
        twoFactor: '启用双因素认证增强安全性'
      },
      configPanel: '配置',
      emptyResult: '暂无结果，点击生成',
      bitsUnit: 'bits',
      statusEmpty: '等待生成',
      statusEntropy: '熵值 {n} bits'
    },

    // 进制转换
    numberConverter: {
      name: '进制转换',
      description: '二进制、八进制、十进制、十六进制相互转换',
      decimal: '十进制',
      hex: '十六进制',
      binary: '二进制',
      octal: '八进制',
      twosComplement: '补码',
      twosHelp: '以当前十进制值计算指定位宽的补码表示；超范围会在状态栏提示。',
      twosEmpty: '输入有效整数后显示补码',
      invalidInput: '输入无效：包含当前进制不允许的字符（仅支持整数）',
      overflow: '数值超出所选位宽，已按位宽截断',
      statusReady: '等待输入',
      statusOk: '数值有效'
    },

    // HTTP 状态码
    httpStatus: {
      name: 'HTTP 状态码',
      description: '查询 HTTP 状态码含义',
      searchPlaceholder: '搜索状态码、名称或描述…',
      filterAll: '全部',
      resultCount: '共 {n} 项',
      codes: [
        // 1xx Informational
        { code: 100, title: 'Continue', description: '服务器已接收请求头，客户端应继续发送请求体。', category: '信息' },
        { code: 101, title: 'Switching Protocols', description: '请求者已要求服务器切换协议，服务器已确认并准备切换。', category: '信息' },

        // 2xx Success
        { code: 200, title: 'OK', description: '请求成功。', category: '成功' },
        { code: 201, title: 'Created', description: '请求已实现，并创建了新资源。', category: '成功' },
        { code: 202, title: 'Accepted', description: '请求已接受处理，但尚未完成。', category: '成功' },
        { code: 204, title: 'No Content', description: '服务器成功处理了请求，但没有返回任何内容。', category: '成功' },

        // 3xx Redirection
        { code: 301, title: 'Moved Permanently', description: '请求的页面已永久移动到新位置。', category: '重定向' },
        { code: 302, title: 'Found', description: '请求的页面已临时移动到新位置。', category: '重定向' },
        { code: 304, title: 'Not Modified', description: '自上次请求以来，请求的资源未被修改。', category: '重定向' },

        // 4xx Client Error
        { code: 400, title: 'Bad Request', description: '服务器无法理解请求的语法。', category: '客户端错误' },
        { code: 401, title: 'Unauthorized', description: '请求要求身份验证。', category: '客户端错误' },
        { code: 403, title: 'Forbidden', description: '服务器拒绝请求。', category: '客户端错误' },
        { code: 404, title: 'Not Found', description: '服务器找不到请求的网页。', category: '客户端错误' },
        { code: 405, title: 'Method Not Allowed', description: '请求中指定的方法不被允许。', category: '客户端错误' },
        { code: 429, title: 'Too Many Requests', description: '用户在给定的时间内发送了太多请求。', category: '客户端错误' },

        // 5xx Server Error
        { code: 500, title: 'Internal Server Error', description: '服务器遇到错误，无法完成请求。', category: '服务器错误' },
        { code: 502, title: 'Bad Gateway', description: '服务器作为网关或代理，从上游服务器收到无效响应。', category: '服务器错误' },
        { code: 503, title: 'Service Unavailable', description: '服务器目前无法使用（由于超载或停机维护）。', category: '服务器错误' },
        { code: 504, title: 'Gateway Timeout', description: '服务器作为网关或代理，未及时从上游服务器接收请求。', category: '服务器错误' },
      ]
    },

    // User Agent 解析
    userAgent: {
      name: 'User Agent 解析',
      description: '解析 User Agent 字符串',
      browser: '浏览器',
      os: '操作系统',
      device: '设备',
      useMyUa: '使用本机 UA',
      placeholder: '在此粘贴 User Agent 字符串...',
      desktop: '桌面',
      statusEmpty: '输入 UA 以查看解析结果',
      statusLength: '{n} 字符',
      fields: {
        name: '名称',
        version: '版本',
        engine: '引擎',
        platform: '架构',
        vendor: '厂商',
        model: '型号',
        type: '类型'
      }
    },

    // 正则测试
    regexTester: {
      name: '正则测试',
      description: '正则表达式测试工具',
      regex: '正则表达式',
      testString: '测试文本',
      timeout: '正则执行超过 {ms}ms 已被中止（可能存在灾难性回溯），请简化表达式',
      truncated: '匹配数量过多，仅显示前 5000 条',
      matches: '匹配结果',
      coreFeatures: '核心功能',
      patternPlaceholder: '输入模式…',
      replaceWith: '替换为',
      replaceResult: '替换结果',
      templates: '常用模板',
      templateEmail: '电子邮件',
      templateUrl: 'HTTP(S) URL',
      templateIpv4: 'IPv4 地址',
      templateHex: '十六进制',
      templateDigits: '纯数字',
      templateChinese: '中文字符',
      matchN: '匹配 {n}',
      matchIndex: '索引 {n}',
      groupN: '分组 {n}',
      statusMatches: '{n} 处匹配',
      statusEmpty: '输入正则与文本开始测试',
      staleHint: '显示上次有效结果',
      unknownError: '正则执行失败',
      helpFlags: '工具栏 chip 可开关 g / i / m / s / u 标志',
      helpWorker: '匹配在 Worker 中执行并防抖，超时自动中止',
      helpReplace: '底部可输入替换文本并实时预览替换结果',
      flags: {
        g: '全局 (g)',
        i: '忽略大小写 (i)',
        m: '多行 (m)',
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

    // 二维码生成
    qrCode: {
      name: '二维码生成',
      description: '生成自定义二维码',
      placeholder: '输入文本或链接...',
      options: '选项',
      inputPanel: '内容与选项',
      previewPanel: '预览',
      previewAlt: '二维码预览',
      errorCorrection: '纠错级别',
      sizePx: '尺寸 (px)',
      margin: '边距',
      colorDark: '前景色',
      colorLight: '背景色',
      statusReady: '二维码已生成',
      statusEmpty: '输入内容以生成二维码',
      statusSize: '{n}px',
      ecLevels: {
        L: '低 (7%)',
        M: '中 (15%)',
        Q: '较高 (25%)',
        H: '高 (30%)'
      }
    },

    // Markdown 预览
    markdown: {
      name: 'Markdown 预览',
      description: 'Markdown 编辑与实时预览，支持目录导航与文内 Mermaid 图表。',
      copyHtml: '复制 HTML',
      editorPanel: 'Markdown',
      previewPanel: '预览',
      viewEdit: '编辑',
      viewSplit: '分栏',
      viewPreview: '预览',
      toc: '目录',
      outline: '大纲',
      tocEmpty: '无标题',
      coreFeatures: '核心功能',
      featureLivePreview: 'Monaco 编辑与防抖实时预览',
      featureToc: '可折叠目录侧栏，点击跳转标题',
      featureMermaid: '支持 ```mermaid 代码块渲染',
      featureSanitize: 'DOMPurify 清洗输出，降低 XSS 风险',
      featureScrollSync: '编辑器与预览滚动同步',
      wordCount: '{n} 字',
      lineCount: '{n} 行',
      renderMs: '渲染 {n} ms',
      previewReady: '预览就绪',
      scrollSync: '滚动同步',
      placeholder: '# Hello World',
      overflowMenu: '更多',
    },

    // Unicode 转换器
    unicodeConverter: {
      name: 'Unicode 转换器',
      description: 'Unicode 编码与文本互转',
      textToUnicode: '文本转 Unicode',
      unicodeToText: 'Unicode 转文本',
      textToUnicodeDesc: '将文本转换为 Unicode 编码格式 (\\uXXXX)',
      unicodeToTextDesc: '将 Unicode 编码转换为可读文本',
      inputPlaceholder: '输入文本或 Unicode 编码...',
      outputPlaceholder: '转换结果将显示在这里...',
      swap: '交换输入输出',
      onlyNonAscii: '仅转换非 ASCII',
      features: '功能特性',
      statusReady: '等待输入',
      statusInput: '输入 {n} 字符',
      statusOutput: '输出 {n} 字符'
    },

    // Mermaid 图表
    mermaid: {
      name: 'Mermaid 图表',
      description: 'Mermaid 代码编辑与实时预览，支持导出 PNG/SVG 与画布缩放平移。',
      downloadPng: '下载 PNG',
      pngFailed: 'PNG 导出失败，可尝试下载 SVG',
      downloadSvg: '下载 SVG',
      helpDrag: '拖动鼠标可平移图表',
      helpZoom: '滚轮可缩放图表',
      editorPanel: 'Mermaid 代码',
      previewPanel: '预览',
      viewEdit: '编辑',
      viewSplit: '分栏',
      viewPreview: '预览',
      fullscreen: '全屏预览',
      exitFullscreen: '退出全屏',
      zoomIn: '放大',
      zoomOut: '缩小',
      zoomReset: '适配画布',
      zoomPercent: '{n}%',
      renderOk: '渲染成功',
      renderPending: '正在渲染…',
      renderErrorLabel: '语法错误',
      lineCount: '{n} 行',
      renderMs: '渲染 {n} ms',
      coreFeatures: '核心功能',
      overflowMenu: '更多',
      theme: '主题',
      look: '外观',
      curve: '曲线',
      themes: {
        default: '默认',
        dark: '深色',
        forest: '森林',
        neutral: '中性',
        base: '基础',
        github: 'GitHub',
        dracula: 'Dracula',
        nord: 'Nord',
      },
      looks: {
        classic: '经典',
        handDrawn: '手绘'
      },
      curves: {
        linear: '直线',
        basis: '平滑',
        cardinal: '基数',
        step: '阶梯',
        stepBefore: '先垂直阶梯',
        stepAfter: '先水平阶梯',
        natural: '自然样条',
        monotoneX: '单调曲线'
      },
      backgrounds: {
        white: '白色',
        transparent: '透明'
      },
      background: '背景'
    }
  },

  // 工具分类
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
    toggle: '切换主题'
  },

  // 错误消息
  errors: {
    invalidTimestamp: '无法识别的日期格式',
    noResults: '没有找到结果',
    tryAdjustKeywords: '尝试调整搜索关键词',
    pasteFailed: '粘贴失败'
  }
}
