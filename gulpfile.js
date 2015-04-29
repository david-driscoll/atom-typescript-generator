var gulp = require('gulp');
var childProcess = require('child_process');

/*require('coffee-script/register');
var Converter = require("./converter");
    new Converter.default().writeFiles();*/

gulp.task('convert', function() {
    childProcess.exec('node index.js');
})

gulp.task('watch', function() {
    gulp.watch(['**/*.js'], ['convert']);
})
