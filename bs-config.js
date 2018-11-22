// Browser-sync config
// Docs: http://www.browsersync.io/docs/options/

module.exports = {
    watch: true,
    server: {
        baseDir: "demo",
        routes: {
            "/lib/functional-web-components.js": "index.js"
        }
    },
    files: ["index.js", "demo/**/*"]
};
