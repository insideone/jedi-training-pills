/** @jsx H */
import {H} from 'dot-dom';
//import Trains from "./trains";
import $ from "../functions/buildDocument";
import Button from "./button";
import Train from "../types/train";
import fetchTrain from "../functions/fetchTrain";
import TrainsReport from "./trainsReport";
import UsersReport from "./usersReport";
import getErrorMessage from "../functions/getErrorMessage";

type ApplicationState = {
    trains: Train[],
    trainsCount: number,
    errors: string[],
    loading: boolean,
};

const skippedTrains = [
    'Birthday Train',
    'Christmas Train',
    'New Year Train',
    'Jedi Train',
    'Mystery Train',
];

const skippedTrainsRegex = /Monthly Train/;

const Application = (props: object, state: ApplicationState, setState: (state: Partial<ApplicationState>) => void) => {
    const {
        trains = [],
        errors = [],
        trainsCount = 0,
        loading = false,
    } = state;

    const loadTrains = () => {
        let trainsStash: Train[] = [];

        Array.from(document.querySelectorAll('.bodytext a')).map(trainLink => {
            try {
                trainsStash.push({
                    url: trainLink.getAttribute('href') || '',
                    name: $.previous(trainLink, node => node.nodeType === Node.TEXT_NODE).textContent,
                    problems: [] as string[],
                } as Train)
            } catch (e) {
                // skip
            }
        });

        trainsStash = trainsStash.filter(train => (
            train.url && train.name
                && !skippedTrains.includes(train.name)
                && !train.name.match(skippedTrainsRegex)
        ));

        // for a debug purpose
        // trainsStash = trainsStash.filter(train => (
        //    [
        //        'Highest Quality NON-Bundled Train',
        //        '21P Train',
        //        '22P Train',
        //    ].includes(train.name)
        // ));

        while (trains.length) { trains.pop() }
        while (errors.length) { errors.pop() }

        setState({
            loading: true,
            trainsCount: trainsStash.length,
            trains,
            errors,
        });

        (new Promise<Train[]>(resolve => {
            (function next(restTrains) {
                if (restTrains.length === 0) {
                    resolve(trains);
                    return;
                }

                const train = restTrains.shift() as Train;

                fetchTrain(train).then(() => {}).catch(error => {
                    train.problems.push(getErrorMessage(error));
                }).finally(() => {
                    trains.push(train);
                    setState({ trains });
                    next(restTrains);
                });
            })(trainsStash);
        })).finally(() => {
            setState({ loading: false })
        })
    };

    return (
        <div className={'jedi-training-pills'}>
            <Button onclick={loading
                ? () => alert("Restarting isn't supported. Please, wait until finished or reload the page")
                : loadTrains
            }>
                Report
                {trainsCount > 0 ? (
                    <span> ({`${trains.length}/${trainsCount}`})</span>
                ): []}
            </Button>
            <hr />
            {trains.length > 0 ? (
                <div>
                    <h2>By Train</h2>
                    <TrainsReport trains={trains}/>
                    <hr />
                    <h2>By User</h2>
                    <UsersReport trains={trains}/>
                    <hr />
                </div>
            ) : []}
            {errors.length > 0 ? (
                <div>
                    <h2>Errors</h2>
                    <ul>
                        {errors.map(error => (<li>{error}</li>))}
                    </ul>
                </div>
            ) : []}
        </div>
    );
};

export default Application;
