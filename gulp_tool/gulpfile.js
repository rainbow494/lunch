var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var argv = require('yargs').argv;
var secrets = require('../encrpty/secrets.json');
var util = require('gulp-util');

var path = {
    backendPath : '../backend',
    website : '../website',
    distPath : '../dist',
    debug_distPath : '../debug-dist'
};

function setDebugEnv() {
    secrets.aws.hostname = 'localhost';
    path.distPath = path.debug_distPath;
}

if (argv.debug) {
    setDebugEnv();
}
/////////////////////////////////////////////////////////////////

gulp.task('lint', function () {
    return gulp.src(['*.js', '!node_modules/**'], {
        cwd : path.backendPath
    })
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
  return gulp.src(['project/style/*.less', '!node_modules/**'], {
        cwd : path.website
    })  
    .pipe(sourcemaps.init())
    .pipe(less().on('error', util.log))
    .on('error', function (error) {
        console.log(error.message);
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.distPath + '/website/project/style'));
});

gulp.task('clean-debug', function () {
    return del(['**',
            '!backend',
            '!backend/node_module',
            '!backend/node_modules/**',
            '!webSite',
            '!webSite/bower_components',
            '!webSite/bower_components/**'], {
        cwd : path.debug_distPath
    });
});

gulp.task('clean', function () {
    return del(['**'], {
        cwd : path.distPath
    });
});

gulp.task('backend', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(['**', '!node_modules/**'], {
        cwd : path.backendPath
    })
    .pipe(replace('<mailgun.api_key>', secrets.mailgun.api_key))
    .pipe(replace('<mailgun.domain>', secrets.mailgun.domain))
    .pipe(replace('<aws.hostname>', secrets.aws.hostname))
    .pipe(replace('<aws.webserver.port>', secrets.aws.webserver.port))
    .pipe(replace('<aws.mailserver.port>', secrets.aws.mailserver.port))
    .pipe(replace('<mongodb.hostname>', secrets.mongodb.hostname))
    .pipe(replace('<mongodb.port>', secrets.mongodb.port))
    .pipe(replace('<mongodb.dbname>', secrets.mongodb.dbname))
    .pipe(gulp.dest(path.distPath + '/backend'));
});

gulp.task('website', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(['**', '!bower_components/**'], {
        cwd : path.website
    })
    .pipe(replace('<aws.hostname>', secrets.aws.hostname))
    .pipe(replace('<aws.webserver.port>', secrets.aws.webserver.port))
    .pipe(gulp.dest(path.distPath + '/webSite'));
});

gulp.task('default',
    gulp.series('clean', 'backend', 'website', 'less'));

gulp.task('debug',
    gulp.series('clean-debug', 'backend', 'website', 'less'));

gulp.task('debug-watch', function () {
    setDebugEnv();
    
    var watcher_backend = gulp.watch(['*.js','*.html', '!node_modules/**'], {
            cwd : path.backendPath
        }, gulp.series('backend'));
        
    watcher_backend.on('change', function () {
        console.log('File ' + arguments[0] + ' was updated, running tasks...');
    });

    var watcher_website = gulp.watch(['**', '!project/style/*.less', '!bower_components/**'], {
            cwd : path.website
        }, gulp.series('website'));
        
    watcher_website.on('change', function () {
        console.log('File ' + arguments[0] + ' was updated, running tasks...');
    });

    var watcher_less = gulp.watch(['project/style/*.less', '!bower_components/**'], {
            cwd : path.website
        }, gulp.series('less'));

    watcher_less.on('change', function () {
        console.log('File ' + arguments[0] + ' was updated, running tasks...');
    });
});