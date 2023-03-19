import { execSync } from "child_process";

const getCurrentHour = () => {
  return parseInt(
    new Date().toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
    })
  );
};

const checkOfficeHour = () => {
  let hour = getCurrentHour();
  if (hour > 17 && hour < 8) {
    return false;
  }

  if (hour < 17 && hour > 8) {
    return true;
  }
};

const RunGoCommand = (id, toggle, cronjob, op) => {
  execSync(
    `cd /home/ubuntu/helpers/go-crontab-manipulate && ./main -id ${id} -toggle ${toggle} -cronjob "${cronjob}" -op ${op}`
  );
};

export { checkOfficeHour, RunGoCommand };
