export function formatarDataISO(isoString: string) {
    const [ano, mes, dia] = isoString.split('T')[0].split('-')

    return `${dia}/${mes}/${ano}`
}
