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
      regenerate: '重新生成'
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
      description: 'Base64 编码和解码工具'
    },

    // JSON 工具
    json: {
      name: 'JSON 工具',
      description: 'JSON 格式化、压缩和转换',
      downloadJson: '下载JSON',
      from: '从',
      to: '到',
      coreFeatures: '核心功能',
      formatDescription: '美化JSON格式',
      minifyDescription: '压缩JSON大小',
      convertDescription: 'JSON/YAML/XML转换',
      treeViewDescription: '树状结构显示',
      escape: '转义',
      unescape: '去转义'
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
      unescape: '去转义'
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
