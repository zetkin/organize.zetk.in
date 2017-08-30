import * as types from '.';

export function generateRoutes(addressIds, config = {}) {
    let routeSize = config.routeSize || 30;
    let routes = [];

    return ({ dispatch, getState }) => {
        let addresses = addressIds
            .map(id => getState().addresses.addressList.items
                .find(i => i.data.id == id))
                .map(i => i.data);

        // TODO: Implement auto-planner algorithm
        let points = getNormalizedPoints(addresses);

        populateNeighbours(points);

        while (points.length) {
            routes.push(findRoute(points, routeSize));
        }

        dispatch({
            type: types.GENERATE_ROUTES + '_COMPLETE',
            meta: {
                config: {
                    routeSize,
                },
            },
            data: {
                routes
            }
        });
    };
}

export function discardRouteDrafts() {
    return {
        type: types.DISCARD_ROUTE_DRAFTS,
    };
}


function findRoute(points, size) {
    let cur = points[Math.floor(Math.random() * points.length)];
    let out = [];
    let queue = [];

    while (cur && out.length < size) {
        let idx = points.indexOf(cur);
        let neighbours = cur.getNeighbours();

        points.splice(idx, 1);
        cur.removeAllNeighbours();
        out.push(cur);

        queue = queue.concat(neighbours);
        cur = null;

        while (!cur && queue.length) {
            let next = queue.pop();

            if (!out.find(p => p.id == next.id)) {
                cur = next;
            }
        }
    }

    return {
        id: Math.random().toString(),
        addresses: out.map(p => p.id),
    };
}

function populateNeighbours(points, count=5) {
    points.forEach(p => {
        let others = points.map(o => ({
            dist: ((p.x - o.x)*(p.x - o.x) + (p.y - o.y)*(p.y - o.y)),
            point: o,
        }));

        others.sort((a,b) => a.dist - b.dist);

        // TODO: Filter those that are TOO far away
        others.slice(0, count).forEach(o => {
            if (!p.isNeighbour(o.point)) {
                new Connection(p, o.point);
            }
        });
    });
}

function getNormalizedPoints(addresses) {
    let b = calcBounds(addresses);

    let maxDim = Math.max(b.maxX - b.minX, b.maxY - b.minY);

    // TODO: Project for greater accuracy? Might not be necessary
    return addresses.map(addr => new Point(
        addr.id,
        (addr.longitude - b.minX) / maxDim,
        (addr.latitude - b.minY) / maxDim,
    ));
}

function calcBounds(addresses) {
    let b = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
    };

    addresses.forEach(addr => {
        if (addr.longitude < b.minX) {
            b.minX = addr.longitude;
        }

        if (addr.longitude > b.maxX) {
            b.maxX = addr.longitude;
        }

        if (addr.latitude < b.minY) {
            b.minY = addr.latitude;
        }

        if (addr.latitude > b.maxY) {
            b.maxY = addr.latitude;
        }
    });

    return b;
}

function Point(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;

    let _connections = {};

    this.addConnection = c => {
        let o = c.getOther(this);
        _connections[o.id] = c;
    };

    this.removeConnection = c => {
        let o = c.getOther(this);
        delete _connections[o.id];
    };

    this.isNeighbour = o => !!_connections[o.id];

    this.removeAllNeighbours = () => {
        Object.keys(_connections).forEach(id => {
            _connections[id].clear();
        });
    };

    this.getNeighbours = () =>
        Object.keys(_connections)
            .map(id => _connections[id].getOther(this));
}

function Connection(p0, p1) {
    let _p0 = p0;
    let _p1 = p1;

    this.getOther = s => (_p0 == s)? _p1 : _p0;

    this.clear = () => {
        _p0.removeConnection(this);
        _p1.removeConnection(this);
        _p0 = _p1 = null;
    };

    p0.addConnection(this);
    p1.addConnection(this);
}
