import { globSync } from 'glob';
console.log(globSync('src/assets/cards/**/*.png').length);
