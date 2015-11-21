'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

// Add your require statements and gulp tasks here

gulp.task('clean', function () {
  return del(['./js/bundle.js'])
});

gulp.task('uglify', function() {
  return gulp.src('./js/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

gulp.task('lint', function() {
  return gulp.src('./js/bundle.js')
    .pipe(jshint({
      node: true
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('default',['build', 'uglify',], function () {
  return gulp.src('./js/bundle.js')
});

gulp.task('watch', function() {
  gulp.watch(['!./js/bundle.js', './js/*.js', './css/*.css', './templates/*.handlebars'], ['build'])
});
//

// Browserify
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var hbsfy = require('hbsfy');

var bundler = browserify({
  entries: ['./js/index.js'],
  debug: true,
  sourceType: 'module'
});

bundler.transform(hbsfy);
bundler.on('log', gutil.log); // output build logs to terminal

gulp.task('build', ['clean'], function () {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    // set output filename
    .pipe(source('/dist/bundle.js'))
    .pipe(gulp.dest('js'));
});

// API Server
var jsonServer = require('json-server');

var apiServer = jsonServer.create();
var router = jsonServer.router('db.json');

apiServer.use(jsonServer.defaults);
apiServer.use(router);

gulp.task('serve:api', function (cb) {
  apiServer.listen(3000);
  cb();
});

// Web Server
var serve = require('gulp-serve');

gulp.task('serve:web', serve({
  root: ['.'],
  port: 8000
}));

gulp.task('serve', ['serve:api', 'serve:web', 'watch'])