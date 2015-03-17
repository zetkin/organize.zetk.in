'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var runSequence = require('run-sequence');


gulp.task('cleanStatic', function() {
    return gulp.src('static/js/main.*js', {read:false}).pipe(clean());
});

gulp.task('cleanBuild', function() {
    return gulp.src('react/build', {read:false}).pipe(clean());
});

gulp.task('buildReact', function() {
    return gulp.src('react/app.jsx').pipe(react()).pipe(gulp.dest('react/build'));
});

gulp.task('bundle', function() {
    return browserify('./react/build/app.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./static/js'));
});

gulp.task('minify', function() {
    return gulp.src('./static/js/main.js')
        .pipe(uglify())
        .pipe('./static/js');
});

gulp.task('default', function() {
    return runSequence('cleanStatic', 'cleanBuild', 'buildReact', 'bundle');
});

gulp.task('deploy', function() {
    return runSequence('default', 'minify');
});
