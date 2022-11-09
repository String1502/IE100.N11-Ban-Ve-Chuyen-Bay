export let today = new Date();

export function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function numberWithoutDot(x) {
    return x.toString().replace('.', '');
}

export function numberSmallerTen(x) {
    if (parseInt(x) < 10) return '0' + x;
    return x;
}
