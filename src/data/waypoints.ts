import { WorldPoint } from '../types/office';
import { DEPARTMENTS } from './departments';

export interface WaypointNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
  area?: string;
}

// Hallway backbone connecting all 12 departments cleanly
export const WAYPOINTS: Record<string, WaypointNode> = {
  // Central North Corridor
  'hall-n1': { id: 'hall-n1', x: 1200, y: 580, neighbors: ['exec-door', 'hall-cross-n', 'command-n'] },
  'exec-door': { id: 'exec-door', x: 1200, y: 560, neighbors: ['hall-n1', 'exec-in'] },
  'exec-in': { id: 'exec-in', x: 1200, y: 440, neighbors: ['exec-door'] },

  // North Crossway (East-West corridor between Executive, Server Room, and R&D)
  'hall-cross-n': { id: 'hall-cross-n', x: 1200, y: 580, neighbors: ['hall-cross-nw', 'hall-cross-ne', 'hall-n1', 'command-n'] },
  'hall-cross-nw': { id: 'hall-cross-nw', x: 710, y: 580, neighbors: ['hall-cross-n', 'server-door'] },
  'server-door': { id: 'server-door', x: 710, y: 560, neighbors: ['hall-cross-nw', 'server-in'] },
  'server-in': { id: 'server-in', x: 710, y: 440, neighbors: ['server-door'] },

  'hall-cross-ne': { id: 'hall-cross-ne', x: 1690, y: 580, neighbors: ['hall-cross-n', 'research-door'] },
  'research-door': { id: 'research-door', x: 1690, y: 560, neighbors: ['hall-cross-ne', 'research-in'] },
  'research-in': { id: 'research-in', x: 1690, y: 440, neighbors: ['research-door'] },

  // Command Center Entrances (North, South, West, East)
  'command-n': { id: 'command-n', x: 1200, y: 640, neighbors: ['hall-cross-n', 'command-center'] },
  'command-center': { id: 'command-center', x: 1200, y: 830, neighbors: ['command-n', 'command-s', 'command-w', 'command-e'] },
  'command-s': { id: 'command-s', x: 1200, y: 1020, neighbors: ['command-center', 'hall-mid'] },
  'command-w': { id: 'command-w', x: 960, y: 830, neighbors: ['command-center', 'hall-cross-mid-w'] },
  'command-e': { id: 'command-e', x: 1440, y: 830, neighbors: ['command-center', 'hall-cross-mid-e'] },

  // Mid Crossway (connecting Dev Lab and Creative Studio)
  'hall-cross-mid-w': { id: 'hall-cross-mid-w', x: 920, y: 830, neighbors: ['command-w', 'dev-door'] },
  'dev-door': { id: 'dev-door', x: 890, y: 830, neighbors: ['hall-cross-mid-w', 'dev-in'] },
  'dev-in': { id: 'dev-in', x: 670, y: 830, neighbors: ['dev-door'] },

  'hall-cross-mid-e': { id: 'hall-cross-mid-e', x: 1480, y: 830, neighbors: ['command-e', 'creative-door'] },
  'creative-door': { id: 'creative-door', x: 1510, y: 830, neighbors: ['hall-cross-mid-e', 'creative-in'] },
  'creative-in': { id: 'creative-in', x: 1730, y: 830, neighbors: ['creative-door'] },

  // Central Spine between Command and Meeting Room
  'hall-mid': { id: 'hall-mid', x: 1200, y: 1060, neighbors: ['command-s', 'meeting-door', 'hall-cross-s-w', 'hall-cross-s-e'] },
  'meeting-door': { id: 'meeting-door', x: 1200, y: 1100, neighbors: ['hall-mid', 'meeting-in'] },
  'meeting-in': { id: 'meeting-in', x: 1200, y: 1260, neighbors: ['meeting-door', 'meeting-s'] },
  'meeting-s': { id: 'meeting-s', x: 1200, y: 1420, neighbors: ['meeting-in', 'hall-south-spine'] },

  // South Mid Crossway (connecting Analytics and Marketing)
  'hall-cross-s-w': { id: 'hall-cross-s-w', x: 920, y: 1060, neighbors: ['hall-mid', 'analytics-door-n'] },
  'analytics-door-n': { id: 'analytics-door-n', x: 890, y: 1260, neighbors: ['hall-cross-s-w', 'analytics-in'] },
  'analytics-in': { id: 'analytics-in', x: 670, y: 1260, neighbors: ['analytics-door-n'] },

  'hall-cross-s-e': { id: 'hall-cross-s-e', x: 1480, y: 1060, neighbors: ['hall-mid', 'marketing-door-n'] },
  'marketing-door-n': { id: 'marketing-door-n', x: 1510, y: 1260, neighbors: ['hall-cross-s-e', 'marketing-in'] },
  'marketing-in': { id: 'marketing-in', x: 1730, y: 1260, neighbors: ['marketing-door-n'] },

  // Southern Spine (connecting Support, Operations, and Sales)
  'hall-south-spine': { id: 'hall-south-spine', x: 1200, y: 1460, neighbors: ['meeting-s', 'support-door', 'hall-south-w', 'hall-south-e', 'lounge-door'] },
  'support-door': { id: 'support-door', x: 1200, y: 1500, neighbors: ['hall-south-spine', 'support-in'] },
  'support-in': { id: 'support-in', x: 1200, y: 1640, neighbors: ['support-door', 'lounge-door'] },

  // Lounge & Cafeteria connection
  'lounge-door': { id: 'lounge-door', x: 1200, y: 1840, neighbors: ['support-in', 'lounge-in'] },
  'lounge-in': { id: 'lounge-in', x: 1200, y: 1960, neighbors: ['lounge-door'] },

  'hall-south-w': { id: 'hall-south-w', x: 890, y: 1460, neighbors: ['hall-south-spine', 'ops-door'] },
  'ops-door': { id: 'ops-door', x: 890, y: 1640, neighbors: ['hall-south-w', 'ops-in'] },
  'ops-in': { id: 'ops-in', x: 670, y: 1640, neighbors: ['ops-door'] },

  'hall-south-e': { id: 'hall-south-e', x: 1510, y: 1460, neighbors: ['hall-south-spine', 'sales-door'] },
  'sales-door': { id: 'sales-door', x: 1510, y: 1640, neighbors: ['hall-south-e', 'sales-in'] },
  'sales-in': { id: 'sales-in', x: 1730, y: 1640, neighbors: ['sales-door'] }
};

