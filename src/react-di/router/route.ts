import { Class, Token } from "react-di/types";
import { Resolve } from "./resolver.interface";

export interface Route {
    path?: string;
    canActivate?: Token[];
    resolve?: Class<Resolve<any>>[];
    redirectTo?: string;
    children?: Routes;
}

export type Routes = Route[];
