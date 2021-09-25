import { Datepicker } from './datepicker';

const datepicker = new Datepicker(
	'.fullscreen-datetime-picker',
	'.day',
	'.current-month'
);
datepicker.setLocale('it-IT');
datepicker.init();
