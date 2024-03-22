//** CRON IMPORT
import { CronJob } from "cron";

//** MEMGRAPH IMPORT
import { getDriver } from "../db/memgraph";
import { Driver } from "neo4j-driver";

//** SERVICE IMPORT
import ListService from "../services/list.services/list.service";


// Define the cron schedule (runs every day at 12:00 AM)
const cronSchedule: string = '0 0 * * *';

// Create a new cron job with the defined schedule
const job = new CronJob(
    cronSchedule, // Cron schedule
    async () => {
        try {
            const driver: Driver = getDriver() as Driver;
            const listService: ListService = new ListService(driver);

            await listService.updateCardList("", true);
            console.log("Cron job executed successfully.");
        } catch (error: any) {
            console.error("Error executing cron job:", error);
        }
    },
    null, // No onComplete callback needed
    true, // Start the cron job immediately
    'UTC' // Timezone (adjust as needed)
);

// Start the cron job
job.start();
