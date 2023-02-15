import cron from "node-cron";

const secondSet = 5;

const cronExpression = `*/1 0 * * * *`;

function action() {
  console.log("This cron job will run every second");
}

const job = cron.schedule(cronExpression, action, { scheduled: false });

job.start(); //starts the job

//job.stop() //stops the job
