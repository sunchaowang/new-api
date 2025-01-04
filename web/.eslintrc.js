module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ],
  // parser: 'babel-eslint', // 或者可以直接移除这一行，使用默认解析器
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false, // 确保 Babel 不会尝试查找配置文件
    babelOptions: {
      presets: ['@babel/preset-react'] // 确保 Babel 能够正确解析 React 代码
    }
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
