# Framer Motion useInView bug with Suspense and Await in Remix

## To reproduce

- Refresh the page. `useInView` returns `true` for a div not wrapped in Suspense and Await.
- The components wrapped in Suspense never update their useInView value.
- `react-intersection-obersever` works as expected.
