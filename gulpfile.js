var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  return gulp.src(['assets/js/vendor/*.js','assets/js/*.js'])
  	.pipe(sourcemaps.init())
    .pipe(concat('default.min.js'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/js/'));
});

//gulp.task('compress', function() {
//  return gulp.src('assets/js/*.js')
//    .pipe(uglify())
//    .pipe(gulp.dest('/'));
//});


gulp.task('sass', function () {
  return gulp.src('assets/sass/**/*.sass')
  	.pipe(sourcemaps.init({
  		loadMaps: false,
  		debug: false
  	}))
    .pipe(sass({ 
    	outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write('/')) 
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream())
});

gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch(['assets/sass/*.sass','assets/sass/**/*.sass'], ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('jade', function() {
  gulp.src('_jade/*.jade')
    .pipe(jade({
    	pretty:true
    }))
    .pipe(gulp.dest('_site'))
});

// gulp.task('watch', function() {
//  gulp.watch(['assets/sass/*.sass','assets/sass/**/*.sass'], ['sass']);
  // gulp.watch(['assets/js/**/*.js','assets/js/*.js'], ['scripts','compress']);
  // gulp.watch(['_jade/*.jade', '_jade/**/**/*.jade'], ['jade']);
  // gulp.watch(['_site/*.html'], ['rebuild']);
// });

gulp.task('default', ['browser-sync']);  