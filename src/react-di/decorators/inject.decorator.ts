import { Reflector } from 'react-di/core';
import { Token } from 'react-di/types';
import { isClass } from 'react-di/utils';

export const Inject = (token: Token): ParameterDecorator => (Class, key, index) => {
    if (!isClass(Class)) return;
    Reflector.getClassReflector(Class).setParamAnnotation(token, index);
};
