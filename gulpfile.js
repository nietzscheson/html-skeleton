'use strict';

    var gulp = require('gulp'),
        browserSync = require('browser-sync'),
        reload = browserSync.reload,
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        uglify = require('gulp-uglify');

    gulp.task('browser-sync', function(){

        browserSync.init({
            open: false,
            host: 'artesanus.skeleton',
            proxy: 'artesanus.skeleton',
            port: 4444
        });

        gulp.watch(['dist/*.css', '**/*.js', '**/*.html', '!gulpfile.js']).on('change', reload);

        gulp.watch('styles/*.sass', ['sass']);
        gulp.watch('dist/*.css', ['minify']);

    });

    gulp.task('minify-css', function(){
        return gulp.src('styles/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('dist'))
    });

    gulp.task('minify', ['minify-css']);

    gulp.task('sass', function () {
        return gulp.src('styles/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('styles'))
          .pipe(browserSync.stream())
          ;
    });

    gulp.task('default', ['browser-sync'], function(){});
