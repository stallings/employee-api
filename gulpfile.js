var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    nodemon = require('gulp-nodemon'),
    ngAnnotate = require('gulp-ng-annotate'),
    paths = {
        scripts: ['gulpfile.js', 'server.js', 'config/*.js', 'models/*.js', 'routes/*.js', 'utilities/*.js']
};

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('concat', function() {
    gulp.src(['./public/js/app.js','./public/js/controllers.js','./public/js/directives.js','./public/js/services.js'])
        .pipe(concat('app.all.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('develop', function () {
    nodemon({ script: 'server.js', ext: 'html js' })
        .on('change', ['lint']);
});

gulp.task('default', ['lint', 'concat']);