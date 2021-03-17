import { useContext } from 'react';
import { ContainerContext } from 'react-di/components';
import { Token, UnpackToken, UnpackTokenArray } from 'react-di/types';

export function useInjection<T extends Token>  (...token: [T]): UnpackToken<T>;
export function useInjection<T extends Token[]>(...tokens: [...T]): UnpackTokenArray<T>;
export function useInjection<T extends Token[]>(...tokens: [...T]): UnpackTokenArray<T> | UnpackToken<T> {
    return useContext(ContainerContext).get<T>(...tokens);
}
