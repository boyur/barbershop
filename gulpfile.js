"use strict";

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

let scssLibs = [
    'style/plugins/normalize.css',
    'style/plugins/font-awesome.css'
];

// SCSS

gulp.task('scss', function () {
  return gulp.src('./style/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 8 versions'], {cascade: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('css-libs', function () {
    return gulp.src(scssLibs)
        .pipe(concat('foundation.css'))
        .pipe(csso('foundation.css'))
        .pipe(gulp.dest('./public/css'))
});

// PUG

gulp.task('pug', function buildHTML() {
  return gulp.src('views/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./public'));
});

// WATCH

gulp.task('watch', function () {
  gulp.watch('./style/**/*.scss', gulp.series('scss'));
  gulp.watch('./views/**/*.pug', gulp.series('pug'));
});

// SERVER

gulp.task('browser-sync', function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch("public/css/*.css").on('change', browserSync.reload);
    gulp.watch("public/*.html").on('change', browserSync.reload);
});


gulp.task('default', gulp.series(
  gulp.parallel(
    'scss',
    'css-libs',
    'pug'
  ),
    'watch')
);