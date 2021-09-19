import { getMonthDays } from './date-utils';

class Datepicker {
	constructor(elemSelector, daySelector) {
		this.rootElem = document.querySelector(elemSelector);
		this.dayElem = document.querySelector(daySelector);
		this.selectedDate = new Date();
	}

	highlightToday() {
		const today = new Date();
		const day = document.querySelector(`[day="${today.getDate()}"]`);

		const isSameMonth = today.getMonth() === this.selectedDate.getMonth();
		const isSameYear = today.getFullYear() === this.selectedDate.getFullYear();
		if (isSameMonth && isSameYear) {
			day.classList.add('today');
		}
	}

	createDays() {
		const date = this.selectedDate;
		const days = getMonthDays(date.getFullYear(), date.getMonth());

		for (let day = 1; day <= days; day++) {
			const dayElem = this.dayElem.cloneNode(true);
			dayElem.innerText = day;
			dayElem.setAttribute('day', day);
			this.rootElem.append(dayElem);
		}
		this.highlightToday();
	}

	init() {
		this.createDays();
	}

	value() {}
}

export { Datepicker };
