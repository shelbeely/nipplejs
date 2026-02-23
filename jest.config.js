/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/test/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
