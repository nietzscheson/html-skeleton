'use strict';

    var gulp = require('gulp'),
        browserSync = require('browser-sync'),
        reload = browserSync.reload,
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        uglify = require('gulp-uglify'),
        plumber = require('gulp-plumber'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        copy = require('gulp-copy'),
        htmlreplace = require('gulp-html-replace');

    gulp.task('browser-sync', function(){

        browserSync.init({
            open: false,
            host: 'artesanus.skeleton',
            proxy: 'artesanus.skeleton',
            port: 4444
        });

    });

    function minifyCss(files, concatfiles, renamefile, destfile){
      return gulp.src(files)
          .pipe(concat(files))
          .pipe(rename(renamefile))
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest(destfile))
    }

    gulp.task('minify-css', function(){

      var to = 'dist',
          dest = to;

      minifyCss('styles/*.css', to, 'skeleton.min.css', dest);
      minifyCss('bower_components/**/*.css', to, 'vendors.min.css', dest);
    });

    function minifyJs(files, concatfiles, renamefile, destfile){

      return gulp.src(files)
        .pipe(plumber())
        .pipe(concat(concatfiles))
        .pipe(rename(renamefile))
        .pipe(uglify())
        .pipe(gulp.dest(destfile));
    }

    gulp.task('minify-js', function(){

        var to = 'dist',
            dest = to;

        minifyJs('scripts/*.js', to, 'skeleton.min.js', dest);
        minifyJs('bower_components/**/*.min.js', to, 'vendors.min.js', dest);
    });

    gulp.task('minify', ['minify-css','minify-js']);

    gulp.task('copy', function(){

        return gulp.src('index.html')
          .pipe(rename('index.min.html'))
          .pipe(htmlreplace({
                  'css': 'styles.min.css',
                  'js': 'js/bundle.min.js'
              }))
          .pipe(gulp.dest('./'))
        ;

    });

    gulp.task('build', ['minify','copy'], function(){});

    gulp.task('sass', function () {
        return gulp.src('styles/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('styles'))
          .pipe(browserSync.stream())
          ;
    });

    gulp.task('watch', function(){

      gulp.watch(['dist/*.css', '**/*.js', '**/*.html', '!gulpfile.js']).on('change', reload);
      gulp.watch('styles/*.sass', ['sass']);

    });

    gulp.task('default', ['browser-sync','watch'], function(){});
