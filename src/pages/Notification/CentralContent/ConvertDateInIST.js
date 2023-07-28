import moment from "moment/moment";

const ConvertDateInIST = (date) => {
    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s ago",
            s:  "%dsec",
            m:  "1min",
            mm: "%dmin",
            h:  "1hr",
            hh: "%dhr",
            d:  "1d",
            dd: "%dd",
            w: "1w",
            ww: "%dw",
            M:  "1mo",
            MM: "%dmo",
            y:  "1y",
            yy: "%dy"
        },
    });
    const local = moment(new Date(date)).toLocaleString();
    return moment(local).fromNow(true);
}

export default ConvertDateInIST;