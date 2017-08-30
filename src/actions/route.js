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
    let cluster = new Cluster();
    let queue = [];

    while (cur && cluster.numPoints() < size) {
        let idx = points.indexOf(cur);

        points.splice(idx, 1);
        cur.removeAllNeighbours();

        cluster.addPoint(cur);

        //queue = queue.concat(neighbours);
        queue = points.map(o => ({
            point: o,
            weight: cluster.fitForCluster(o)
        }));

        cur = null;

        // Sort queue based on weights
        queue.sort((a, b) => (a.weight - b.weight));

        while (!cur && queue.length) {
            let next = queue.pop();

            if (cluster.hasPointWithId(next.point.id)) {
                continue;
            }

            if (cluster.distanceFromNearest(next.point) < 0.2) {
                cur = next.point;
            }
        }
    }

    return cluster.toRouteDraft();
}

function getNormalizedPoints(addresses) {
    let b = calcBounds(addresses);

    let maxDim = Math.max(b.maxX - b.minX, b.maxY - b.minY);

    // TODO: Project for greater accuracy? Might not be necessary
    return addresses.map(addr => new Point(
        addr.id,
        (addr.longitude - b.minX) / maxDim,
        (addr.latitude - b.minY) / maxDim,
        addr.street,
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

function Point(id, x, y, street) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.street = street;

    let _connections = {};

    this.addConnection = c => {
        let o = c.getOther(this);
        _connections[o.id] = c;
    };

    this.removeConnection = c => {
        let o = c.getOther(this);
        delete _connections[o.id];
    };

    this.getWeight = o => _connections[o.id].weight;

    this.isNeighbour = o => !!_connections[o.id];

    this.removeAllNeighbours = () => {
        Object.keys(_connections).forEach(id => {
            _connections[id].clear();
        });
    };

    this.squareDistanceTo = p =>
        (p.x - this.x)*(p.x - this.x) + (p.y - this.y)*(p.y - this.y);

    this.distanceTo = p => Math.sqrt(this.squareDistanceTo(p));

    this.getNeighbours = () =>
        Object.keys(_connections)
            .map(id => _connections[id].getOther(this));
}

function Cluster() {
    let _points = [];
    let _streets = {};
    let _minX = Infinity;
    let _minY = Infinity;
    let _maxX = -Infinity;
    let _maxY = -Infinity;
    let _cX = 0;
    let _cY = 0;

    let _totX = 0;
    let _totY = 0;
    let _aX = 0;
    let _aY = 0;

    this.addPoint = p => {
        _points.push(p);
        _minX = Math.min(p.x, _minX);
        _minY = Math.min(p.y, _minY);
        _maxX = Math.max(p.x, _maxX);
        _maxY = Math.max(p.y, _maxY);
        _cX = (_maxX - _minX) / 2;
        _cY = (_maxY - _minY) / 2;

        _totX += p.x;
        _totY += p.y;
        _aX = _totX / _points.length;
        _aY = _totY / _points.length;

        if (!_streets[p.street])
            _streets[p.street] = 0;

        _streets[p.street]++;
    };

    this.numPoints = () => _points.length;
    this.hasPointWithId = id => !!_points.find(p => p.id == id);

    this.fitForCluster = p => {
        let fitness = 0;

        fitness += 100 - this.distanceFromAverage(p) * 100;
        fitness += 50 - this.distanceFromCenter(p) * 50;
        fitness += _streets[p.street] || 0;

        if (_points.length > 2) {
            let dn = _points.length / ((_maxX - _minX) * (_maxY - _minY)) || 1;
            let maxX = Math.max(p.x, _maxX);
            let maxY = Math.max(p.y, _maxY);
            let minX = Math.min(p.x, _minX);
            let minY = Math.min(p.y, _minY);
            let da = (_points.length + 1) / ((maxX - minX) * (maxY - minY)) || 1;

            fitness += (da - dn) * 10;
        }

        return fitness;
    };

    this.squareDistanceFromCenter = p =>
        (p.x - _cX)*(p.x - _cX) + (p.y - _cY)*(p.y - _cY);

    this.distanceFromCenter = p => Math.sqrt(this.squareDistanceFromCenter(p));

    this.squareDistanceFromAverage = p =>
        (p.x - _aX)*(p.x - _aX) + (p.y - _aY)*(p.y - _aY);

    this.distanceFromAverage = p => Math.sqrt(this.squareDistanceFromAverage(p));

    this.distanceFromNearest = p => {
        let min = Infinity;

        _points.forEach(o => {
            min = Math.min(min, o.squareDistanceTo(p));
        });

        return Math.sqrt(min);
    };

    this.toRouteDraft = () => ({
        id: Math.random().toString(),
        addresses: _points.map(p => p.id),
    });
}
