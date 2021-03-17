import { Observable, Subject } from "rxjs";
import { scan, startWith } from "rxjs/operators";
import { Inject, Injectable } from "react-di/decorators";
import { INITIAL_COUNTER_VALUE } from "constants/initial-counter-value.constant";
import { GlobalCounterService } from "./global-counter.service";
import { onDestroy } from "react-di/core/onDestroy.interface";

const enum ACTIONS {
  INCREMENT,
  DECREMENT,
}

@Injectable()
export class CounterService implements onDestroy {
    public static instancesCount = 0;
    public instance = ++CounterService.instancesCount;
    public counter$: Observable<number>;
    private actions$ = new Subject<ACTIONS>();

    constructor(
        private globalCounterService: GlobalCounterService,
        @Inject(INITIAL_COUNTER_VALUE)
        initialValue: number,
    ) {
        this.counter$ = this.actions$.pipe(
            startWith(initialValue),
            scan((currentValue, action) => {
                switch (action) {
                case ACTIONS.INCREMENT:
                    return currentValue + 1;
                case ACTIONS.DECREMENT:
                    return currentValue - 1;
                default:
                    return currentValue;
                }
            }),
        );
    }

    public onDestroy(): void {
        console.log('destroy');
        console.trace();
    }

    public increment(): void {
        this.globalCounterService.increment();
        this.actions$.next(ACTIONS.INCREMENT);
    }

    public decrement(): void {
        this.globalCounterService.decrement();
        this.actions$.next(ACTIONS.DECREMENT);
    }
}
