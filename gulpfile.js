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
  scripts: 'dev/js/**/*.js',
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

gulp.task('copylib', function(){
  return gulp.src('dev/lib/**/*.*')
    .pipe(gulp.dest('www/lib/'));
});

gulp.task('copyimg', function(){
  return gulp.src('dev/img/**/*.*')
    .pipe(gulp.dest('www/img/'));
});

gulp.task('clean', function(){
  del(prodPathArray, function (err, deletedFiles){
    console.log('Files deleted:', deletedFiles.join(', '));
  });
});

  // gulp.task('clean', function(){
  //   gulp.src(prodPathArray)
  //     .pipe(clean());
  // });

//===========INJECTIONS===========
gulp.task('inject1', function(){
  gulp.src('www/js/messageController.js')
    .pipe(replace('//base', "'https://mightyplayground-test.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});
gulp.task('inject2', function(){
  gulp.src('www/js/services.js')
    .pipe(replace('//base', "'https://mightyplayground-test.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});

gulp.task('inject3', function(){
  gulp.src('www/js/privateServices.js')
    .pipe(replace('//base', "'https://mightyplayground-test.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});

gulp.task('inject4', function(){
  gulp.src('www/js/privateController.js')
    .pipe(replace("var creator = 'p3tuh';", "var creator = $localStorage.userInfo.name; //get user's name from local storage"))
    .pipe(replace(" var userPhone = 5104732806; //CHNAGE THIS BACK, ONLY FOR TESTING!!", "var userPhone = $localStorage.userInfo.phoneNumber;"))
    .pipe(replace("$scope.recipients = [5104732806]; ", "$scope.recipients = [];"))
    .pipe(gulp.dest('www/js'));
});

gulp.task('inject5', function() {
  gulp.src('www/js/privateMessages/privateDetailServices.js')
    .pipe(replace('//base', "'https://mightyplayground-test.herokuapp.com' +"))
    .pipe(gulp.dest('www/js/privateMessages'));
});

gulp.task('inject6', function() {
  gulp.src('www/js/privateMessages/privateDetailController.js')
    .pipe(replace("var creator = 'p3tuh'", "var creator = $localStorage.userInfo.name;"))
    .pipe(gulp.dest('www/js/privateMessages'));
});

gulp.task('inject7', function() {
  gulp.src('www/js/messageDetailController.js')
    .pipe(replace('//base', "'https://mightyplayground-test.herokuapp.com' +"))
    .pipe(gulp.dest('www/js'));
});

gulp.task('ionic', shell.task([
  'ionic platform remove ios',
  'ionic platform add ios',
  'ionic build ios',
  'open platforms/ios/myApp.xcodeproj'
]));

//change to route to your android sdk. 
gulp.task('android', shell.task(
    'export ANDROID_HOME="/Users/henrywong/Development/adt-bundle-mac-x86_64-20140702/sdk"',
    'export ANDROID_TOOLS="/Users/<user_name>/Library/Android/sdk/tools/"',
    'export ANDROID_PLATFORM_TOOLS="/Users/henrywong/Development/adt-bundle-mac-x86_64-20140702/sdk/platform-tools"',
    'PATH=$PATH:$ANDROID_HOME:$ANDROID_TOOLS:$ANDROID_PLATFORM_TOOLS',
    'ionic platform add android',
    'ionic build android',
    'ionic run android',
    'ionic emulate android'
));

gulp.task('browser-sync', function() {
  bs({
    server: 'dev',
    notify: true
  });
  bs.reload();
});

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
    'copylib',
    'copyimg',
    'watchjs',
    'watchtemplates',
    'watchcss',
    'watchindex',
    ['inject1',
    'inject2',
    'inject3',
    'inject4',
    'inject5',
    'inject6',
    'inject7',],
    // 'ionic-build',
    // 'browser-sync'
    'serve',
    'ionic'
    );
});

gulp.task('default', ['build']);