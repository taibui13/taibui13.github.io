
import {PAGES} from './constant';

export const detectPathName = () => {
    const router = [PAGES.REDEEM, PAGES.COMPLETE, PAGES.ERROR];
    let pn = window.location.pathname;
    return pn.replace(router.filter(a => pn.indexOf(a) !== -1)[0], "");
};

export const getURLParameter = (name) => {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || '';
}



