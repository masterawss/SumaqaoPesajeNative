export const numberFormat = (value: number | string | null | undefined) => {
    if(!value || value === undefined) return 0;
    const numericValue = typeof value === 'number' ? value : Number(value);
    return new Intl.NumberFormat('en-US').format(Number(numericValue.toFixed(2)));
}
