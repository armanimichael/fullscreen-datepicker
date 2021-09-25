import { getMonthDays } from './date-utils';
import { capitalize } from './string-utils';

class Datepicker {
	private initialized: boolean = false;
	private monthSelector: string;
	private rootSelector: string;
	private daySelector: string;
	private currentDate: Date;
	private locale: string = 'en-US';
	private prevSelector = '.prev-month';
	private nextSelector = '.next-month';

	constructor(
		rootSelector: string = '.fullscreen-datetime-picker',
		daySelector: string = '.day',
		monthSelector: string = '.current-month'
	) {
		this.rootSelector = rootSelector;
		this.daySelector = daySelector;
		this.monthSelector = monthSelector;
		this.currentDate = new Date();
	}

	get rootElem(): HTMLElement {
		return document.querySelector(this.rootSelector);
	}

	get dayTemplateElem(): HTMLElement {
		return document.querySelector(this.daySelector);
	}

	get dateElem(): HTMLElement {
		return document.querySelector(`${this.rootSelector} [type="date"]`);
	}

	get currentMonthElem(): HTMLElement {
		return document.querySelector(`${this.monthSelector}`);
	}

	get prevButton(): HTMLElement {
		return document.querySelector(this.prevSelector);
	}

	get nextButton(): HTMLElement {
		return document.querySelector(this.nextSelector);
	}

	private highlightToday() {
		const today = new Date();
		const day = document.querySelector(`[day="${today.getDate()}"]`);

		const isSameMonth = today.getMonth() === this.currentDate.getMonth();
		const isSameYear = today.getFullYear() === this.currentDate.getFullYear();
		if (isSameMonth && isSameYear) {
			day.classList.add('today');
		}
	}

	private createDays() {
		const date = this.currentDate;
		const days = getMonthDays(date.getFullYear(), date.getMonth());
		const template = this.dayTemplateElem;

		for (let day = 1; day <= days; day++) {
			const dayElem = template.cloneNode(true) as HTMLElement;
			dayElem.innerText = day.toString();
			dayElem.setAttribute('day', day.toString());
			this.rootElem.append(dayElem);
		}
		this.highlightToday();
	}

	private clearDays() {
		const days = document.querySelectorAll('[day]');
		days.forEach(day => {
			day.remove();
		});
	}

	private handleNavigationButtons(target: HTMLElement) {
		const currentMonth = this.currentDate.getMonth();
		let increment = 1;
		if (target === this.prevButton) {
			increment = -1;
		}

		this.currentDate.setMonth(currentMonth + increment);
		this.clearDays();
		this.updateDate();
	}

	private initClickEvents() {
		document.addEventListener('click', ({ target }) => {
			const targetElem = target as HTMLElement;

			// Set clicked day
			const selectedDay = targetElem.getAttribute('day');
			if (selectedDay) {
				this.dayClick(target);
			}

			// Set current month
			if (targetElem === this.prevButton || targetElem === this.nextButton) {
				this.handleNavigationButtons(targetElem);
			}
		});
	}

	private dayClick(targetDay) {
		const oldSelected = document.querySelector(`${this.daySelector}[clicked]`);
		if (oldSelected && oldSelected !== targetDay) {
			oldSelected.removeAttribute('clicked');
		}
		targetDay.setAttribute('clicked', '');

		const day = targetDay.getAttribute('day');
		this.setDate(day);
	}

	private createFormInput() {
		const inputName = this.rootElem.getAttribute('name');
		const inputElem = document.createElement('input');
		inputElem.setAttribute('type', 'date');
		inputElem.setAttribute('name', inputName || '');
		inputElem.style.display = 'none';
		this.rootElem.append(inputElem);
	}

	private setDate(day: number) {
		const year = this.currentDate.getFullYear();
		const month = this.currentDate.getMonth().toString().padStart(2, '0');
		const selectedDay = day.toString().padStart(2, '0');

		this.dateElem.setAttribute('value', `${year}-${month}-${selectedDay}`);
	}

	private setCurrentMonthName() {
		let monthName = this.currentDate.toLocaleString(this.locale, {
			month: 'long',
		});

		monthName = capitalize(monthName);
		this.currentMonthElem.innerText = `${monthName} ${this.currentDate.getFullYear()}`;
	}

	public setLocale(locale: string) {
		if (this.initialized) {
			console.error('You can only set the locale before calling init()!');
			return;
		}

		this.locale = locale;
	}

	private updateDate() {
		this.createDays();
		this.setCurrentMonthName();
	}

	public setNavigationButtons(prevSelector: string, nextSelector: string) {
		this.prevSelector = prevSelector;
		this.nextSelector = nextSelector;
	}

	public init(currentDate: Date | null = null) {
		this.currentDate = currentDate ?? this.currentDate;
		this.createDays();
		this.createFormInput();
		this.initClickEvents();
		this.setCurrentMonthName();
		this.initialized = true;
	}
}

export { Datepicker };
