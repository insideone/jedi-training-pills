import tinydate from 'tinydate';

const formatDate = (date: Date, format: string) => tinydate(format)(date);

export default formatDate;
