var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

path = {
    backendPath : './backend'
}

gulp.task('jshint-g', function(){
    gulp.src(['backend/mailHelper.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('mocha-g', function(){
    gulp.src(['test/test_mailHelper.js'])
        .pipe(mocha());
})

gulp.task('default',['jshint-g', 'mocha-g'], function(){});