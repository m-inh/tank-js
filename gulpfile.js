const gulp = require('gulp');
const babel = require('gulp-babel');
gulp.task('default', function () {

    // browser source
    gulp.src("public/es6/scripts/*.js")
        .pipe(babel())
        .pipe(gulp.dest("public/dist/scripts"));
});