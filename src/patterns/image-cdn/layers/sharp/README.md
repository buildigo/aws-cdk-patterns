# Image Transformer

In order to run image transformation, we use sharp. Sharp requires some native binaries. These binaries are installed
on `npm install` for the current platform. When running on lambda, sharp binaries must be built for amazon linux.

The [lambda-layer-sharp](https://github.com/buildigo/lambda-layer-sharp) project is responsible to prepare the sharp
binaries and node modules needed for running on linux. It releases a simple zip file with the node_modules that can be
packaged with any lambda function.
It could also be provided as a lambda layer. In the case of lambda@edge, lambda layers aren't supported.

`sharp-layer-fs.zip` comes directly from the releases of
the [lambda-layer-sharp](https://github.com/buildigo/lambda-layer-sharp) project.

## How to update

- Open the [lambda-layer-sharp](https://github.com/buildigo/lambda-layer-sharp) project
- Update the sharp version in `package.json` to match the new version in this project
- Follow the lambda-layer-sharp readme to build a new layer
- Copy in this folder sharp-layer-fs.zip generated in the dist folder of lambda-layer-sharp