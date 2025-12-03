import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/json',
    children: [
      {
        path: 'json',
        name: 'Json',
        component: () => import('../views/Json.vue'),
        meta: { title: 'tools.json.name', icon: 'Braces' },
      },
      {
        path: 'diff',
        name: 'Diff',
        component: () => import('../views/Diff.vue'),
        meta: { title: 'tools.diff.name', icon: 'GitCompare' },
      },
      {
        path: 'sql-formatter',
        name: 'SqlFormatter',
        component: () => import('../views/SqlFormatter.vue'),
        meta: { title: 'tools.sql.name', icon: 'Database' },
      },
      {
        path: 'timestamp',
        name: 'Timestamp',
        component: () => import('../views/Timestamp.vue'),
        meta: { title: 'tools.timestamp.name', icon: 'Clock' },
      },
      {
        path: 'url',
        name: 'Url',
        component: () => import('../views/Url.vue'),
        meta: { title: 'tools.url.name', icon: 'Link' },
      },
      {
        path: 'base64',
        name: 'Base64',
        component: () => import('../views/Base64.vue'),
        meta: { title: 'tools.base64.name', icon: 'Binary' },
      },
      {
        path: 'uuid',
        name: 'UuidGenerator',
        component: () => import('../views/UuidGenerator.vue'),
        meta: { title: 'tools.uuid.name', icon: 'Fingerprint' },
      },
      {
        path: 'text-analyzer',
        name: 'TextAnalyzer',
        component: () => import('../views/TextAnalyzer.vue'),
        meta: { title: 'tools.textAnalyzer.name', icon: 'FileText' },
      },
      {
        path: 'hash-generator',
        name: 'HashGenerator',
        component: () => import('../views/HashGenerator.vue'),
        meta: { title: 'tools.hash.name', icon: 'Hash' },
      },
      {
        path: 'password-generator',
        name: 'PasswordGenerator',
        component: () => import('../views/PasswordGenerator.vue'),
        meta: { title: 'tools.password.name', icon: 'Key' },
      },
      {
        path: 'number-converter',
        name: 'NumberConverter',
        component: () => import('../views/NumberConverter.vue'),
        meta: { title: 'tools.numberConverter.name', icon: 'Calculator' },
      },
      {
        path: 'http-status',
        name: 'HttpStatus',
        component: () => import('../views/HttpStatus.vue'),
        meta: { title: 'tools.httpStatus.name', icon: 'Globe' },
      },
      {
        path: 'user-agent',
        name: 'UserAgent',
        component: () => import('../views/UserAgent.vue'),
        meta: { title: 'tools.userAgent.name', icon: 'Monitor' },
      },
      {
        path: 'regex-tester',
        name: 'RegexTester',
        component: () => import('../views/RegexTester.vue'),
        meta: { title: 'tools.regexTester.name', icon: 'Regex' },
      },
      {
        path: 'qr-code',
        name: 'QrCode',
        component: () => import('../views/QrCode.vue'),
        meta: { title: 'tools.qrCode.name', icon: 'QrCode' },
      },
      {
        path: 'markdown',
        name: 'Markdown',
        component: () => import('../views/Markdown.vue'),
        meta: { title: 'tools.markdown.name', icon: 'FileCode' },
      },
      {
        path: 'image-tools',
        name: 'ImageTools',
        component: () => import('../views/ImageTools.vue'),
        meta: { title: 'tools.imageTools.name', icon: 'Image' },
      },
      {
        path: 'watermark-remover',
        name: 'WatermarkRemover',
        component: () => import('../views/WatermarkRemover.vue'),
        meta: { title: 'tools.watermark.name', icon: 'Eraser' },
      },
      {
        path: 'unicode-converter',
        name: 'UnicodeConverter',
        component: () => import('../views/UnicodeConverter.vue'),
        meta: { title: 'tools.unicodeConverter.name', icon: 'Languages' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
