export const numberFormat = (value: number) => {
    if(!value || value === undefined) return 0;
    if(typeof value !== 'number') value = Number(value);
    return new Intl.NumberFormat('en-US').format(value.toFixed(2));
}