import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

gulp.task('default', () => {
	
	var entries = [
		'scripts/es6/databinder.databinder.js',
		'scripts/es6/databinder.bindings.js',
		'scripts/es6/databinder.viewmodel.js'
	];
  return gulp.src(entries)
	.pipe(sourcemaps.init())
	.pipe(concat('bundle.js'))
	.pipe(babel())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest("scripts/compiled"));
});
