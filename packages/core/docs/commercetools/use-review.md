---
platform: Commercetools
---

<IncludeContent content-key="use-review" />

::: slot header-warning
::: warning Paid feature
This feature is part of the Enterprise version. Please [contact our team](https://www.vuestorefront.io/contact/sales) if you'd like to use it in your project.
:::

::: slot search-params
```typescript
interface ReviewSearchParams {
  productId: string | number;
  limit?: number;
  offset?: number;
}
```
:::
