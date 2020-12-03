export function memoize(_target: Object, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const targetFunction = descriptor.value ?? descriptor.get

    if (!targetFunction || !(targetFunction instanceof Function)) {
        throw Error('Memoize only supports non-setter functions.')
    }

    const descriptorProp = !!descriptor.value ? 'value' : 'get'
    const cache = new Map<String, any>();

    descriptor[descriptorProp] = function (...args: any[]) {
        const key = JSON.stringify(args)
        const cachedResult = cache.get(key)
        const result = !!cachedResult ? cachedResult : targetFunction.apply(this, args)

        cache.set(key, result)

        return result
    }
}
