var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    nodemon = require('gulp-nodemon'),
    paths = {
        scripts: ['gulpfile.js', 'server.js', 'config/*.js', 'models/*.js', 'routes/*.js', 'utilities/*.js']
};

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('develop', function () {
    nodemon({ script: 'server.js', ext: 'html js' })
        .on('change', ['lint']);
});

//gulp.task('default', ['lint']);