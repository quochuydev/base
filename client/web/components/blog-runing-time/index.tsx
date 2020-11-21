import React, { useEffect } from 'react';

const loadTimeCountEvent = () => {
    const time = document.getElementById('blog-runing-time');
    function showRunTime() {
        const BirthDay = new Date('2016/012/11 00:00:00');
        const today = new Date();
        const timeold = today.getTime() - BirthDay.getTime();
        const msPerDay = 864e5;
        const eDaysold = timeold / msPerDay;
        const daysold = Math.floor(eDaysold);
        const eHrsold = 24 * (eDaysold - daysold);
        const hrsold = Math.floor(eHrsold);
        const eMinsold = 60 * (eHrsold - hrsold);
        const minsold = Math.floor(60 * (eHrsold - hrsold));
        const seconds = Math.floor(60 * (eMinsold - minsold));
        if (time) {
            time.innerHTML = daysold + 'd' + hrsold + 'h' + minsold + 'm' + seconds + 's';
        }
    }
    setInterval(showRunTime, 1000);
};
export default () => {
    useEffect(() => {
        loadTimeCountEvent();
    });
    return <span id="blog-runing-time"></span>;
};
