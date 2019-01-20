// Browser-sync config
// Docs: http://www.browsersync.io/docs/options/

module.exports = {
    watch: true,
    server: {
        baseDir: "example",
        routes: {
            "/lib/lit-html/": "node_modules/lit-html/",
            "/lib/function-web-components/": "dist/",
        },
    },
    files: ["src/**/*", "example/**/*"],
};
