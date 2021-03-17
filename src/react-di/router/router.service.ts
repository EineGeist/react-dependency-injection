import { Container } from 'react-di/core';
import { Inject, Injectable } from 'react-di/decorators';
import { Provider } from 'react-di/types';
import { fromEventPattern } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Resolve } from './resolver.interface';
import { Route, Routes } from './route';
import { ROUTER_CONFIG } from './router-config.provider';
import { ROUTER } from './router.provider';

@Injectable()
export class RouterService {

    public static withRoutes(routes: Routes): Provider[] {
        return [{ provide: ROUTER_CONFIG, useValue: { routes } }, RouterService];
    }

    public history$ = fromEventPattern<[any, string]>(
        (handler) => this.router.history.listen(handler),
        (handler, unregister) => unregister(),
    );

    public location$ = this.history$.pipe(
        map(([location]) => location.pathname),
        startWith(this.router.location.pathname),
    );

    private routes = new Map<string, Route>(
        this.routerConfig.routes.map((route) => [route.path || '', route]),
    );

    constructor(
        @Inject(ROUTER)
        private router: any,
        @Inject(ROUTER_CONFIG)
        private routerConfig: { routes: Routes },
        private container: Container,
    ) {
        this.location$.subscribe(path => {
            const resolverTokens = this.routes.get(path)?.resolve || [];
            let resolvers: any = this.container.get(...resolverTokens);
            resolvers = resolvers?.length ? resolvers : resolvers && [resolvers];

            resolvers?.forEach((resolver: Resolve<any>) => resolver.resolve());
        });
    }

    public goTo(to: string): void {
        this.router.history.push(to);
    }

    public goBack(): void {
        this.router.history.goBack();
    }
}
