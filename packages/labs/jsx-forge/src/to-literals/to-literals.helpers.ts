import type { Ts } from '../types.js';

export function getBuiltinType(
	checker: Ts.TypeChecker,
	typeText: string,
): Ts.Type {
	switch (typeText) {
		case 'any': {
			return checker.getAnyType();
		}
		case 'bigint': {
			return checker.getBigIntType();
		}
		case 'boolean': {
			return checker.getBooleanType();
		}
		case 'never': {
			return checker.getNeverType();
		}
		case 'nonNullable': {
			return checker.getNonNullableType(checker.getAnyType());
		}
		case 'null': {
			return checker.getNullType();
		}
		case 'number': {
			return checker.getNumberType();
		}
		case 'string': {
			return checker.getStringType();
		}
		case 'symbol': {
			return checker.getESSymbolType();
		}
		case 'undefined': {
			return checker.getUndefinedType();
		}
		case 'void': {
			return checker.getVoidType();
		}
		// FIXME:
		// unknown
	}

	throw new Error('Incorrect type');
}
