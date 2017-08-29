const path = require("path");
const util = require("util");
const gulp = require("gulp");
const pug = require("gulp-pug");
const stripDebug = require("gulp-strip-debug");
const gulpLess = require("gulp-less");
const uglify = require("gulp-uglify");
const minify = require("gulp-minify");
const browserSync = require("browser-sync");
const del = require("del")

const CSS_PATH = path.join(__dirname, "dist", "css")
const JS_PATH = path.join(__dirname, "dist", "js")

gulp.task("pug", () => {
  return gulp
    .src(["src/views/*.pug", "!src/views/layout.pug"])
    .pipe(pug())
    .pipe(gulp.dest(__dirname))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("less", () => {
  util.log("====================>> less start");
  return gulp
    .src("src/less/**/*.less")
    .pipe(gulpLess())
    .pipe(gulp.dest(CSS_PATH))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// gulp.task("jsMove", () => {
//   return gulp
//     .src("src/js/**/*.json")
//     .pipe(gulp.dest(JS_PATH))
// });

gulp.task("jsProd", () => {
  console.log('=== jsProd')
  return gulp
    .src("src/js/**/*")
    .pipe(uglify())
    .pipe(minify())
    .pipe(gulp.dest(JS_PATH))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("browserSync", function(){
  browserSync({
    server:{
      baseDir: "./"
    }
  })
});

gulp.task("watch", ["browserSync"], function () {
  gulp.watch(["src/**/*.less", "src/**/*.js"], ["less", "jsProd"]);
  gulp.watch(["src/**/*.pug"], ["pug"]);
});

// build
gulp.task("build", ["pug", "less", "jsProd"]);

// dev
gulp.task("default", ["watch", "build"]);

// clean
gulp.task("clean", function(callback) {
  del(["dist/js/**/*.js", "dist/css/**/*.css"], callback);
});
