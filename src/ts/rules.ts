// TODO should be const? const makes for difficult iteration
enum Rule {
  None, // should always be first
  Arithmetic, // should always be second
  ProductOfOneVariable,
  PowerToPower,
  COUNT_MINUS_ONE, // only used as metadata, always last
}
export default Rule;
