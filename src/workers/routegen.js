let info = {
    step: 0,
    estRouteCount: 0,
    routesCompleted: 0,
};

self.onmessage = ev => {
    if (ev.data.msg == 'start') {
        let config = ev.data.config;
        let addresses = ev.data.addresses;
        let routes = [];

        postUpdate();

        // Round route size up or down to accommodate all addresses
        // in roughly equally large routes
        let estRouteCount = Math.round(addresses.length / config.routeSize);
        let actualRouteSize = Math.ceil(addresses.length / estRouteCount);

        postUpdate({ step: 1 });

        let points = getNormalizedPoints(addresses);
        let tree = new QuadTree(points, 20);

        postUpdate({ step: 2, estRouteCount });

        while (points.length) {
            routes.push(findRoute(points, tree, actualRouteSize));
            postUpdate({ step: 3, routesCompleted: routes.length });
        }

        postUpdate({ step: 4 });

        postMessage({
            msg: 'fulfilled',
            info, routes,
        });
    }
};


function postUpdate(newInfo) {
    info = Object.assign({}, info, newInfo);

    postMessage({
        msg: 'pending',
        info,
    });
}


function findRoute(points, tree, size) {
    let cur = points[Math.floor(Math.random() * points.length)];
    let cluster = new Cluster();
    let queue = [];

    while (cur && cluster.numPoints() < size) {
        let idx = points.indexOf(cur);

        points.splice(idx, 1);

        cluster.addPoint(cur);

        let avgX = cluster.getAverageX();
        let avgY = cluster.getAverageY();

        queue = tree.getRelevantPoints(avgX, avgY, 1);
        queue.forEach(o => cluster.fitForCluster(o));

        cur = null;

        // Sort queue based on weights
        queue.sort((a, b) => (a.fitness - b.fitness));

        while (!cur && queue.length) {
            let next = queue.pop();

            if (next.used) {
                continue;
            }

            if (cluster.distanceFromNearest(next) < 0.2) {
                cur = next;
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
    this.fitness = 0;
    this.used = false;

    this.squareDistanceTo = p =>
        (p.x - this.x)*(p.x - this.x) + (p.y - this.y)*(p.y - this.y);

    this.distanceTo = p => Math.sqrt(this.squareDistanceTo(p));
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

        p.used = true;
    };

    this.numPoints = () => _points.length;
    this.hasPointWithId = id => !!_points.find(p => p.id == id);
    this.getAverageX = () => _aX;
    this.getAverageY = () => _aY;

    this.fitForCluster = p => {
        p.fitness = 0;
        p.fitness += 100 - this.squareDistanceFromAverage(p);
        p.fitness += _streets[p.street] || 0;

        if (_points.length > 2) {
            let w = (_maxX - _minX);
            let h = (_maxY - _minY);
            let dn = _points.length / (w * h) || 1;

            if (p.x < _minX) w += (_minX - p.x);
            if (p.x > _maxX) w += (p.x - _maxX);
            if (p.y < _minY) h += (_minY - p.y);
            if (p.y > _maxY) h += (p.y - _maxY);

            let da = (_points.length + 1) / (w * h) || 1;

            p.fitness += (da - dn) * 10;
        }
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

function QuadTree(points, size = 10) {
    let _qSize = 1/size;
    let _quads = [];

    this.quads = _quads;

    for (let x = 0; x < size; x++) {
        let minX = x * _qSize;
        let maxX = (x + 1) * _qSize;

        for (let y = 0; y < size; y++) {
            let minY = y * _qSize;
            let maxY = (y + 1) * _qSize;
            let quadPoints = points.filter(p =>
                p.x >= minX && p.x < maxX && p.y >= minY && p.y < maxY);

            _quads.push(new Quad(x, y, quadPoints));
        }
    }

    this.getRelevantPoints = (x, y, margin = 1) => {
        let cc = Math.floor(x * size);
        let cr = Math.floor(y * size);

        let quads = _quads.filter((q, idx) => {
            let dc = cc - q.x;
            let dr = cr - q.y;
            return (Math.abs(dc) <= margin && Math.abs(dr) <= margin);
        });

        return quads.reduce((points, q) => points.concat(q.points), []);
    };
}

function Quad(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
}
