import { Button, ButtonGroup } from "@material-ui/core";
import { CounterService } from "services/counter.service";
import { useInjection, useSubscription } from "react-di/hooks";
import { SOME_CONSTANT } from "../constants/some-constant.constant";

export default function Counter() {
    const [counterService, constantValue] = useInjection(
        CounterService,
        SOME_CONSTANT
    );
    const counterValue = useSubscription(counterService.counter$);

    return (
        <>
            <div>
                Constant value: {constantValue}
                <br />
                Counter instance: #{counterService.instance}
            </div>
            <ButtonGroup>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => counterService.decrement()}
                >Decrement</Button>

                <Button variant="contained" style={{ color: "black" }} disabled>
                    {counterValue}
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => counterService.increment()}
                >Increment</Button>
            </ButtonGroup>
        </>
    );
}
