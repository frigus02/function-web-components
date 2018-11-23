// Browser-sync config
// Docs: http://www.browsersync.io/docs/options/

module.exports = {
    watch: true,
    server: {
        baseDir: "demo",
        routes: {
            "/lib/lit-html/": "node_modules/lit-html/",
            "/lib/functional-web-components/": "src/"
        }
    },
    files: ["src/**/*", "demo/**/*"]
};
