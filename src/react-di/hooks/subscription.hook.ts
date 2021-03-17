import { useEffect, useState } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

export function useSubscription<T>(observable: BehaviorSubject<T>): T;
export function useSubscription<T>(observable: Observable<T>): T | undefined;
export function useSubscription<T>(observable: Observable<T>, initialValue: T): T;
export function useSubscription<T>(
    observable: Observable<T> | BehaviorSubject<T>,
    initialValue?: T,
): T | undefined {
    const [state, setState] = useState(
        observable instanceof BehaviorSubject
            ? observable.getValue()
            : initialValue,
    );

    useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => subscription.unsubscribe();
    }, [observable]);

    return state;
}
