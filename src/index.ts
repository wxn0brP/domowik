#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { execSync, spawn } from "child_process";

const FILE = join(process.env.HOME!, ".local", "domowik.json");

function loadStore(): Record<string, string> {
    if (!existsSync(FILE)) return {};
    try {
        return JSON.parse(readFileSync(FILE, "utf8"));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

function saveStore(data: Record<string, string>) {
    const dir = dirname(FILE);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(FILE, JSON.stringify(data, null, 2));
}

const args = process.argv.slice(2);
const [cmd, key, value] = args;

const store = loadStore();

function usage(text: string) {
    console.log(`Usage: domowik ${text}`);
    process.exit(1);
}

switch (cmd) {
    case "set": {
        if (!key || !value) usage("set <key> <value>");
        store[key] = value;
        saveStore(store);
        console.log("OK");
        break;
    }

    case "get": {
        if (!key) usage("get <key>");
        console.log(store[key] ?? "");
        break;
    }

    case "copy": {
        if (!key) usage("copy <key>");
        const data = store[key] ?? "";
        if (data) {
            execSync(`wl-copy "${data}"`);
            console.log("Copied to clipboard");
        }
        else
            console.log("No data");
        break;
    }

    case "list": {
        Object.keys(store).forEach(k => console.log(k));
        break;
    }

    case "export": {
        if (!key) usage("export <pattern>");
        const regex = new RegExp("^" + key.replace("*", ".*") + "$");
        for (const k of Object.keys(store)) {
            if (regex.test(k)) {
                const envKey = k.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
                console.log(`${envKey}=${store[k]}`);
            }
        }
        break;
    }

    case "export-sh": {
        if (!key) usage("export-sh <pattern>");
        const regex = new RegExp("^" + key.replace("*", ".*") + "$");
        for (const k of Object.keys(store)) {
            if (regex.test(k)) {
                const envKey = k.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
                console.log(`export ${envKey}="${store[k]}"`);
            }
        }
        break;
    }

    case "rm": {
        if (!key) usage("rm <key>");
        delete store[key];
        saveStore(store);
        console.log("OK");
        break;
    }

    default:
        console.log("Commands:");
        console.log("  set <k> <v>");
        console.log("  get <k>");
        console.log("  copy <k>");
        console.log("  list");
        console.log("  export <pattern>       # dotenv format");
        console.log("  export-sh <pattern>    # shell export format");
        console.log("  rm <k>");
        process.exit(1);
}
