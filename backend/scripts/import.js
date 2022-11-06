#!/usr/bin/env zx

import { argv, fs, question, path } from "zx";
import PocketBase from "pocketbase";

const client = new PocketBase("http://127.0.0.1:8090");

const { json, collection } = argv;

const email = await question("Admin email:")
const password = await question("Admin password:")
const { token } = await client.admins.authViaEmail(email, password);
const data = await fs.readJSON(path.join(process.cwd(), json))

for (let i = 0; i < data.length; i++) {
    const record = data[i];
    try {
        await client.records.create(collection, record);
    } catch (error) {
        console.error(error.message, record)
    }
}

// node .\scripts\import.js --json .\pb_public\countries.json --collection countries