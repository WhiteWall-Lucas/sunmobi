export function formatarDataISO(isoString: string) {
    const data = new Date(isoString)

    // Pegando dia, mês e ano e garantindo dois dígitos para dia e mês
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0') // Mês começa do zero
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}
