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

export function openLoader(text) {
    document.getElementById('Spinner_loading_content').innerText = text;
    document.getElementById('Spinner_loading').classList.remove('d-none');
}

export function closeLoader() {
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 500);
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 800);
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 1100);
    setTimeout(() => {
        document.getElementById('Spinner_loading').classList.add('d-none');
    }, 1400);
}
