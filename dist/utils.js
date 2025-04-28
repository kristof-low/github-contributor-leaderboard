export function waitSync(ms) {
    const afterMs = Date.now() + ms;
    while (Date.now() < afterMs)
        ;
}
