# compose-with-scope
Compose React HOCs with a scope that restrict the props passing in and out.

```js
composeWithScope(
...functions: Array<Function> | consumeProps | injectProps | passProps | passHandlers
): HigherOrderComponent
```

- Only specified outer props will pass into the scope.
  (Specify by `consumProps` or `injectProps`)
- Only specified inner props will send to the base component.
  (Specify by `passProps` or `passHandlers`)
- All outer, not consumed props will skip the scope and pass through to the base component.
- Injected outer props will still send to the base component.

```js
const consumeRoute = composeWithScope(
 consumeProps({
   location: propTypes.object,
   match: propTypes.object,
   history: propTypes.object,
 }),
 passProps(({ location, match }) => ({
   path: location.pathname,
   view: match.params.view,
   id: match.params.id,
 })),
 passHandlers({
   redirectToMenu: ({ history }) => () => history.push('/menu'),
 }),
)
```

- `consumeProps` receives the same paramater as `recompose/setPropTypes`
- `injectProps` receives the same paramater as `recompose/setPropTypes`
- `passProps` receives the same paramater as `recompose/withProps`
- `passHandlers` receives the same paramater as `recompose/withHandlers`

