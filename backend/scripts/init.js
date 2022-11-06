#!/usr/bin/env zx
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util'
import fetch from 'node-fetch';
import os from 'os';
import { $ } from 'zx';

const streamPipeline = promisify(pipeline);

const osMap = { "linux": "linux", "win32": "windows", "darwin": "darwin" }
const version = "0.7.10"
const arch = "amd64"

const getLink = (version, os, arch) => `https://github.com/pocketbase/pocketbase/releases/download/v${version}/pocketbase_${version}_${os}_${arch}.zip`
const downloadLink = getLink(version, osMap[os.platform()], arch)
console.info("Downloading...")
console.info(downloadLink)
const response = await fetch(downloadLink);
console.info("ok", response.ok)
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

await streamPipeline(response.body, createWriteStream('./pocketbase.zip'));

try {
    await $`mkdir pb_public`
} catch (error) {
    console.error(error.message)
}
