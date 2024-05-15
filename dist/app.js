"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const readline_1 = require("readline");
const fs_1 = require("fs");
const path_1 = require("path");
const rl = (0, readline_1.createInterface)(process.stdin, process.stdout);
function readLine(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            rl.question(prompt, resolve);
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let vertices = [];
        let edges = [];
        var filename = yield readLine('Inputfile name (leave empty for manual input): ');
        filename = filename.trim();
        var result = '';
        // Try reading from file
        if (filename != '') {
            filename = `../${filename}`; // Escape dist directory
            try {
                result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, filename), 'utf8');
                const lines = result.split('\n').map(line => line.trim());
                let lineIdx = 0;
                const vertCountStr = lines[lineIdx++];
                for (let i = 0; i < parseInt(vertCountStr); i++) {
                    const vertName = lines[lineIdx++];
                    if (vertices.includes(vertName)) {
                        console.error(`Vertex ${vertName} already registered!`);
                        i--;
                        continue;
                    }
                    vertices.push(vertName);
                }
                const edgeCountStr = lines[lineIdx++];
                for (let i = 0; i < parseInt(edgeCountStr); i++) {
                    const edge = lines[lineIdx++];
                    let [a, b] = edge.split(' ');
                    if (!vertices.includes(a)) {
                        console.error(`Vertex ${a} is not registered!`);
                        i--;
                        continue;
                    }
                    if (!vertices.includes(b)) {
                        console.error(`Vertex ${b} is not registered!`);
                        i--;
                        continue;
                    }
                    edges.push(new graph_1.Edge(a, b));
                }
            }
            catch (_a) {
                console.error(`Could not load file "${filename}"! Requesting manual input...`);
            }
        }
        // No valid file input provided, request manual input
        if (!result) {
            const vertCountStr = yield readLine('Number of vertices: ');
            for (let i = 0; i < parseInt(vertCountStr); i++) {
                const vertName = yield readLine(`\t${i + 1}. vertex: `);
                if (vertices.includes(vertName)) {
                    console.error(`Vertex ${vertName} already registered!`);
                    i--;
                    continue;
                }
                vertices.push(vertName);
            }
            const edgeCountStr = yield readLine('Number of edges: ');
            console.log('\t(Format: "x. edge: edge1 edge2")');
            for (let i = 0; i < parseInt(edgeCountStr); i++) {
                const edge = yield readLine(`\t${i + 1}. edge: `);
                let [a, b] = edge.split(' ');
                if (!vertices.includes(a)) {
                    console.error(`Vertex ${a} is not registered!`);
                    i--;
                    continue;
                }
                if (!vertices.includes(b)) {
                    console.error(`Vertex ${b} is not registered!`);
                    i--;
                    continue;
                }
                edges.push(new graph_1.Edge(a, b));
            }
        }
        let graph = new graph_1.Graph(vertices, edges);
        let eulerWalk = graph.getEulerWalk();
        if (eulerWalk !== null)
            console.log('Euler walk found: ', eulerWalk);
        else
            console.log('Euler walk not found!');
        let hamiltonWalk = graph.getHamiltonWalk();
        if (hamiltonWalk !== null)
            console.log('Hamilton walk found: ', hamiltonWalk);
        else
            console.log('Hamilton walk not found!');
    });
}
main().then(_ => rl.close());
//# sourceMappingURL=app.js.map