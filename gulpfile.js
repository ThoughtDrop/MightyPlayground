var gulp = require('gulp');
var bower = require('bower');
var nodemon   = require('gulp-nodemon');
var bs = require('browser-sync');
var reload = bs.reload;
var inject = require('gulp-inject-string');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var del = require('del');
var clean = require('gulp-clean');
var $ = require('gulp-load-plugins')({lazy:true});
// var rename = require('gulp-rename');

var devPaths = {
  //sass: ['./scss/**/*.scss'],
  scripts: 'dev/js/*.js',
  templates: 'dev/templates/*.html',
  index: 'dev/*.html',
  styles: 'dev/css/*.css',
  test: 'specs/**/*.js'
};

var prodPaths = {
  //sass: ['./scss/**/*.scss'],
  scripts: 'www/js/*.js',
  templates: 'www/templates/*.html',
  index: 'www/*.html',
  styles: 'www/css/*.css'
};

var devPathArray = [devPaths.scripts, devPaths.templates, devPaths.index, devPaths.styles, devPaths.test];
var prodPathArray = [prodPaths.scripts, prodPaths.templates, prodPaths.index, prodPaths.styles];

//=========Watch Tasks=============
gulp.task('watchjs', function(){
  gulp.watch(devPaths.scripts, ['buildjs',bs.reload]);
});

gulp.task('buildjs', function(){
  return gulp.src(devPaths.scripts)
    .pipe(gulp.dest('www/js/'));
});

gulp.task('watchcss', function(){
  gulp.watch(devPaths.styles, ['buildcss', bs.reload]);
});

gulp.task('buildcss', function(){
  return gulp.src(devPaths.styles)
    .pipe(gulp.dest('www/css/'));
});

gulp.task('watchtemplates', function(){
  gulp.watch(devPaths.templates, ['buildtemplates', bs.reload]);
});

gulp.task('buildtemplates', function(){
  return gulp.src(devPaths.templates)
    .pipe(gulp.dest('www/templates/'));
});

gulp.task('watchindex', function(){
  gulp.watch(devPaths.index, ['buildindex',bs.reload]);
});

gulp.task('buildindex', function(){
  return gulp.src(devPaths.index)
    .pipe(gulp.dest('www/'));
});

//=================================


gulp.task('clean', function(){
  del(prodPathArray, function (err, deletedFiles){
    console.log('Files deleted:', deletedFiles.join(', '));
  });
});

  // gulp.task('clean', function(){
  //   gulp.src(prodPathArray)
  //     .pipe(clean());
  // });


gulp.task('inject1', function(){
  gulp.src('www/js/messageController.js')
    .pipe(replace('//base', "'https://mightyplayground.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});
gulp.task('inject2', function(){
  gulp.src('www/js/services.js')
    .pipe(replace('//base', "'https://mightyplayground.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});

gulp.task('ionic', shell.task([
  'ionic platform add ios',
  'ionic build ios',
  'ionic emulate ios --consolelogs --serverlogs'
]));

gulp.task('browser-sync', function() {
  bs({
    server: 'www',
    notify: true
  });
  bs.reload();
})

// start our node server using nodemon
gulp.task('serve', function() {
  nodemon({script: 'server/server.js', ignore: 'node_modules/**/*.js'});
});

//=====TEST=====
// gulp.task('karma', shell.task([
//   'karma start'
// ]));

gulp.task('build', function(){
  runSequence(
    'clean',
    'buildjs',
    'buildtemplates',
    'buildcss',
    'buildindex',
    'watchjs',
    'watchtemplates',
    'watchcss',
    'watchindex',
    ['inject1',
    'inject2'],
    // 'ionic-build',
    'browser-sync'
    )
});

gulp.task('help', $.taskListing);

gulp.task('default', ['build']);