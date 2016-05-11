function collectClassNames(instance, output=[]) {
    const proto = instance.__proto__;
    const name = proto.constructor.name;

    if (name !== 'ReactComponent') {
        output.push(name);
        return collectClassNames(proto, output);
    }
    else {
        return output;
    }
}

export function componentClassNames(instance) {
    return collectClassNames(instance);
}
