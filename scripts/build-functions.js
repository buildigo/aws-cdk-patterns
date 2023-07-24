const fs = require('fs')
const esbuild = require('esbuild')
const rimraf = require('rimraf')
const glob = require('glob')
const path = require('path')
const esbuildPluginTsc = require('@emarketeer/esbuild-plugin-tsc')
const yauzl = require('yauzl-promise')
const {pipeline} = require('stream/promises')

clean()
  .then(() => allFunctions())
  .then(fns => debug('Compiling', fns))
  .then(fns => bundle({entryPoints: fns}))
  .then(_ => console.debug('Compiling done!'))
  .then(() => console.debug('Copying files...'))
  .then(() => copyFiles())
  .then(() => console.debug('Copying done!'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

function clean() {
  try {
    rimraf.sync('dist/functions')
  } catch (err) {
    return Promise.reject(err)
  }
  return Promise.resolve()
}

function debug(message, printable) {
  console.log(message, printable)
  return Promise.resolve(printable)
}

function functions(fns) {
  return Promise.resolve([...fns])
}

function allFunctions(args = {exclude: []}) {
  return new Promise((resolve, reject) => {
    glob('src/**/*.func.ts', {ignore: args.exclude}, (err, files) => {
      if (err) return reject(err)
      else return resolve(files)
    })
  })
}

function bundle(args = {entryPoints: []}) {
  const tsconfig = 'tsconfig.functions.json'
  // sharp is installed for linux and packaged with bundle
  const external = ['sharp']

  return esbuild.build({
    entryPoints: args.entryPoints,
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node18.13',
    tsconfig,
    external,
    outdir: 'dist/functions',
    entryNames: '[dir]/main',
    plugins: [esbuildPluginTsc({tsconfigPath: tsconfig})],
  })
}

async function copyFiles() {
  try {
    // custom built dependencies
    const sharpArchiveSource = 'src/patterns/image-cdn/layers/sharp/sharp-layer-fs.zip'
    const sharpArchiveDestination = 'dist/functions/forward-or-transform-image/sharp-layer-fs.zip'
    fs.copyFileSync(sharpArchiveSource, sharpArchiveDestination, fs.constants.COPYFILE_EXCL)
    // unzip dependencies
    await unzip(sharpArchiveDestination, 'dist/functions/forward-or-transform-image')
    // cleanup
    fs.rmSync(sharpArchiveDestination)
  } catch (err) {
    return Promise.reject(err)
  }
  return Promise.resolve()
}

async function unzip(archive, dest) {
  const zip = await yauzl.open(archive)
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(path.join(dest, entry.filename), {recursive: true})
      } else {
        const readStream = await entry.openReadStream()
        const writeStream = fs.createWriteStream(path.join(dest, entry.filename))
        await pipeline(readStream, writeStream)
      }
    }
  } finally {
    await zip.close()
  }
}
