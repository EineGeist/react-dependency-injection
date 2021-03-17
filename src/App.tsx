import { Card, Container, Grid, Typography } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';
import Counter from 'components/Counter';
import { ContainerProvider } from 'react-di/components';
import { useInjection, useSubscription } from 'react-di/hooks';
import { GlobalCounterService } from 'services/global-counter.service';
import { CounterService } from 'services/counter.service';
import { SOME_CONSTANT } from 'constants/some-constant.constant';
import { useEffect, useState } from 'react';
import { RouterService } from 'react-di/router';
import { Link } from 'react-router-dom';

function App() {
    const itemStyles: CSSProperties = {
        display: 'flex',
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
    };
    const globalCounterService = useInjection(GlobalCounterService);
    const globalCount = useSubscription(globalCounterService.counter$);
    const [someConstantValue, setSomeConstantValue] = useState('Child constant');
    const router = useInjection(RouterService)

    useEffect(() => {
        setTimeout(() => setSomeConstantValue('Child constant updated'), 5000);
    }, []);

    return (
        <Container maxWidth='md'>
            <Card style={{ textAlign: 'center', padding: 10 }} color='#444'>
                <Typography variant='h5' align='center'>
                    Global counter
                </Typography>
                {globalCount}
            </Card>
            <br />
            <Link to="/test">Link</Link>
            <button onClick={() => router.goTo('/test')}>GOTO</button>
            <button onClick={() => router.goBack()}>BACK</button>
            <Card>
                <Grid container>
                    <Grid item xs={12} md={4} style={itemStyles}>
                        <Typography variant='h5' align='center'>
                            First component
                        </Typography>
                        <span>
                            <Counter />
                        </span>
                    </Grid>
                    <ContainerProvider
                        providers={[{ provide: SOME_CONSTANT, useValue: someConstantValue }]}
                        update
                    >
                        <>
                            <Grid item xs={12} md={4} style={itemStyles}>
                                <Typography variant='h5' align='center'>
                                    Second component
                                </Typography>
                                <span>
                                    <Counter />
                                </span>
                            </Grid>
                            <Grid item xs={12} md={4} style={itemStyles}>
                                <Typography variant='h5' align='center'>
                                    Third component
                                </Typography>
                                <span>
                                    <ContainerProvider providers={[CounterService]}>
                                        <>
                                            <Counter />
                                            {globalCount}
                                        </>
                                    </ContainerProvider>
                                </span>
                            </Grid>
                        </>
                    </ContainerProvider>
                </Grid>
            </Card>
        </Container>
    );
}

export default App;
