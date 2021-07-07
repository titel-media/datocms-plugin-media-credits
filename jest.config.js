module.exports = {
  verbose: false,
  rootDir: './',
  setupFiles: [],
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: ['/dist/'],
  globals: {},
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testURL: 'http://localhost',
  transform: {
    '\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['json', 'lcovonly', 'text', 'cobertura', 'html'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['node_modules', 'src/index.jsx', 'src/hoc/connectToDatoCms.jsx'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
