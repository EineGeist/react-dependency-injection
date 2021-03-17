import { Observable } from 'rxjs';

export interface Resolve<T> {
    resolve(): Observable<T> | Promise<T> | T;
}
