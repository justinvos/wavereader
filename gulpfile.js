var gulp = require("gulp")
var gulpDoc = require("gulp-documentation")

gulp.task("doc", function() {
  return gulp.src("wavereader.js")
    .pipe(gulpDoc("md", {filename: "jsdoc.md"}))
    .pipe(gulp.dest("."))
})
