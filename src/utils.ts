import * as cheerio from "cheerio";

/**
 * Converts an HTML table to CSV.
 * Handles headers, footers, colspans, and rowspans.
 * @param $ - The Cheerio instance for parsing.
 * @param tableId - The ID of the table element to process.
 * @returns A CSV string representing the table's content.
 */
export const tableToCsv = (
    $: cheerio.CheerioAPI,
    tableId: string
): string | null => {
    const table = $(`#${tableId}`);

    if (!table.length) {
        console.warn(`Table with ID "${tableId}" not found.`);
        return null;
    }

    const rows: string[][] = [];
    const colSpans: number[] = []; // Tracks column spans for rowspan processing.

    // Process each row in the table.
    table.find("thead tr, tbody tr, tfoot tr").each((_, row) => {
        const cells = $(row).children("th, td");
        const rowData: string[] = [];
        let colIndex = 0;

        cells.each((_, cell) => {
            const $cell = $(cell);
            const text = $cell.text().trim();
            const colspan = parseInt($cell.attr("colspan") || "1", 10);
            const rowspan = parseInt($cell.attr("rowspan") || "1", 10);

            // Fill in any skipped columns due to rowspan in previous rows.
            while (colSpans[colIndex] && colSpans[colIndex] > 0) {
                rowData.push("");
                colSpans[colIndex]--;
                colIndex++;
            }

            // Add the current cell's text to the row data.
            rowData.push(text);

            // Handle colspan: extend with empty columns if colspan > 1.
            for (let i = 1; i < colspan; i++) {
                rowData.push("");
            }

            // Handle rowspan: track how many rows need to skip this column.
            if (rowspan > 1) {
                colSpans[colIndex] = rowspan - 1;
            }

            colIndex += colspan;
        });

        // Push any remaining empty columns due to previous rowspans.
        while (colSpans[colIndex] && colSpans[colIndex] > 0) {
            rowData.push("");
            colSpans[colIndex]--;
            colIndex++;
        }

        rows.push(rowData);
    });

    // Convert the rows array to a CSV string.
    const csv = rows
        .map((row) =>
            row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    return csv;
};