// Map department IDs directly to their central interior waypoint
export const DEPARTMENT_WAYPOINT_MAP: Record<string, string> = {
  'executive': 'exec-in',
  'server-room': 'server-in',
  'research': 'research-in',
  'command-center': 'command-center',
  'development': 'dev-in',
  'creative': 'creative-in',
  'analytics': 'analytics-in',
  'meeting': 'meeting-in',
  'marketing': 'marketing-in',
  'operations': 'ops-in',
  'support': 'support-in',
  'sales': 'sales-in',
  'lounge': 'lounge-in'
};

// Find closest waypoint to an arbitrary point
export function findClosestWaypoint(point: WorldPoint): string {
  let closestId = 'command-center';
  let minDist = Infinity;

  for (const [id, node] of Object.entries(WAYPOINTS)) {
    const dist = Math.hypot(node.x - point.x, node.y - point.y);
    if (dist < minDist) {
      minDist = dist;
      closestId = id;
    }
  }

  return closestId;
}

// Breadth-First-Search pathfinding on waypoint graph
export function findPath(startPoint: WorldPoint, targetPoint: WorldPoint): WorldPoint[] {
  const startNodeId = findClosestWaypoint(startPoint);
  const targetNodeId = findClosestWaypoint(targetPoint);

  if (startNodeId === targetNodeId) {
    return [targetPoint];
  }

  const queue: string[][] = [[startNodeId]];
  const visited = new Set<string>([startNodeId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const currentId = path[path.length - 1];

    if (currentId === targetNodeId) {
      // Map node IDs back to coordinates and append exact targetPoint
      const points = path.map(id => ({ x: WAYPOINTS[id].x, y: WAYPOINTS[id].y }));
      points.push(targetPoint);
      return points;
    }

    const neighbors = WAYPOINTS[currentId]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  // Fallback direct line if graph has partition
  return [targetPoint];
}
