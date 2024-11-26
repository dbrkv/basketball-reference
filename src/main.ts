// For more information, see https://crawlee.dev/
import { CheerioCrawler, KeyValueStore } from "crawlee";
import { tableToCsv } from "./utils.js";

const year = 2025;
const month = "november";
const startUrls = [
    `https://www.basketball-reference.com/leagues/NBA_${year}.html`,
    `https://www.basketball-reference.com/leagues/NBA_${year}_games-${month}.html`,
];

const crawler = new CheerioCrawler({
    async requestHandler({ $, request }) {
        if (
            request.url ===
            "https://www.basketball-reference.com/leagues/NBA_2025.html"
        ) {
            await Promise.all([
                KeyValueStore.setValue(
                    "advanced-team.csv",
                    tableToCsv($, "advanced-team"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "per_game-team.csv",
                    tableToCsv($, "per_game-team"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "per_game-opponent.csv",
                    tableToCsv($, "per_game-opponent"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "totals-team.csv",
                    tableToCsv($, "totals-team"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "totals-opponent.csv",
                    tableToCsv($, "totals-opponent"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "per_poss-team.csv",
                    tableToCsv($, "per_poss-team"),
                    {
                        contentType: "text/csv",
                    }
                ),
                KeyValueStore.setValue(
                    "per_poss-opponent.csv",
                    tableToCsv($, "per_poss-opponent"),
                    {
                        contentType: "text/csv",
                    }
                ),
            ]);
        } else if (
            request.url ===
            "https://www.basketball-reference.com/leagues/NBA_2025_games-november.html"
        ) {
            // const scheduleElem = $("#schedule");

            await KeyValueStore.setValue(
                `schedule-${month}.csv`,
                tableToCsv($, "schedule"),
                {
                    contentType: "text/csv",
                }
            );
        }
    },
    failedRequestHandler({ request }) {
        console.error(`Request ${request.url} failed!`);
    },
    maxRequestsPerCrawl: 5,
});

await crawler.run(startUrls);

// await Dataset.exportToJSON("OUTPUT");
