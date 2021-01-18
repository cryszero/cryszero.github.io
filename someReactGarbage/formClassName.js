export default ({ className = '', parentClassName = '', mods }) => {
    const baseClassName = className.trim();
    let classList = `${baseClassName} ${parentClassName}`;

    if (typeof mods === 'string' && !!mods.length) {
        classList = `${classList} ${baseClassName}--${mods}`;
    } else if (Array.isArray(mods) && mods.length > 0) {
        classList += mods.reduce((acc, mod) => {
            return typeof mod === 'string' && !!mod.length ? ` ${acc} ${baseClassName}--${mod}` : acc;
        }, '');
    }

    return classList.replace(/[ ]+/g, ' ').trim();
};