import webpack from "webpack";
import { DOMParser } from "xmldom";
import fs from "fs-extra";
import eol from "eol";

export class TypedSVGWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tap(
      "CompileSvgSprite",
      (compilation: webpack.compilation.Compilation) => {
        const sprites = [
          ...compilation.fileDependencies,
        ].filter((fileName: string) => fileName.endsWith("sprite.svg"));

        sprites.forEach(filePath => {
          const domParser = new DOMParser();
          const doc = domParser.parseFromString(
            fs.readFileSync(filePath).toString(),
            "image/svg+xml"
          );

          const ids = Array.from(
            doc.getElementsByTagName("symbol")
          ).map(symbol => symbol.getAttribute("id"));

          fs.writeFileSync(
            `${filePath}.d.ts`,
            eol.lf(
              `declare const _default: string;
export default _default;

export const symbol: ${ids.map(id => `"${id}"`).join(" | ")};
`
            )
          );
        });
      }
    );
  }
}
