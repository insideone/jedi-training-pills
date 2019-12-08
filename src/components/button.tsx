/** @jsx H */
import {H} from 'dot-dom';

type ButtonProps = {
    children: any|any[],
    onclick: () => void,
};

const Button = (props: ButtonProps) => {
    return (
        <a className={'btn_green_white_innerfade btn_medium'} {...props}>
            <span>{props['c']}</span>
        </a>
    );
};

export default Button;
