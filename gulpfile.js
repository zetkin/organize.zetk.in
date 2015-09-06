'use strict';

var del = require('del');
var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var jsxcs = require('gulp-jsxcs');
var babel = require('gulp-babel');
var rename = require('gulp-rename');


var babelConfig = {
    stage: 1
};


gulp.task('cleanJs', function(cb) {
    return del([
        'dist/organize.zetk.in',
    ], cb);
});

gulp.task('cleanImages', function(cb) {
    return del([
        'dist/static/img',
    ], cb);
});

gulp.task('cleanSass', function(cb) {
    return del([
        'dist/static/css',
    ], cb);
});

gulp.task('clean', function(cb) {
    return runSequence('cleanJs', 'cleanImages', 'cleanTemplates', 'cleanSass', cb);
});

gulp.task('buildPlainJs', [ 'cleanJs' ], function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel(babelConfig))
        .pipe(gulp.dest('./dist/organize.zetk.in'));
});

gulp.task('buildJsx', [ 'buildPlainJs' ], function() {
    return gulp.src('./src/js/components/**/*.jsx')
        .pipe(babel(babelConfig))
        .pipe(rename(function(path) {
            path.extname = '.js'
        }))
        .pipe(gulp.dest('./dist/organize.zetk.in/components'));
});

gulp.task('bundleJs', [ 'buildJsx' ], function() {
    return browserify('./dist/organize.zetk.in/client/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./dist/static/js'));
});

gulp.task('buildSass', [ 'cleanSass' ], function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/static/css'));
});

gulp.task('minifyImages', [ 'cleanImages' ], function() {
    return gulp.src('assets/images/**/*.@(png|jpg|gif)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/static/img'));
});

gulp.task('restartDevServer', shell.task([
    'docker exec environment_zetkinorganize_1 sv restart organize.zetk.in'
]));

gulp.task('minify', function() {
    return gulp.src('dist/static/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/static/js'));
});

gulp.task('default', [ 'clean' ], function(cb) {
    return runSequence('bundleJs', 'buildSass', 'minifyImages', 'copyTemplates', cb);
});


gulp.task('lint', function() {
    return gulp.src('src/js/**/*.@(js|jsx)')
        .pipe(jsxcs())
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        });
});

gulp.task('watch', function() {
    watch('src/js/**/*', function() {
        return runSequence('bundleJs', 'restartDevServer');
    });

    watch('src/scss/**/*.scss', function() {
        return runSequence('buildSass');
    });

    watch('assets/images/**/*', function() {
        return runSequence('minifyImages');
    });
});

gulp.task('deploy', [ 'default' ], function(cb) {
    return runSequence('minify', cb);
});
