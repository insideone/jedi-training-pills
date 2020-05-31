// import * as retry from "retry";
import {R, H} from 'dot-dom';
import $ from "./functions/buildDocument";
import Application from "./components/application";

// global retry policy
// retry.wrap(GM, {retries: 3}, ['xmlHttpRequest']);

const appContainer = document.createElement('div');
appContainer.classList.add('jedi-training-pills');

const friendsInGroup = document.querySelector('.grouppage_friendsingroup');
if (friendsInGroup) {
    friendsInGroup.insertAdjacentHTML(
        'afterbegin',
        `
            <a
                class="btn_darkblue_white_innerfade btn_medium"
                href="#"
                onclick="
                    location.href = 'https://steamcommunity.com/groups/JediTraining/announcements/detail/1689297920480934920';
                    return false;
                "
                style="
                    position: absolute;
                    right: 0;
                    top: -35px;
                "
            >
                <span>To Report</span>
            </a>
    `);
}

const postBody = $.one(document, '.announcement_body');
(postBody.parentElement as Element).insertBefore(appContainer, postBody);

R(H(Application), appContainer);
