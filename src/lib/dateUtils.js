export const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return null;

    // Check if it's already in DD.MM.YYYY format
    if (dateString.includes('.')) return dateString;

    // Default YYYY-MM-DD from input "date" or DB
    const ymdRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateString.match(ymdRegex);
    if (match) {
        const [_, year, month, day] = match;
        return `${day}.${month}.${year}`;
    }

    // Fallback parsing date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
};
