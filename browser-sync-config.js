// Browser-sync config
// Docs: http://www.browsersync.io/docs/options/

module.exports = {
    watch: true,
    server: {
        baseDir: "example",
        routes: {
            "/lib/function-web-components/": "dist/",
            "/lib/lighterhtml/": "node_modules/lighterhtml/",
            "/lib/lit-html/": "node_modules/lit-html/",
        },
    },
    files: ["src/**/*", "example/**/*"],
};
