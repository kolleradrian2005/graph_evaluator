import { Edge, Graph, vertexname } from "./graph";
import { createInterface, Interface } from "readline";
import { readFileSync } from 'fs'
import { join } from 'path'

const rl: Interface = createInterface(process.stdin, process.stdout)

async function readLine(prompt: string): Promise<string> {
    return new Promise(resolve => {
        rl.question(prompt, resolve)
    })
}

async function main() {
    let vertices: string[] = []
    let edges: Edge<vertexname>[] = []
    var filename: string = await readLine('Inputfile name (leave empty for manual input): ')
    filename = filename.trim()
    var result = ''
    // Try reading from file
    if (filename != '') {
        filename = `../${filename}` // Escape dist directory
        try {
            result = readFileSync(join(__dirname, filename), 'utf8')
            const lines = result.split('\n').map(line => line.trim())
            let lineIdx = 0
            const vertCountStr = lines[lineIdx++]
            for (let i = 0; i < parseInt(vertCountStr); i++) {
                const vertName: string = lines[lineIdx++]
                if (vertices.includes(vertName)) {
                    console.error(`Vertex ${vertName} already registered!`)
                    i--
                    continue
                }
                vertices.push(vertName)
            }
            const edgeCountStr = lines[lineIdx++]
            for (let i = 0; i < parseInt(edgeCountStr); i++) {
                const edge: string = lines[lineIdx++]
                let [a, b] = edge.split(' ')
                if (!vertices.includes(a)) {
                    console.error(`Vertex ${a} is not registered!`)
                    i--
                    continue
                }
                if (!vertices.includes(b)) {
                    console.error(`Vertex ${b} is not registered!`)
                    i--
                    continue
                }
                edges.push(new Edge(a, b))
            }
        } catch {
            console.error(`Could not load file "${filename}"! Requesting manual input...`)
        }
    }
    // No valid file input provided, request manual input
    if (!result) {
        const vertCountStr: string = await readLine('Number of vertices: ')
        for (let i = 0; i < parseInt(vertCountStr); i++) {
            const vertName: string = await readLine(`\t${i+1}. vertex: `)
            if (vertices.includes(vertName)) {
                console.error(`Vertex ${vertName} already registered!`)
                i--
                continue
            }
            vertices.push(vertName)
        }
        const edgeCountStr = await readLine('Number of edges: ')
        console.log('\t(Format: "x. edge: edge1 edge2")')
        for (let i = 0; i < parseInt(edgeCountStr); i++) {
            const edge: string = await readLine(`\t${i+1}. edge: `)
            let [a, b] = edge.split(' ')
            if (!vertices.includes(a)) {
                console.error(`Vertex ${a} is not registered!`)
                i--
                continue
            }
            if (!vertices.includes(b)) {
                console.error(`Vertex ${b} is not registered!`)
                i--
                continue
            }
            edges.push(new Edge(a, b))
        }
    }

    let graph: Graph = new Graph(vertices, edges);

    let eulerWalk: vertexname[] | null = graph.getEulerWalk()
    if (eulerWalk !== null) console.log('Euler walk found: ', eulerWalk)
    else console.log('Euler walk not found!')

    let hamiltonWalk: vertexname[] | null = graph.getHamiltonWalk()
    if (hamiltonWalk !== null) console.log('Hamilton walk found: ', hamiltonWalk)
    else console.log('Hamilton walk not found!')

}    

main().then(_ => rl.close())
