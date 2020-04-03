var {src,dest,series,parallel,watch} = require('gulp');
var autoprefixer =  require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var postcss = require("gulp-postcss");
// var cssnano = require('gulp-cssnano');//minify the concatenated CSS file
var minifyCSS = require('gulp-minify-css');
var uglify = require("gulp-uglify");
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync').create();

// file path variables

const files = {
    cssPath : "app/css/**/*.css",
    jsPath : "app/js/**/*.js",
    imagePath : "app/images/*"
}

// css task

function cssTask()
{
    return src(files.cssPath)
            .pipe(sourcemaps.init())
           // .pipe(postcss([ autoprefixer, cssnano ]))
           .pipe(minifyCSS({keepSpecialComments : 1}))
            .pipe(sourcemaps.write('.'))
            .pipe(dest('dist'))
            .pipe(browserSync.stream())
}

// js Task
function jsTask()
{
    return src(files.jsPath)
            .pipe(uglify())
            .pipe(dest('dist'))
}

// image Task
function ImageTask()
{
    return src(files.imagePath)
            .pipe(imagemin({progressive : true}))
            .pipe(dest('dist/images'))
}
// watch Task
function watchTask()
{
    // watch([files.cssPath, files.jsPath],
    //     parallel(cssTask,jsTask));
    browserSync.init({
        server:{
            baseDir : './'
        }
    });
    watch(files.cssPath , cssTask);
    watch('./*.html').on('change',browserSync.reload);
    watch(files.jsPath).on('change',browserSync.reload);
    watch(files.imagePath, ImageTask);
}

//default Task
exports.default = series(
    parallel(ImageTask,cssTask,jsTask),
    watchTask
)