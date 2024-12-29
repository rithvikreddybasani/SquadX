export const isDAG = (nodes, edges) => {
    // Create adjacency list
    const adjList = {}
    nodes.forEach((node) => {
      adjList[node.id] = []
    })
  
    edges.forEach((edge) => {
      adjList[edge.source].push(edge.target)
    })
  
    // DFS to detect cycles
    const visited = new Set()
    const recStack = new Set()
  
    const hasCycle = (nodeId) => {
      visited.add(nodeId)
      recStack.add(nodeId)
  
      // Visit all neighbors
      for (const neighbor of adjList[nodeId]) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) {
            return true
          }
        } else if (recStack.has(neighbor)) {
          return true
        }
      }
  
      recStack.delete(nodeId)
      return false
    }
  
    // Check each unvisited node
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          return false
        }
      }
    }
  
    return true
  }