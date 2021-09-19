import { getMonthDays } from './date-utils';

class Datepicker {
	constructor(elemSelector, daySelector) {
		this.elemSelector = elemSelector;
		this.daySelector = daySelector;
		this.currentDate = new Date();
	}

	get rootElem() {
		return document.querySelector(this.elemSelector);
	}

	get templateDay() {
		return document.querySelector(this.daySelector);
	}

	get dateElem() {
		return document.querySelector(`${this.elemSelector} [type="date"]`);
	}

	highlightToday() {
		const today = new Date();
		const day = document.querySelector(`[day="${today.getDate()}"]`);

		const isSameMonth = today.getMonth() === this.currentDate.getMonth();
		const isSameYear = today.getFullYear() === this.currentDate.getFullYear();
		if (isSameMonth && isSameYear) {
			day.classList.add('today');
		}
	}

	createDays() {
		const date = this.currentDate;
		const days = getMonthDays(date.getFullYear(), date.getMonth());
		const template = this.templateDay;

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

		const day = targetDay.getAttribute('day');
		this.setDate(day);
	}

	createFormInput() {
		const inputName = this.rootElem.getAttribute('name');
		const inputElem = document.createElement('input');
		inputElem.setAttribute('type', 'date');
		inputElem.setAttribute('name', inputName || '');
		inputElem.style.display = 'none';
		this.rootElem.append(inputElem);
	}

	setDate(day) {
		const year = this.currentDate.getFullYear();
		const month = this.currentDate.getMonth().toString().padStart(2, 0);
		const selectedDay = day.toString().padStart(2, 0);

		this.dateElem.value = `${year}-${month}-${selectedDay}`;
	}

	init() {
		this.createDays();
		this.createFormInput();
		this.initClickEvents();
	}
}

export { Datepicker };
