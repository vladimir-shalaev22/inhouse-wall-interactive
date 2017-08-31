import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import autoprefixer from 'gulp-autoprefixer';

gulp.task('sass', () => {
  return gulp.src('src/sass/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest('public/js'));
});

gulp.task('libs', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js'
  ]).pipe(concat('libs.min.js'))
  .pipe(gulp.dest('public/js'));
});

gulp.task('svg', () => {
  return gulp.src('src/svg/*.svg')
  .pipe(svgSprite({
    mode: { symbol: { dest: './', sprite: 'icons.svg', inline: true } }
  }))
  .pipe(gulp.dest('public/img'));
});

gulp.task('watch', ['js', 'sass', 'svg'], () => {
  browserSync.init({
    server:  { baseDir: 'public' }
  });
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/js/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch('public/*.html').on('change', browserSync.reload);
  gulp.watch('src/svg/*.svg', ['svg'], browserSync.reload);
});
