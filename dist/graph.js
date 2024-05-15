"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = exports.Edge = void 0;
class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}
exports.Edge = Edge;
class Graph {
    // Constructor converts string-based graph to index-base graph
    constructor(vertices, edges) {
        this.vertexNames = [...vertices];
        this.edges = [];
        edges.forEach(edge => {
            const fromIdx = vertices.indexOf(edge.from);
            const toIdx = vertices.indexOf(edge.to);
            const forward = new Edge(fromIdx, toIdx);
            const backward = new Edge(toIdx, fromIdx);
            if (!this.hasEdge(forward))
                this.edges.push(forward);
            if (!this.hasEdge(backward))
                this.edges.push(backward);
        });
        this.degrees = [];
        for (let vertex = 0; vertex < this.vertexNames.length; vertex++)
            this.degrees.push(this.edges.filter(edge => edge.from == vertex).length);
    }
    hasEdge(a) {
        for (let edge of this.edges)
            if (edge.from == a.from && edge.to == a.to)
                return true;
        return false;
    }
    getEulerWalk() {
        let [start, end] = [null, null];
        for (let i = 0; i < this.degrees.length; i++) {
            if (this.degrees[i] % 2 == 0)
                continue; // Not odd degree
            if (start === null)
                start = i; // First odd degree
            else if (end === null)
                end = i; // Second odd degree
            else
                return null; // Third odd degree
        }
        if (start === null && end !== null)
            return null; // Only one odd degree
        var isEven = start === null;
        if (start === null)
            start = 0;
        // Clone them because the algorithm mutates them
        let degrees = [...this.degrees];
        let edges = [...this.edges];
        let stack = [];
        let walk = [];
        let current = start;
        while (stack.length > 0 || degrees[current]) {
            if (!degrees[current]) { // The circle "closed", and pop stack until the start of another circle is found
                walk.push(current);
                current = stack.pop();
            }
            else {
                let edge = edges.find(edge => edge.from == current);
                if (edge === undefined)
                    continue;
                stack.push(current);
                edges = edges.filter(e => !(e.from == current && e.to == edge.to || e.from == edge.to && e.to == current));
                degrees[current]--;
                degrees[edge.to]--;
                current = edge.to;
            }
        }
        if (walk.length != (this.edges.length / 2))
            return null;
        if (!isEven)
            walk.push(current); // If its not an Euler circle, current element is not in included yet
        return walk.map(vertex => this.vertexNames[vertex]);
    }
    walkDFS(walk, current) {
        walk = walk.concat([current]);
        if (walk.length == this.vertexNames.length)
            return walk;
        for (var edge of this.edges) {
            if (edge.from != current)
                continue;
            if (!walk.includes(edge.to)) {
                let result = this.walkDFS(walk, edge.to);
                if (result !== null)
                    return result;
            }
        }
        return null;
    }
    getHamiltonWalk() {
        for (let vertid = 0; vertid < this.vertexNames.length; vertid++) {
            let result = this.walkDFS([], vertid);
            if (result !== null)
                return result.map(vertex => this.vertexNames[vertex]);
        }
        return null;
    }
}
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map