"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename")
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin")
var webp = require("gulp-webp")
var posthtml = require("gulp-posthtml")
var include = require("posthtml-include")
// var del = require("del")

gulp.task("css", function() {
	return gulp.src("source/sass/style.scss")
		.pipe(plumber())
		.pipe(sourcemap.init())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("source/css"))
		.pipe(server.stream());
});

gulp.task("server", function() {
	server.init({
		server: "source/",
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
	gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("images", function() {
	return gulp.src("source/img/**/*.{png,jpg,svg}")
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
	return gulp.src("source/img/**/*.{png,jpg}")
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest("source/img"));
});

gulp.task("html", function() {
	return gulp.src("source/*.html")
	.pipe(posthtml([
		include()
	]))

	.pipe(gulp.dest("source"));

});

gulp.task("copy", function() {
	return gulp.src([
		"source/fonts/**/*. {woff,woff2}",
		"source/img/**",
		"source/js/**",
		"source/*.ico",
	], {
		base: "source"
	})

	.pipe(gulp.dest("build"));

});

// gulp.task("clean", function() {
// 	return del("build");
// });

gulp.task("build", gulp.series("css", "html", "copy"));
gulp.task("start", gulp.series("css", "server"));
