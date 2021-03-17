import { BehaviorSubject } from 'rxjs';

export class GlobalCounterService {
    public counter$ = new BehaviorSubject(0);

    public increment(): void {
        this.counter$.next(this.counter$.getValue() + 1);
    }

    public decrement(): void {
        this.counter$.next(this.counter$.getValue() - 1);
    }
}
