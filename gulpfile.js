'use strict';

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var jsxcs = require('gulp-jsxcs');
var newer = require('gulp-newer');
var react = require('gulp-react');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');


const babelConfig = {
    stage: 1,
};

const jsSrc = 'src/js/**/*.@(js|jsx)';
const jsDest = 'dist/organize.zetk.in';

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

gulp.task('cleanTemplates', function(cb) {
    return del([
        'dist/templates',
    ], cb);
});

gulp.task('clean', function(cb) {
    return runSequence('cleanImages', 'cleanTemplates', 'cleanSass', cb);
});

gulp.task('copyTemplates', function() {
    return gulp.src('./templates/**/*.html')
        .pipe(gulp.dest('./dist/templates'));
});

gulp.task('js', function() {
    const newerConfig = {
        dest: jsDest,
        ext: '.js'
    };

    return gulp.src(jsSrc)
        .pipe(newer(newerConfig))
        .pipe(babel(babelConfig))
        .pipe(gulp.dest(jsDest));
});

gulp.task('bundleJs', [ 'js' ], function(cb) {
    webpack(webpackConfig, function(err, stats) {
        if (err) {
            console.log('WEBPACK ERROR: ' + err);
        }

        cb();
    });
});

gulp.task('buildSass', [ 'cleanSass' ], function() {
    return gulp.src([
            'src/scss/_mixins.scss',
            'src/scss/_variables.scss',
            'src/scss/_helpers.scss',
            'src/scss/font-awesome/zetkin-font-awesome.scss',
            'src/scss/_global.scss',
            'src/scss/_base.scss',
            'src/scss/_medium.scss',
            'src/!(scss)/**/*.scss',
        ])
        .pipe(concat('style.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist/static/css'));
});

gulp.task('minifyImages', [ 'cleanImages' ], function() {
    return gulp.src('assets/images/*')
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
    return gulp.src('src/**/*.@(js|jsx)')
        .pipe(jsxcs())
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        });
});

gulp.task('watch', function() {
    watch('src/**/*.@(js|jsx)', function() {
        return runSequence('bundleJs', 'restartDevServer');
    });

    watch('src/**/*.scss', function() {
        return runSequence('buildSass');
    });

    watch('assets/images/**/*', function() {
        return runSequence('minifyImages');
    });

    watch('templates/**/*', function() {
        return runSequence('copyTemplates');
    });
});

gulp.task('deploy', [ 'default' ], function(cb) {
    return runSequence('minify', cb);
});
