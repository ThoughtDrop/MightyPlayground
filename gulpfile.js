var gulp = require('gulp');
var bower = require('bower');
var nodemon   = require('gulp-nodemon');
var bs = require('browser-sync');
var reload = bs.reload;

// var gutil = require('gulp-util');
// var concat = require('gulp-concat');
// var sass = require('gulp-sass');
// var minifyCss = require('gulp-minify-css');
// var rename = require('gulp-rename');
// var sh = require('shelljs');

var paths = {
  //sass: ['./scss/**/*.scss'],
  scripts: ['www/js/*.js'],
  html: ['www/templates/*.html', 'www/index.html'],
  styles: ['www/css/*.css'],
  test: ['specs/**/*.js']
};

gulp.task('start', ['serve'],function () {
  bs({
    notify: true,
    // address for server,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8000'
  });
});

// start our node server using nodemon
gulp.task('serve', function() {
  nodemon({script: 'server/server.js', ignore: 'node_modules/**/*.js'});
});

gulp.task('default', ['start']);
