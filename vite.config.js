import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { compression } from 'vite-plugin-compression2'

// 开发态预扫描全部业务源码入口，尽量在冷启动阶段就发现懒路由里的第三方依赖。
const optimizeDepEntries = [
  'index.html',
  'src/main.js',
  'src/**/*.js',
  'src/**/*.vue',
  '!dist/**',
  '!types/**'
]
// 显式预构建插件动态注入的深层依赖，避免首次访问新页面时才触发依赖重优化并整页刷新。
const optimizeDepIncludes = [
  'element-plus/es/components/**',
  'element-plus/es/components/**/style/css'
]
// 自动组件扫描时，排除仅供容器组件内部手动引用的私有子组件目录。
const componentGlobs = [
  'src/components/**/*.vue',
  '!src/components/decorate-dialog-select/components/**/*.vue'
]
// 预先记录 Element Plus 图标组件名，供自动按需解析使用。
const elementPlusIconNames = new Set(Object.keys(ElementPlusIconsVue))

/**
 * 解析第三方依赖的分包名称
 * @param {String} moduleId 模块路径
 * @returns {String|null} 分包名称
 */
function resolveVendorChunkName(moduleId) {
  // 统一路径分隔符，避免 Windows 反斜杠路径导致分包命名逻辑失效。
  const normalizedModuleId = moduleId.replace(/\\/g, '/')

  // 只对第三方依赖做分包命名，业务代码继续走 Vite 默认拆分策略。
  if (!normalizedModuleId.includes('node_modules')) {
    return null
  }

  // 兼容 pnpm 的物理目录结构，保持历史产物命名规则稳定。
  if (normalizedModuleId.includes('.pnpm/')) {
    return normalizedModuleId.split('.pnpm/')[1].split('/')[0].toString()
  }

  // 兼容普通 node_modules 目录结构，避免不同包管理方式下 chunk 名称漂移。
  if (normalizedModuleId.includes('node_modules/')) {
    return normalizedModuleId.split('node_modules/')[1].split('/')[0].toString()
  }

  return 'vendor'
}

/**
 * 解析 Element Plus 图标组件
 * @param {String} componentName 组件名称
 * @returns {{name: String, from: String}|null} 自动导入配置
 */
function resolveElementPlusIcon(componentName) {
  // 只有命中 Element Plus 图标导出名时，才按需导入对应图标组件。
  if (elementPlusIconNames.has(componentName)) {
    return {
      name: componentName,
      from: '@element-plus/icons-vue'
    }
  }

  return null
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    optimizeDeps: {
      // 扩大开发态依赖扫描范围，提前覆盖懒加载页面里的直接依赖导入。
      entries: optimizeDepEntries,
      // 显式纳入插件运行时生成的 Element Plus 深层导入，避免访问新路由时补优化触发 reload。
      include: optimizeDepIncludes
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      // 自动引入组合式 API、路由 API 以及 Element Plus 指令/方法。
      AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['src/hooks/**', 'src/stores/**', 'src/utils/**'],
        // 开发态和生产态统一走同一套 Element Plus 解析链路，减少两边行为差异。
        resolvers: [ElementPlusResolver()],
        // 将自动生成的声明文件移出 src，避免开发态写入声明时触发页面整刷。
        dts: 'types/auto-import/imports.d.ts'
      }),
      // 自动引入业务组件与 Element Plus 组件。
      Components({
        // 使用精确 globs 控制自动注册范围，避免内部私有子组件参与全局组件命名。
        globs: componentGlobs,
        // 同时补齐 Element Plus 图标的按需注册，替代 main.js 里的整包全局注册。
        resolvers: [resolveElementPlusIcon, ElementPlusResolver()],
        // 将自动生成的组件声明移出 src，减少首次访问新页面时的全量刷新概率。
        dts: 'types/auto-import/components.d.ts'
      }),
      // 对大于 1 KB 的静态资源生成 gzip 预压缩文件。
      compression({
        threshold: 1024,
        algorithms: ['gzip']
      })
    ],
    server: {
      host: true,
      port: 9527,
      open: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    build: {
      rolldownOptions: {
        // 静态资源分类打包。
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 使用 Rolldown 的 codeSplitting 配置替代旧链路中的 manualChunks 写法。
          codeSplitting: {
            groups: [
              {
                // 动态计算第三方依赖的 chunk 名称，延续原有按包拆分的缓存策略。
                name(moduleId) {
                  return resolveVendorChunkName(moduleId)
                },
                // 仅捕获第三方依赖模块，避免业务代码被强行归并到 vendor chunk。
                test: /node_modules[\\/]/
              }
            ]
          }
        }
      },
      sourcemap: false,
      // 使用 Vite 8 默认的 Oxc 压缩链路，避免引入额外压缩依赖。
      minify: 'oxc',
      // 保留对超大共享库的提醒，同时减少后台项目常规 chunk 的误报。
      chunkSizeWarningLimit: 700,
      reportCompressedSize: false
    }
  }
})
