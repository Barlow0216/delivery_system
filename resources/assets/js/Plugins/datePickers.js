let moment = require('moment')
import Lang from 'lang.js';
import messages from '../lang';

require('daterangepicker-custom');

const lang = new Lang({messages});

let pickerRanges = {};
pickerRanges[lang.get('common.today')] = [moment().startOf("day"), moment().endOf('day')];
pickerRanges[lang.get('common.yesterday')] = [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')];
pickerRanges[lang.get('common.last7days')] = [moment().subtract(7, 'days'), moment().subtract(1, 'days')];
pickerRanges[lang.get('common.thisWeek')] = [moment().startOf('week'), moment().endOf('week')];
pickerRanges[lang.get('common.last30days')] = [moment().subtract(29, 'days'), moment()];
pickerRanges[lang.get('common.thisMonth')] = [moment().startOf('month'), moment().endOf('month')];
pickerRanges[lang.get('common.lastMonth')] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];


let dateRangeLocale = {
    "format": "MMM D, YYYY",
    "separator": " - ",
    "applyLabel": lang.get('common.apply'),
    "cancelLabel": lang.get('common.cancel'),
    "fromLabel": lang.get('common.from'),
    "toLabel": lang.get('common.to'),
    "customRangeLabel": lang.get('common.customRange'),
    "weekLabel": "W",
    "daysOfWeek": [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
    ],
    "monthNames": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    "firstDay": 1
};

(function () {
    dateTimePicker();

    function dateTimePicker() {
        var startDate = $('#available_time_start');
        var endDate = $('#available_time_end');
        $('.date-rangepicker').each(function () {
            var ranges = $(this).data("ranges") ? pickerRanges : false;
            $(this).daterangepicker({
                showDropdowns: true,
                minDate: moment([2018]),
                locale: {
                    format: "MMM D, YYYY"
                },
                ranges: ranges
            }, function (start, end, label) {
                var years = moment().diff(start, 'years');
            });
        });
        $('.datetime-rangepicker').each(function () {
            var ranges = $(this).data("ranges") ? pickerRanges : false;
            $(this).daterangepicker({
                showDropdowns: true,
                timePicker: true,
                minDate: moment([2018]),
                locale: {
                    format: "MMM D, YYYY hh:mm A"
                },
                ranges: ranges
            });
        });
        startDate.on("dp.change", function (e) {
            endDate.data("DateTimePicker").minDate(e.date);
        });
        endDate.on("dp.change", function (e) {
            startDate.data("DateTimePicker").maxDate(e.date);
        });
        $('.datetimepicker').each(function () {
            let drops = $(this).data('drp-drops') || "down"
            $(this).daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: "DD/MM/YYYY"
                },
                minDate: moment(),
                drops: drops
            });
        })
    }

})();

// date range picker for reports
(function () {

    let $range = $('#reportrange');
    let drpOptions = {
        ranges: pickerRanges,
        lifetimeRangeLabel: lang.get('common.lifetime'),
        locale: dateRangeLocale
    };
    reportRangePicker()

    function reportRangePicker() {

        window.lifetimeRangeLabel = lang.get('common.lifetime');
        var qs = window.getUrlVars();
        var startDate = qs.start || $range.data('start-date') || false;
        var endDate = qs.end || $range.data('end-date') || false;
        drpOptions.isLifetime = !(startDate && endDate);

        if (!drpOptions.isLifetime) {
            drpOptions.startDate = moment.unix(startDate);
            drpOptions.endDate = moment.unix(endDate);
        }

        if ($range.length) {
            drpOptions.lifetimeRange = $range.data('lifetime-range') === "true";
            drpOptions.opens = "left";

            // init date time range picker
            $range.daterangepicker(drpOptions, callback);

            $range.on('apply.daterangepicker', function (ev, picker) {
                var qs = window.getUrlVars();
                qs.start = picker.startDate.unix();
                qs.end = picker.endDate.unix();
                window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + window.to_qs(qs);
            });
            $range.on('lifetime.daterangepicker', function (ev, picker) {

                var qs = window.getUrlVars();
                if (qs.start) delete qs.start;
                if (qs.end) delete qs.end;
                window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + (qs.length ? "?" + window.to_qs(qs) : "");
            });

            callback(drpOptions.startDate, drpOptions.endDate);

        }
    }

    function callback(start, end) {
        let label = $range.find('span');
        if (drpOptions.isLifetime)
            label.html(window.lifetimeRangeLabel);
        else
            label.html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    }
})();