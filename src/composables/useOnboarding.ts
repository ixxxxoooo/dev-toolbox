import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useI18n } from 'vue-i18n';

export function useOnboarding() {
  const { t } = useI18n();

  const startOnboarding = () => {
    // vue-i18n can return the key as a fallback if the translation doesn't exist yet or is loading.
    // Adding a ternary or checking if the return value is the same as the key ensures our default Chinese fallback works.
    const _t = (key: string, fallback: string) => {
      const trans = t(key);
      return trans === key ? fallback : trans;
    };

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: _t('onboarding.buttons.done', '完成'),
      nextBtnText: _t('onboarding.buttons.next', '下一步'),
      prevBtnText: _t('onboarding.buttons.prev', '上一步'),
      steps: [
        {
          popover: {
            title: _t('onboarding.welcome.title', '欢迎体验!'),
            description: _t('onboarding.welcome.description', '欢迎使用 Dev Toolbox！你可以随时使用 <b>Cmd + K</b> (Mac) 或 <b>Ctrl + K</b> (Windows) 唤起全局命令面板来搜索和切换工具。'),
            side: "top",
            align: 'center'
          }
        },
        {
          element: '#tour-sidebar-toggle',
          popover: {
            title: _t('onboarding.sidebar.title', '展开/折叠侧边栏'),
            description: _t('onboarding.sidebar.description', '点击这里可以展开或折叠工具列表，方便给你留出更多操作空间。'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-tools-list',
          popover: {
            title: _t('onboarding.tools.title', '工具列表'),
            description: _t('onboarding.tools.description', '这里列出了所有可用的开发者工具，点击即可切换体验。'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-settings-panel',
          popover: {
            title: _t('onboarding.settings.title', '系统设置'),
            description: _t('onboarding.settings.description', '您可以在这里通过底部栏切换应用的显示语言 (中/英) 或配置亮暗主题。'),
            side: "top",
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  return {
    startOnboarding
  };
}
