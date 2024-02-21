export const humanDate = (date: Date) => {
    let d = date.toLocaleString().split(',')[0];
    // Cambiar el formato de d/m/Y a Y-m-d
    let [day, month, year] = d.split('/');
    if(day.length == 1) day = '0' + day;
    if(month.length == 1) month = '0' + month;
    return `${year}-${month}-${day}`;
    // return `${year}-${day}-${month}`;
}