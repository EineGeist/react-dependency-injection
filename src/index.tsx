import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { RootContainerProvider } from 'react-di/components';
import { CounterService } from 'services/counter.service';
import {
    initialCounterValue,
    INITIAL_COUNTER_VALUE,
} from 'constants/initial-counter-value.constant';
import { GlobalCounterService } from 'services/global-counter.service';
import { SOME_CONSTANT } from 'constants/some-constant.constant';
import { BrowserRouter as Router } from 'react-router-dom';
import { RouterService } from 'react-di/router';
import { Routes } from 'react-di/router/route';
import { Injectable } from 'react-di/decorators';
import { Resolve } from 'react-di/router/resolver.interface';
import { of } from 'rxjs';

@Injectable()
class TestResolver implements Resolve<string> {
    public resolve() {
        return of('HI!');
    }
}

const routes: Routes = [
    {
        path: '/test',
        resolve: [TestResolver],
    },
];

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <RootContainerProvider providers={[
                { provide: INITIAL_COUNTER_VALUE, useValue: initialCounterValue },
                { provide: SOME_CONSTANT, useValue: 'Root constant' },
                CounterService,
                GlobalCounterService,
                TestResolver,
                RouterService.withRoutes(routes),
            ]}>
                <App />
            </RootContainerProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);
