export const getStatusColour = instanceState => {
  switch (instanceState) {
    case 'running':
      return 'green';
    case 'stopped':
      return 'red';
    default:
      return 'yellow';
  }
};

export const getButtonColour = instanceState => {
  switch (instanceState) {
    case 'stopped':
    case 'pending':
      return 'green';
    case 'running':
    case 'stopping':
      return 'orange';
    default:
      return 'orange';
  }
};
