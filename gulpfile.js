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
        nunjucksRender = require('gulp-nunjucks-render'),
        data = require('gulp-data');

    gulp.task('browser-sync', function(){

        browserSync.init({
            open: false,
            host: 'html.skeleton',
            proxy: 'html.skeleton',
            port: 4444
        });

    });

    gulp.task('nunjucks', function() {
        return gulp.src('app/pages/**/*.+(html|nunjucks)')
            // Adding data to Nunjucks
            .pipe(data(function() {
                return require('./app/data.json')
            }))
            .pipe(nunjucksRender({
                path: ['app/templates']
            }))
            .pipe(gulp.dest('build'))
    });

    function minifyCss(files, concatfiles, renamefile, destfile){
      return gulp.src(files)
          .pipe(concat(files))
          .pipe(rename(renamefile))
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest(destfile))
    }

    gulp.task('minify-css', function(){

      var to = 'build/assets/vendors/',
          dest = to;

      //minifyCss('styles/*.css', to, 'skeleton.min.css', dest);
      minifyCss('bower_components/**/*.min.css', to, 'vendors.min.css', dest);
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

        var to = 'build/assets/vendors/',
            dest = to;

        minifyJs('bower_components/**/*.min.js', to, 'vendors.min.js', dest);
    });

    gulp.task('minify', ['minify-css','minify-js']);

    gulp.task('fonts', function(){
        return gulp.src([
                'bower_components/font-awesome/fonts/fontawesome-webfont.*'])
            .pipe(gulp.dest('build/assets/fonts/'));
    });

    gulp.task('images', function(){

        return gulp.src('./app/images')
                   .pipe(gulp.dest('./build'))
            ;
    });

    gulp.task('sass', function () {
        return gulp.src('app/styles/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('build/assets'))
          .pipe(browserSync.stream())
          ;
    });

    gulp.task('build', ['minify', 'nunjucks', 'fonts', 'images', 'sass'], function(){});

    gulp.task('watch', function(){

      gulp.watch(['build/**/*.html', '!gulpfile.js']).on('change', reload);
      gulp.watch('styles/*.sass', ['sass']);
      gulp.watch('app/**/*.html', ['nunjucks']);

    });

    gulp.task('default', ['browser-sync','watch'], function(){});
