import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // 1. 全局忽略配置
  {
    ignores: [
      "**/.*",
      "**/*.d.ts",
      "**/dist/**",
      "**/node_modules/**",
      "scripts/**",
      "packages/*/scripts/**",
      "packages/card-renderer/src/vendor/*.js"
    ]
  },

  // 2. 通用基础配置 (适用于所有 JS/TS 文件)
  {
    files: ["**/*.{js,ts}"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "no-var": "error"
    }
  },

  // 3. Vue + TypeScript 的专属配置 (关键部分)
  {
    files: ["packages/card-renderer/**/*.{vue,ts,js}"],
    // 继承规则，注意 prettierConfig 必须在最后
    extends: [...eslintPluginVue.configs["flat/vue3-recommended"], prettierConfig],
    plugins: {
      prettier: prettierPlugin
    },
    languageOptions: {
      // 全局变量，适用于浏览器环境
      globals: {
        ...globals.browser
      },
      // 解析器配置，这是修复问题的核心
      parser: eslintPluginVue.parser, // 必须使用 vue-eslint-parser
      parserOptions: {
        parser: tseslint.parser, // <script> 块使用 typescript-eslint 解析器
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".vue"] // 必须包含 .vue
      }
    },
    rules: {
      // 开启 Prettier 规则
      "prettier/prettier": "warn",
      // 你可以在这里覆盖 vue 或 typescript 的规则
      "vue/multi-word-component-names": "off" // 例如，关闭组件名必须为多词的规则
    }
  },

  // 4. Node.js 环境配置 (例如构建脚本)
  {
    files: ["*.config.{js,ts}", "scripts/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
