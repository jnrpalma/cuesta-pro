const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream(__dirname + "/dist/portal.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", function () {
  console.log(`ZIP criado: ${archive.pointer()} bytes`);
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

// Compacta a pasta `dist`
archive.directory(__dirname + "/dist/tsonpro/", false);

// Finaliza o processo de compactação
archive.finalize();
