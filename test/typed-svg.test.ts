import webpack from "webpack";
import { TypedSVGWebpackPlugin } from "../src/index";
import path from "path";
import fs from "fs-extra";

const svgDeclaration = path.join(__dirname, "sprite.svg.d.ts");

const deleteSvgDeclaration = () => {
  fs.removeSync(svgDeclaration);
};

beforeEach(deleteSvgDeclaration);
afterEach(deleteSvgDeclaration);

it("Should generate types declaration", async () => {
  let done: (value?: unknown) => void;

  const webpackFinished = new Promise(resolve => {
    done = resolve;
  });

  webpack(
    {
      plugins: [new TypedSVGWebpackPlugin()],
      entry: {
        main: path.join(__dirname, "addSvg.ts"),
      },
      resolve: {
        extensions: [".js", ".ts", ".svg"],
      },
      module: {
        rules: [
          {
            test: /\.(woff2|png|gif|svg|jpg)$/,
            use: {
              loader: "file-loader",
            },
          },
        ],
      },
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        throw new Error(stats.toString());
      }
      done();
    }
  );

  await webpackFinished;

  expect(fs.readFileSync(svgDeclaration).toString()).toMatchSnapshot();
});
