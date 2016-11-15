"use strict";

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();


// Style

gulp.task('sass', function () {
  return gulp.src('./style/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 8 versions'], {cascade: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
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
  gulp.watch('./style/**/*.scss', gulp.series('sass'));
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
    'sass',
    'pug'
  ),
    'watch')
);