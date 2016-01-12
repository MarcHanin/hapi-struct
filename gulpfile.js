const Gulp = require('gulp');
const Jscs = require('gulp-jscs');
const Nodemon = require('gulp-nodemon');

const jsFiles = [
    "config/**/*.js",
    "lib/**/*.js",
    "index.js"
];

Gulp.task('jscs', () => {
    return Gulp.src(jsFiles)
        .pipe(Jscs())
        .pipe(Jscs.reporter())
        .pipe(Jscs.reporter('fail'));
});

Gulp.task('start', ['jscs'] ,() => {
    Nodemon({
        script: 'index.js',
        ext: 'js html',
        tasks: ['jscs']
    })
});

Gulp.task('default', ['start']);