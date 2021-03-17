import { Class, Token } from 'react-di/types';
import { isClass } from 'react-di/utils';

export type ClassDependency = Token | null;

const enum MetadataKeys {
    ParamTypes = 'design:paramtypes',
    Reflector = 'reflector',
}

export class Reflector {
    public static getClassReflector(Class: Class): Reflector {
        return Reflect.getMetadata(MetadataKeys.Reflector, Class) || new Reflector(Class);
    }

    private paramTypes: unknown[] = Reflect.getMetadata(MetadataKeys.ParamTypes, this.Class) || [];
    private paramsAnnotation: ClassDependency[] = Array(this.paramTypes.length).fill(null);

    public get dependencies(): ClassDependency[] {
        return this.paramTypes.map((type, index) => {
            const annotation = this.paramsAnnotation[index];
            if (!isClass(type)) {
                type = null;
            }
            return annotation || (type as Class | null);
        });
    }

    constructor(private Class: Class) {
        if (!isClass(Class)) {
            throw new TypeError(`Expected ${Class} to be a class!`);
        }
        Reflect.defineMetadata(MetadataKeys.Reflector, this, Class);
    }

    public setParamAnnotation(token: Token, index: number): void {
        this.paramsAnnotation[index] = token;
    }
}
