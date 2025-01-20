export default function run(number: string | number | undefined): string | boolean {
    if (!number) return false

    number = number.toString()

    if (number.trim().startsWith('+') && !number.trim().startsWith('+55')) {
        return number.toString().replace(/[^\d]+/g, '')
    }

    let numberFormatting = number.toString().replace(/[^\d]+/g, '')
    if (numberFormatting.length >= 10) {
        if (numberFormatting.length >= 12 && numberFormatting.startsWith('55')) {
            numberFormatting = numberFormatting.slice(2)
        }
        if (numberFormatting.startsWith('0')) {
            numberFormatting = numberFormatting.slice(1)
        }
        //número completo
        if (numberFormatting.length >= 12) {
            false
        } else {
            numberFormatting = `55${numberFormatting}`
            return numberFormatting
        }
    }

    return false
}
