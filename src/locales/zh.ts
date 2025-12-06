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
    save: '保存',
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
      regenerate: '重新生成',
      process: '处理'
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
      indent: '缩进',
      spaces2: '2空格',
      spaces4: '4空格'
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
      invalidJson: '无效的JSON，无法生成树状视图',
      cannotReadClipboard: '无法读取剪贴板',
      formatFailed: '格式化失败',
      minifyFailed: '压缩失败',
      unrecognizedDateFormat: '无法识别的日期格式',
      copied: '已复制到剪贴板',
      pasted: '已从剪贴板粘贴'
    }
  },

  // 导航
  nav: {
    tools: '工具菜单',
    language: '语言切换'
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
      sideBySideDescription: '左右对比模式',
      inlineDescription: '内联对比模式',
      ignoreWhitespaceDescription: '忽略空白字符'
    },

    // Base64 编解码
    base64: {
      name: 'Base64 编解码',
      description: 'Base64 编码和解码工具',
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
      escapeDescription: '转义 SQL 字符串中的特殊字符。',
      unescapeDescription: '还原 SQL 字符串中的特殊字符。',
      expandAll: '展开全部',
      collapseAll: '折叠全部'
    },

    // URL 编解码
    url: {
      name: 'URL 编解码',
      description: 'URL 编码和解码工具',
      encodeMode: '编码模式',
      decodeMode: '解码模式',
      encodeModeDescription: '编码URL参数值',
      decodeModeDescription: '自动识别并解码URL编码的字符'
    },

    // 时间戳转换
    timestamp: {
      name: '时间戳转换',
      description: '智能时间戳转换工具',
      actions: {
        pasteAndParse: '粘贴并解析',
        setCurrentTime: '设为当前时间'
      },
      result: {
        title: '转换结果',
        localTime: '本地时间 (UTC+8)',
        localDate: '本地日期',
        timestampSec: '时间戳 (秒)',
        timestampMs: '时间戳 (毫秒)',
        utcTime: 'UTC 时间 (ISO 8601)',
        relativeTime: '相对时间',
        rfc2822: 'RFC 2822'
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
      formatDescription: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    },

    // 文本分析
    textAnalyzer: {
      name: '字符统计工具',
      description: '文本字符统计分析',
      coreFeatures: '核心功能',
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
      downloadSql: '下载SQL',
      indent2: '2空格',
      indent3: '3空格',
      indent4: '4空格',
      coreFeatures: '核心功能',
      formatDescription: '美化SQL语句',
      minifyDescription: '压缩SQL语句',
      escapeDescription: '转义特殊字符',
      unescapeDescription: '去转义特殊字符',
      escape: '转义',
      unescape: '去转义',
      unicode: 'Unicode 转中文'
    },

    // 密码生成器
    password: {
      name: '密码生成器',
      description: '生成安全密码',
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
      copyPassword: '复制密码',
      strengthAnalysis: '密码强度分析',
      strengthLevel: '强度等级',
      charsetSize: '字符集大小',
      securityAdvice: '安全建议',
      entropy: '熵值',
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
      }
    },

    // 进制转换
    numberConverter: {
      name: '进制转换',
      description: '二进制、八进制、十进制、十六进制相互转换',
      decimal: '十进制',
      hex: '十六进制',
      binary: '二进制',
      octal: '八进制'
    },

    // HTTP 状态码
    httpStatus: {
      name: 'HTTP 状态码',
      description: '查询 HTTP 状态码含义',
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
      placeholder: '在此粘贴 User Agent 字符串...'
    },

    // 正则测试
    regexTester: {
      name: '正则测试',
      description: '正则表达式测试工具',
      regex: '正则表达式',
      testString: '测试文本',
      matches: '匹配结果'
    },

    // 二维码生成
    qrCode: {
      name: '二维码生成',
      description: '生成自定义二维码',
      placeholder: '输入文本或链接...',
      options: '选项'
    },

    // Markdown 预览
    markdown: {
      name: 'Markdown 预览',
      description: 'Markdown 编辑与实时预览',
      copyHtml: '复制 HTML'
    },

    // 图片工具
    imageTools: {
      name: '图片工具',
      description: '图片压缩与裁剪',
      compress: '压缩',
      crop: '裁剪',
      resize: '调整大小',
      rotate: '旋转/翻转',
      convert: '格式转换',
      base64: 'Base64',
      dropText: '拖拽图片到此处',
      supportText: '支持 JPG, PNG, WebP',
      quality: '质量',
      width: '宽度',
      height: '高度',
      maintainAspectRatio: '保持纵横比',
      rotateLeft: '向左旋转',
      rotateRight: '向右旋转',
      flipHorizontal: '水平翻转',
      flipVertical: '垂直翻转',
      adjustQuality: '调整质量以减小文件大小',
      dragToCrop: '拖动以裁剪。点击应用以保存更改。',
      base64Help: '当前图片的 Base64 表示',
      helpTitle: '图片工具帮助',
      helpContent: {
        intro: '一套全面的图片处理工具：',
        compress: '压缩：在保持质量的同时减小文件大小。',
        crop: '裁剪：裁剪掉不需要的外部区域。',
        resize: '调整大小：更改图片尺寸。',
        rotate: '旋转/翻转：调整图片方向。',
        convert: '转换：在 PNG、JPEG 和 WEBP 格式之间切换。',
        base64: 'Base64：获取用于嵌入的 Base64 字符串。'
      }
    },

    // 水印工具
    watermark: {
      name: '水印工具',
      description: '添加或移除图片/视频水印',
      remove: '去除水印',
      add: '添加水印',
      mode: '模式',
      removeMode: '去除模式',
      addMode: '添加模式',
      text: '文字水印',
      imageType: '图片',
      video: '视频',
      content: '内容',
      color: '颜色',
      size: '大小',
      opacity: '透明度',
      position: '位置',
      x: 'X坐标',
      y: 'Y坐标',
      dropImage: '拖拽或点击上传图片',
      dropVideo: '拖拽或点击上传视频',
      supportImage: '支持 JPG, PNG, WebP',
      supportVideo: '支持 MP4, WebM',
      brushSize: '画笔大小',
      paintInstruction: '在水印区域涂抹标记',
      videoInstruction: '拖动选择框标记水印区域',
      help: '这是一个强大的水印处理工具。在"去除模式"下，可以通过涂抹(图片)或选择框(视频)标记水印区域并移除。在"添加模式"下，可以添加文字水印到图片或视频上。'
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
      features: '功能特性'
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
