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
        htmlreplace = require('gulp-html-replace'),
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

        //minifyJs('scripts/*.js', to, 'skeleton.min.js', dest);
        minifyJs('bower_components/**/*.min.js', to, 'vendors.min.js', dest);
    });

    gulp.task('minify', ['minify-css','minify-js']);

    gulp.task('copy-awesome-fonts', function(){
        return gulp.src('bower_components/font-awesome/fonts/*')
          .pipe(gulp.dest('./build/assets/vendors/fonts/'))
        ;
    });

/*    gulp.task('copy', function(){

        return gulp.src('index.html')
          .pipe(rename('index.html'))
          .pipe(htmlreplace({
                  'css': 'styles/skeleton.min.css',
                  'js': 'scripts/skeleton.min.js'
              }))
          .pipe(gulp.dest('./dist'))
        ;

    });
*/
    //gulp.task('build', ['minify','copy', 'copy-awesome-fonts'], function(){});
    gulp.task('build', ['minify', 'nunjucks', 'copy-awesome-fonts', 'sass'], function(){});

    gulp.task('sass', function () {
        return gulp.src('styles/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('build/assets'))
          .pipe(browserSync.stream())
          ;
    });

    gulp.task('watch', function(){

      //gulp.watch(['dist/*.css', '**/*.js', '**/*.html', '!gulpfile.js']).on('change', reload);
      gulp.watch(['build/**/*.html', '!gulpfile.js']).on('change', reload);
      gulp.watch('styles/*.sass', ['sass']);
      gulp.watch('app/**/*.html', ['nunjucks']);

    });

    gulp.task('default', ['browser-sync','watch'], function(){});
