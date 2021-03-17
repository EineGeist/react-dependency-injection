import { InjectionToken } from './core';

export type Class<T = any> = {
    new (...args: any[]): T;
};

export type Token<T = any> = Class<T> | InjectionToken<T>;

export type UnpackToken<T> = T extends Token<infer U> ? U : T;
export type UnpackTokenArray<T> = { [I in keyof T]: UnpackToken<T[I]> };

export type ClassProvider<T = any> = { provide: Token<T>; useClass: Class<T>, multi?: boolean; };
export type ValueProvider<T = any> = { provide: Token<T>; useValue: T; multi?: boolean; };
export type ExistingProvider<T = any> = { provide: Token<T>; useExisting: Token<T>; multi?: boolean; };
export type FactoryProvider<T = any, D extends Token[] = any[]> = {
    provide: Token<T>;
    useFactory(...deps: UnpackTokenArray<D>): void;
    deps?: [...D];
    multi?: boolean;
};

export type Provider<T = any, D extends Token[] = any[]> =
    | Class<T>
    | ClassProvider<T>
    | ValueProvider<T>;
    // TODO add support
    // | ExistingProvider<T>
    // | FactoryProvider<T, D>;
