# recompose-scope
Compose React HOCs with a scope that restrict the props passing in and out.

```js
composeWithScope(
...functions: Array<Function> | consumeProps | injectProps | exposeProps | exposeHandlers
): HigherOrderComponent
```

- Only specified outer props will pass into the scope.
  (Specify by `consumProps` or `injectProps`)
- Only specified inner props will send to the base component.
  (Specify by `exposeProps` or `exposeHandlers`)
- All outer, not consumed props will skip the scope and pass through to the base component.
- Injected outer props will still send to the base component.

```js
const consumeRoute = composeWithScope(
 consumeProps({
   location: propTypes.object,
   match: propTypes.object,
   history: propTypes.object,
 }),
 exposeProps(({ location, match }) => ({
   path: location.pathname,
   view: match.params.view,
   id: match.params.id,
 })),
 exposeHandlers({
   redirectToMenu: ({ history }) => () => history.push('/menu'),
 }),
)
```

- `consumeProps` receives the same paramater as `recompose/setPropTypes`
- `injectProps` receives the same paramater as `recompose/setPropTypes`
- `exposeProps` receives the same paramater as `recompose/withProps`
- `exposeHandlers` receives the same paramater as `recompose/withHandlers`

