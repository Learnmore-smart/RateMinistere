export function convertToCamelCase(inputString) {
    // Split the input string into words
    const words = inputString.split(/\s+/);

    // Convert the first word to lowercase
    if (words.length > 0) {
        words[0] = words[0].toLowerCase();
    }

    // Capitalize the first letter of subsequent words
    for (let i = 1; i < words.length; i++) {
        words[i] = words[i].toLowerCase().charAt(0).toUpperCase() + words[i].toLowerCase().slice(1);
    }

    // Join the words without spaces
    return words.join('');
}

export function convertSnakeCaseToCamelCase(inputString) {
    return convertToCamelCase(inputString
        .split('_')
        .join(' ')
    )
}

export function convertToSnakeCase(text) {
    // Handle null, undefined, or empty string
    if (!text) return text;

    // Convert to string and handle different input formats
    return text
        // Replace any non-alphanumeric characters with a space
        .replace(/[^\w\s]/g, ' ')
        // Convert camelCase and PascalCase to space-separated
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        // Convert to lowercase
        .toLowerCase()
        // Replace spaces with underscores
        .replace(/\s+/g, '_')
        // Remove any leading or trailing underscores
        .replace(/^_+|_+$/g, '');
}

export function objectToFormattedString(obj) {
    // Check if obj is valid
    if (!obj || typeof obj !== 'object') {
        return 'No data available';
    }

    // Get headers (keys)
    const headers = Object.keys(obj);

    // Create data rows
    const rows = headers.map(header => {
        // Handle undefined or null values
        const value = obj[header] === undefined || obj[header] === null
            ? 'N/A'
            : String(obj[header] || '').trim() || 'N/A';

        return `${header}: ${value}`;
    });

    // Combine all parts
    return rows.join('\n');
}

export function convertKebabCaseToCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
