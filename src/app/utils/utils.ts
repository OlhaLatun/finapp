import { MONTH_CONSTANTS } from '../constants/constants';

export function getCurrentMonthAndYear(): string {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return `${MONTH_CONSTANTS[month]} ${year}`;
}
