const sanitizePrice = (price: string): number | undefined => {
    if (price === '') {
        return undefined;
    }

    return Number(
        price
        .toLowerCase()
        .trim()
        .replaceAll(' ', '')
        .replaceAll('.', '')
        .replaceAll(',', '')
        .replaceAll('k', '000')
    );
}

export {
    sanitizePrice
}
