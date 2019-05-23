"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");

var del = require("del")

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
		.pipe(gulp.dest("build/css"))
		.pipe(server.stream());
});

gulp.task("server", function() {
	server.init({
		server: "build/",
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
	gulp.watch("source/img/*.svg", gulp.series("refresh"));
	gulp.watch("source/*.html", gulp.series("refresh"));
});

gulp.task("refresh", function(done) {
	server.reload();
	done();
});


gulp.task("images", function() {
	return gulp.src("source/imgOriginal/**/*.{png,jpg,svg}")
		.pipe(plumber())
		.pipe(imagemin([
			imagemin.optipng({
				optimizationLevel: 3
			}),
			imagemin.jpegtran({
				progressive: true
			}),
			imagemin.svgo({
				plugins: [{
						optimizationLevel: 3
					},
					{
						progessive: true
					},
					{
						interlaced: true
					},
					{
						removeViewBox: false
					},
					{
						removeUselessStrokeAndFill: false
					},
					{
						cleanupIDs: false
					}
				]
			})
		]))
		.pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
	return gulp.src("source/imgOriginal/**/*.{png,jpg}")
		.pipe(plumber())
		.pipe(webp({
			quality: 90
		}))
		.pipe(gulp.dest("source/img"));
});

gulp.task("copy", function() {
	return gulp.src([
			"source/fonts/**/*.{woff,woff2}",
			"source/img/**",
			"source/js/**",
			"source/*.ico",
			"source/*.html",
		], {
			base: "source"
		})

		.pipe(gulp.dest("build"));

});

gulp.task("clean", function() {
	return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css"));
gulp.task("start", gulp.series("build", "server"));
