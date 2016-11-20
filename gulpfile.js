"use strict";

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const clean = require('gulp-dest-clean');
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

// COPY

gulp.task('copy:images', function () {
    return gulp.src('./source/images/*')
        .pipe(clean('./public/img'))
        .pipe(gulp.dest('./public/img'))
});

gulp.task('copy:svg', function () {
    return gulp.src('./source/svg/*')
        .pipe(clean('./public/svg'))
        .pipe(gulp.dest('./public/svg'))
});

gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/*')
        .pipe(clean('./public/fonts'))
        .pipe(gulp.dest('./public/fonts'))
});

// WATCH

gulp.task('watch', function () {
  gulp.watch('./style/**/*.scss', gulp.series('scss'));
  gulp.watch('./views/**/*.pug', gulp.series('pug'));
  gulp.watch('./source/images/*', gulp.series('copy:images'));
  gulp.watch('./source/svg/*', gulp.series('copy:svg'));
  gulp.watch('./source/fonts/*', gulp.series('copy:fonts'));
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
    'pug',
    'copy:images',
    'copy:svg',
    'copy:fonts'
  ),
  gulp.parallel(
    'watch',
    'browser-sync'
  ))
);