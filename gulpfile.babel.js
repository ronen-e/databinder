import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

gulp.task('bundle', () => {
    return rollup('rollup.config.js')
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('scripts/compiled'));
});

gulp.task('watch', () => {
    gulp.watch('scripts/es6/**/*.js', ['bundle']);
});

gulp.task('build', ['bundle']);
gulp.task('dev', ['bundle', 'watch']);
