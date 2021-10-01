export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function logTime(){
    return Date().toLocaleString('en-GB', { hour: "numeric", 
    minute: "numeric"});
}