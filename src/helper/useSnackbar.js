import React from 'react';

export const useSnackbar = () => {
  const [open, setOpen] = React.useState(false);

  // eslint-disable-next-line
  const showSnackbar = React.useCallback(() => setOpen(true));
  // eslint-disable-next-line
  const hideSnackbar = React.useCallback(() => setOpen(false));
  return { open, showSnackbar, hideSnackbar };
};
