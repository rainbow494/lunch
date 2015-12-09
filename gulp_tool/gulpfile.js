var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');

path = {
    backendPath : '../backend',
    website : '../website',
    distPath: '../dist'
};

gulp.task('lint', function(){
    gulp.src(['*.js', '!node_modules/**'],{cwd:path.backendPath})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
	del.sync(['**'], {cwd:path.distPath});
});


gulp.task('backend', function() {
	// Minify and copy all JavaScript (except vendor scripts) 
	// with sourcemaps all the way down 
    return gulp.src(['**', '!node_modules/**'],{cwd:path.backendPath})
        .pipe(gulp.dest(path.distPath + '/backend'));
});

gulp.task('website', function() {
	// Minify and copy all JavaScript (except vendor scripts) 
	// with sourcemaps all the way down 
    return gulp.src(['**', '!bower_components/**'],{cwd:path.website})
        .pipe(gulp.dest(path.distPath + '/webSite'));
});

gulp.task('default',['clean', 'backend', 'website'], function(){});