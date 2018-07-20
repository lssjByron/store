// Include gulp
var gulp = require('gulp');

// Include Plugins
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

// set destination base folder for NetBeans project
var destBase = "C:/Users/alpha_000/Documents/NetBeansProjects/APPOCase1/web";

// update the rest service with production server url
gulp.task("server-address-rest", function () {
    gulp.src(["./scripts/common/rest.service.js"])
        .pipe(replace("http://localhost:8080/APPOCase1/case1/", "case1/"))
        .pipe(gulp.dest("./scripts/common"));
});

// update the rest service with production server url
gulp.task("replace-popdf", function () {
    gulp.src(["./components/generator/generator.controller.js"])
        .pipe(replace("http://localhost:8080/APPOCase1/PDFSample?po=", "PDFSample?po="))
        .pipe(gulp.dest("./components/generator"));
});

// Copy content - css, img, fonts and index.html to NetBeans
gulp.task("copy-content", function () {
    gulp.src(["./css/**/*", "./img/**/*", "./fonts/**/*"], { base: "./" })
        .pipe(gulp.dest(destBase));
});

// Copy component Html to NetBeans
gulp.task("copy-html", function () {
    gulp.src("components/**/*.html")
        .pipe(gulp.dest(destBase + "/components"));
});

// Copy Scripts to NetBeans
gulp.task("copy-scripts", function () {
    gulp.src("scripts/**/*.min.js")
        .pipe(gulp.dest(destBase + "/scripts"));
});

// Copy production index.html from server folder to NetBeans
gulp.task("copyindex-html", function () {
    gulp.src("./server/index.html")
        .pipe(gulp.dest(destBase)).on('error',errorHandler);
});


// Concatenate & Minify application js to exercises.min.js 
gulp.task("scripts", function () {
    return gulp.src(["scripts/common/*.js", "components/**/*.js"])
        .pipe(concat("case1.min.js"))
        .pipe(gulp.dest(destBase + "/scripts"))
        .pipe(uglify())
        .pipe(gulp.dest(destBase + "/scripts"));
});
gulp.task("default", ["server-address-rest", "replace-popdf", "copyindex-html", "copy-html", "copy-content", "copy-scripts", "scripts"]);
// Watch Files For Changes
//gulp.task("watch", function() {
//    gulp.watch(["components/**/*.js","scripts/**/*.js"], ["scripts"]);
//});

// Default Task

function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}