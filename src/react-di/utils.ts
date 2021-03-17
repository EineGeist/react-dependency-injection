import { Class } from './types';

export function isClass(Class: unknown): Class is Class {
    return typeof Class === 'function';
}
