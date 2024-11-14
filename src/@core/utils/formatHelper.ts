class FormaterHelper {
  // Strip Rupiah formatting from a given value
  static stripRupiahFormatting(value: string | any): string | undefined {
    const originalValue = this.hasSpecialChars(value)

    if (originalValue) {

      return value.replace(/[^0-9]/g, '')
    }

    return undefined // Explicitly return undefined if no special characters are found

  }

  // Format a given value into Rupiah format
  static formatRupiah(value: string): string {
    const numberString = value.replace(/[^,\d]/g, '').toString()
    const split = numberString.split(',')
    const sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    if (ribuan) {

      const separator = sisa ? '.' : ''

      rupiah += separator + ribuan.join('.')

    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah

    return rupiah

  }

  // Method to check if a value contains special characters
  static hasSpecialChars(value: string): boolean {

    const specialCharRegex = /[^a-zA-Z0-9]/

    return specialCharRegex.test(value)

  }
}

export default FormaterHelper
