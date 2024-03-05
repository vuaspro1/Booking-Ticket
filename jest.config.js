const nextJest = require('next/jest')

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
})

const customJestConfig = {
	// preset: 'ts-jest',
	roots: ['<rootDir>'],
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
	testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
	transform: {
		'^.+\\.(js|ts|tsx)$': 'babel-jest',
		// '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy',
		'\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
	},
	setupFilesAfterEnv: ['<rootDir>/test/__mocks__/jest.setup.js'],
}

module.exports = createJestConfig(customJestConfig)
