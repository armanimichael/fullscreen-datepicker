import { getMonthDays } from './date-utils';

class Datepicker {
	constructor(elemSelector, daySelector) {
		this.rootElem = document.querySelector(elemSelector);
		this.daySelector = daySelector;
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
		const template = document.querySelector(this.daySelector);

		for (let day = 1; day <= days; day++) {
			const dayElem = template.cloneNode(true);
			dayElem.innerText = day;
			dayElem.setAttribute('day', day);
			this.rootElem.append(dayElem);
		}
		template.remove();
		this.highlightToday();
	}

	initClickEvents() {
		document.addEventListener('click', ({ target }) => {
			const selectedDay = target.getAttribute('day');
			if (selectedDay) {
				this.dayClick(target);
			}
		});
	}

	dayClick(targetDay) {
		const oldSelected = document.querySelector(`${this.daySelector}[clicked]`);
		if (oldSelected && oldSelected !== targetDay) {
			oldSelected.removeAttribute('clicked');
		}
		targetDay.setAttribute('clicked', '');
	}

	init() {
		this.createDays();
		this.initClickEvents();
	}

	value() {}
}

export { Datepicker };
