export type DateField = number | undefined;

export default {
  create() {
    return;
  },
  render(field: DateField) {
    if (!field) return '';
    // TODO format
    return new Date(field).toLocaleTimeString();
  },
};
