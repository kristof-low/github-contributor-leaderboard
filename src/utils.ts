export function waitSync(ms: number) {
    const afterMs = Date.now() + ms;
    while (Date.now() < afterMs);
}
