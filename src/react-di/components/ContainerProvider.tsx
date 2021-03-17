import { Component, createContext, ReactElement } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { Container } from 'react-di/core';
import { ROUTER } from 'react-di/router';
import { Provider } from 'react-di/types';

export const ContainerContext = createContext<Container>(null as any);
ContainerContext.displayName = 'Container';

export interface RootContainerProviderProps {
    providers: (Provider | Provider[])[];
    children: ReactElement;
}

export class RootContainerProvider extends Component<RootContainerProviderProps> {
    public static contextType = RouterContext;

    private container = new Container(
        [{provide: ROUTER, useValue: this.context}, ...this.props.providers.flat()],
        null,
    );

    public componentWillUnmount(): void {
        this.container.destroy();
    }

    public render() {
        return (
            <ContainerContext.Provider value={this.container}>
              {this.props.children}
            </ContainerContext.Provider>
        );
    }
};

interface ContainerProviderProps {
    providers: Provider[];
    update?: boolean;
}

interface ContainerProviderState {
    parentContainer: Container,
    providedContainer: Container;
}

export class ContainerProvider extends Component<ContainerProviderProps, ContainerProviderState, Container> {

    public static contextType = ContainerContext;
    public static createContainer(
        providers: Provider[],
        parentContainer: Container,
        oldContainer: Container | null,
    ): Container {
        oldContainer?.destroy();

        return new Container(
            providers,
            parentContainer,
        );
    }

    public static getDerivedStateFromProps(
        { providers, update }: ContainerProviderProps,
        { parentContainer, providedContainer: oldContainer }: ContainerProviderState,
    ): ContainerProviderState | null {
        if (!update) {
            return null;
        }

        return {
            parentContainer,
            providedContainer: ContainerProvider.createContainer(
                providers,
                parentContainer,
                oldContainer,
            ),
        };
    }

    public state: ContainerProviderState = {
        parentContainer: this.context,
        providedContainer: ContainerProvider.createContainer(
            this.props.providers,
            this.context,
            null,
        ),
    }

    public componentDidUpdate(): void {
        // if (this.context !== this.state.parentContainer) {

        //     this.setState((state) => {
        //         return {
        //             ...state,
        //             providedContainer: ContainerProvider.createContainer(
        //                 this.props.providers,
        //                 this.context,
        //                 state.providedContainer,
        //             ),
        //         };
        //     });
        // }
    }

    public componentWillUnmount(): void {
        this.state.providedContainer.destroy();
    }

    public render() {
        return (
            <ContainerContext.Provider value={this.state.providedContainer}>
                {this.props.children}
            </ContainerContext.Provider>
        );
    }
}
