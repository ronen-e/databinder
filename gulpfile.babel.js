import gulp from "gulp";
import babel from "gulp-babel";

gulp.task("default", () => {

  return gulp.src("scripts/es6/*")
	.pipe(babel())
	.pipe(gulp.dest("scripts/compiled"));

});
