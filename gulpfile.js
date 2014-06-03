var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    nodemon = require('gulp-nodemon'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngHtml2Js = require("gulp-ng-html2js"),
    paths = {
        scripts: ['gulpfile.js', 'server.js', 'config/*.js', 'models/*.js', 'routes/*.js', 'utilities/*.js']
};

gulp.task('lint', function() {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('concat', function() {
    gulp.src(['./public/js/app.js','./public/js/services.js'])
        .pipe(concat('app.all.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('templates', function() {
    gulp.src("./public/partials/*.html")
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "MyAwesomePartials",
            prefix: "partials/"
        }))
        .pipe(concat("partials.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/"));
});

gulp.task('develop', function () {
    nodemon({ script: 'server.js',
        ext: 'html js',
        ignore: ['node_modules/**']
    })
        .on('change', ['lint', 'templates']);
});

gulp.task('default', ['lint', 'concat', 'templates']);