import webpack from "webpack";
import { TypedSVGWebpackPlugin } from "../src/index";
import path from "path";

it("Should generate types deceleration", async () => {
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
});
