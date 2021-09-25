import { Datepicker } from './datepicker';

const datepicker = new Datepicker(
	'.fullscreen-datetime-picker',
	'.day',
	'.current-month'
);
datepicker.setLocale('it');
datepicker.setNavigationButtons('.prev', '.next');

const currentDateParam = new URLSearchParams(location.search).get('some-date');
let currentDate;
if (currentDateParam) {
	currentDate = new Date(currentDateParam);
}
datepicker.init(currentDate);
