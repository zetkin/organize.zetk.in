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

var dockerContainer = process.env.ZETKIN_CONTAINER_NAME;

const jsSrc = 'src/**/*.@(js|jsx)';
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

gulp.task('cleanFonts', function(cb) {
    return del([
        'dist/static/fonts',
    ], cb);
});

gulp.task('clean', function(cb) {
    return runSequence('cleanImages', 'cleanFonts', 'cleanSass', cb);
});

gulp.task('copyFonts', function() {
    return gulp.src('./assets/fonts/**/*')
        .pipe(gulp.dest('./dist/static/fonts'));
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
            'src/scss/font-awesome/zetkin-font-awesome.scss',
            'src/scss/_global.scss',
            'src/!(scss)/**/*.scss',

            // TODO: Replace with webpack loading
            'node_modules/medium-editor/dist/css/medium-editor.css',
            'node_modules/medium-editor/dist/css/themes/default.css',
        ])
        .pipe(concat('style.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist/static/css'));
});

gulp.task('minifyImages', [ 'cleanImages' ], function() {
    return gulp.src('assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/static/img'));
});

gulp.task('restartDevServer', shell.task([
    'docker exec ' + dockerContainer + ' sv restart organize.zetk.in'
]));

gulp.task('minify', function() {
    return gulp.src('dist/static/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/static/js'));
});

gulp.task('default', [ 'clean' ], function(cb) {
    return runSequence('bundleJs', 'buildSass', 'minifyImages', 'copyFonts', cb);
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
    if (!dockerContainer) {
        throw 'Missing variable ZETKIN_CONTAINER_NAME';
    }

    watch('src/**/*.@(js|jsx)', function() {
        return runSequence('bundleJs', 'restartDevServer');
    });

    watch('src/**/*.scss', function() {
        return runSequence('buildSass');
    });

    watch('assets/images/**/*', function() {
        return runSequence('minifyImages');
    });

    watch('assets/fonts/**/*', function() {
        return runSequence('copyFonts');
    });
});

gulp.task('deploy', [ 'default' ], function(cb) {
    return runSequence('minify', cb);
});
