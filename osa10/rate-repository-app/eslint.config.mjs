import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([{
	extends: compat.extends('eslint:recommended', 'plugin:react/recommended', 'plugin:jest/recommended'),

	plugins: {
		react,
		'react-native': reactNative,
	},

	languageOptions: {
		globals: {
			...reactNative.environments['react-native']['react-native'],
			setTimeout: 'readonly',
			clearTimeout: 'readonly',
			setInterval: 'readonly',
			clearInterval: 'readonly',
		},

		parser: babelParser,
	},

	settings: {
		react: {
			version: 'detect',
		},
	},

	rules: {
		// React specific rules
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		
		// Indentation and formatting rules
		'indent': ['error', 'tab', {
			'SwitchCase': 1,
			'VariableDeclarator': 1,
			'outerIIFEBody': 1,
			'MemberExpression': 1,
			'FunctionDeclaration': { 'parameters': 1, 'body': 1 },
			'FunctionExpression': { 'parameters': 1, 'body': 1 },
			'CallExpression': { 'arguments': 1 },
			'ArrayExpression': 1,
			'ObjectExpression': 1,
			'ImportDeclaration': 1,
			'flatTernaryExpressions': false,
			'ignoreComments': false,
			'ignoredNodes': ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
		}],
		'no-tabs': 'off',
		
		// Basic code quality rules
		'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-alert': 'error',
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-new-func': 'error',
		'no-script-url': 'error',
		'no-void': 'error',
		'no-with': 'error',
		
		// Style rules
		'semi': ['error', 'always'],
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'comma-dangle': ['error', 'always-multiline'],
		'eol-last': 'error',
		'space-before-blocks': 'error',
		'space-in-parens': ['error', 'never'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'computed-property-spacing': ['error', 'never'],
		'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		
		// Function rules
		'func-call-spacing': ['error', 'never'],
		'space-before-function-paren': ['error', {
			'anonymous': 'always',
			'named': 'never',
			'asyncArrow': 'always',
		}],
		
		// Arrow function rules
		'arrow-spacing': ['error', { 'before': true, 'after': true }],
		'arrow-parens': ['error', 'as-needed'],
		
		// Operator rules
		'space-infix-ops': 'error',
		'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
		
		// Block rules
		'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
		'curly': ['error', 'all'],
		
		// Variable rules
		'no-var': 'error',
		'prefer-const': 'error',
		
		// ES6+ rules
		'prefer-template': 'error',
		'template-curly-spacing': ['error', 'never'],
		'rest-spread-spacing': ['error', 'never'],
	},
}]);
