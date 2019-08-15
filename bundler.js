const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    target: "browser@es6",
    output: "Dist/$name.js",
    plugins: [WebIndexPlugin()],
});
fuse.dev(); // launch http server
fuse
    .bundle("app")
    .instructions(" > index.ts")
    .hmr()
    .watch();
fuse.run();
//# sourceMappingURL=bundler.js.map