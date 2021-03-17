import { InjectionToken } from 'react-di/core';
import { Routes } from './route';

export const ROUTER_CONFIG = new InjectionToken<{ routes: Routes }>('Router config');
