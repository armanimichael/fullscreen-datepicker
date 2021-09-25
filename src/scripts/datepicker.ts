import { getMonthDays } from './date-utils';
import { capitalize } from './string-utils';

class Datepicker {
	private initialized: boolean = false;
	private monthSelector: string;
	private rootSelector: string;
	private daySelector: string;
	private currentDate: Date;
	private locale: string = 'en-US';

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
		template.remove();
		this.highlightToday();
	}

	private initClickEvents() {
		document.addEventListener('click', ({ target }) => {
			const selectedDay = (target as HTMLElement).getAttribute('day');
			if (selectedDay) {
				this.dayClick(target);
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
		const monthName = this.currentDate.toLocaleString(this.locale, {
			month: 'long',
		});
		this.currentMonthElem.innerText = capitalize(monthName);
	}

	public setLocale(locale: string) {
		if (this.initialized) {
			console.error('You can only set the locale before calling init()!');
			return;
		}

		this.locale = locale;
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
