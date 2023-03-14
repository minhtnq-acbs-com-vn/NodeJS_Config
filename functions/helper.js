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

export { checkOfficeHour };
