export const convertParameters = (args: Record<string, any>) => {
    const argsConverted: typeof args = {}
    Object.entries(args).forEach(([key, value]) => {
        if (typeof value === 'string') {
            // if it's a hex code, convert to a color object.
            if (value.match(/^#[0-9A-F]{6}$/i)) {
                argsConverted[key] = {
                    Red: parseInt(value.slice(1, 3), 16) / 255,
                    Green: parseInt(value.slice(3, 5), 16) / 255,
                    Blue: parseInt(value.slice(5, 7), 16) / 255,
                    Alpha: 1.0
                }
            } else {
                argsConverted[key] = value
            }
        } else {
            argsConverted[key] = value
        }
    })
    return JSON.stringify(argsConverted)
}