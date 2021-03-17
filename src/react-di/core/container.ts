import {
    Class,
    Provider,
    Token,
    UnpackToken,
    UnpackTokenArray,
} from 'react-di/types';
import { Reflector, InjectionToken } from 'react-di/core';
import { isClass } from 'react-di/utils';

const resolveStack = new Set<Class>();
const errorPrefix = 'Container error:';

export class Container {
    private providers = new Map<Token, any>();
    private instances = new Map<Token, any>([[Container, this]]);

    constructor(
        providers: [...Provider[]],
        private parent: Container | null = null,
    ) {
        providers.forEach(this.registerProvider.bind(this));
    }

    public destroy(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, instance] of this.instances) {
            if (typeof instance.onDestroy === 'function') {
                instance.onDestroy();
            }
        }
    }

    public get<T extends Token>  (...tokes: [T]): UnpackToken<T>;
    public get<T extends Token[]>(...tokens: [...T]): UnpackTokenArray<T>;
    public get<T extends Token[]>(...tokens: [...T]): UnpackTokenArray<T> | UnpackToken<T> {
        const resolvedTokens = tokens.map((token) => {
            if (this.instances.has(token)) return this.instances.get(token);
            let resolved = this.resolveToken(token);
            if (resolved === undefined) {
                resolved = this.parent?.get(token);
                // TODO Error
            }
            return resolved;
        });

        return resolvedTokens.length > 1
            ? resolvedTokens
            : resolvedTokens[0];
    }

    private registerProvider(provider: Provider) {
        if (isClass(provider)) {
            provider = { provide: provider, useClass: provider };
        }

        const value = 'useClass' in provider
            ? provider.useClass
            : provider.useValue;

        this.providers.set(provider.provide, value);
    }

    private resolveToken(token: Token) {
        if (!this.providers.has(token)) return;
        const value = this.providers.get(token);

        if (token instanceof InjectionToken) return this.providers.get(token);
        if (isClass(value)) return this.resolveClass(value);
    }

    public resolveClass(Class: Class): InstanceType<Class> {
        if (resolveStack.has(Class)) {
            throw new Error(`${errorPrefix} Circular dependency in ${Class.name}`);
        }
        resolveStack.add(Class);

        const deps = Reflector.getClassReflector(Class).dependencies;
        const resolvedDeps = [];

        while (deps.length) {
            const dep = deps.shift();
            if (!dep) {
                throw new Error(`${errorPrefix} Can't resolve dependency for ${Class.name} at index ${deps.length - 1}`);
            }
            resolvedDeps.push(this.get(dep));
        }

        const instance = new Class(...resolvedDeps);
        this.instances.set(Class, instance);
        resolveStack.delete(Class);
        return instance;
    }
}
