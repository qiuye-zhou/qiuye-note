import { defaultTheme, defineUserConfig } from 'vuepress'
import { getDirname, path } from '@vuepress/utils'
import { sidebars } from './config/sidebar'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  lang: 'zh-CN',
  title: "秋叶 Notebook",
  description: '我的全部学习笔记，涉及计算机基础、各种语言、规范、数据库，不过完全就是随缘写的。',
  head: [
    ['link', { rel: 'icon', href: '/qiuye.jpg' }],
  ],
  theme: defaultTheme({
    // 默认主题配置
    home: '/',
    logo: '/qiuye.jpg',
    navbar: [
        {
            text: 'Github',
            link: 'https://github.com/qiuye-zhou',
            icon: '/navbaricon/github.png',
        },
        {
          text: 'Leetcode',
          link: 'https://leetcode.cn/u/qiu-xie-4ds/',
          icon: '/navbaricon/leetcode.png',
      },
    ],
    sidebar: {
        // SidebarItem
        '/Vue/': sidebars,
      },
  }),
  alias: {
    '@theme/NavbarItems.vue': path.resolve(__dirname, './components/MyNavbarItems.vue'),
  },
})