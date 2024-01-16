export const onCopy = (description: string) => {
  navigator.clipboard.writeText(description);

  if (!navigator.clipboard.writeText(description)) {
    return { success: false };
  };

  return { success: true };
};
