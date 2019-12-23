import * as retry from "retry";
import {R, H} from 'dot-dom';
import $ from "./functions/buildDocument";
import Application from "./components/application";

// global retry policy
retry.wrap(GM, {retries: 3}, ['xmlHttpRequest']);

const appContainer = document.createElement('div');
appContainer.classList.add('jedi-training-pills');

const postBody = $.one(document, '.announcement_body');
(postBody.parentElement as Element).insertBefore(appContainer, postBody);

R(H(Application), appContainer);
