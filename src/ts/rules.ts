// TODO should be const? const makes for difficult iteration
enum Rule {
  None,
  Arithmetic,
  ProductOfOneVariable,
  COUNT_MINUS_ONE, // only used as metadata
}
export default Rule;
