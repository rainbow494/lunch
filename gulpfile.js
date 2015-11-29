var gulp = require('gulp');
var jshint = require('gulp-jshint');

path = {
    backendPath : './backend'
}

gulp.task('lint', function(){
    gulp.src(['**', '!node_modules/**'],{cwd:path.backendPath})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('default',['lint'], function(){});