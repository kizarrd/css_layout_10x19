import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ghPages from "gulp-gh-pages";

sass.compiler = require("node-sass");

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/styles1.scss",
    dest: "dist/css"
  },
  html: {
    src: "index.html",
    dest: "dist"
  },
  deploy: {
    src: "./dist/**/*"
  }
};

const ghDeploy = () =>
  gulp
    .src(routes.deploy.src)
    .pipe(ghPages());

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace"
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const template = () =>
    gulp
      .src(routes.html.src)
      .pipe(gulp.dest(routes.html.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
};

const clean = () => del(["dist/", ".publish/"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([styles, template]);

const live = gulp.parallel([watch]);

export const dev = gulp.series([prepare, assets, live]);
export const deploy = gulp.series([prepare, assets, ghDeploy]);
