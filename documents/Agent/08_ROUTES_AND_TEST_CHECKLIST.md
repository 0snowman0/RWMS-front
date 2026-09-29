# Routes & Test Checklist

## Routes

```text
/categories
/categories/new
/categories/:categoryId/edit

/products
/products/new
/products/:productId/edit

/waybill-templates
/waybill-templates/new
/waybill-templates/:templateId/edit

/waybills
/waybills/new
/waybills/:waybillId/edit
```

ممکن است aliasهای `/items` هنوز موجود باشند؛ وضعیت واقعی routeها را بررسی کن.

## Categories smoke

- list opens
- search
- sort
- page size 10/20/50/100
- previous/next
- create/edit
- dynamic field editor
- preview
- pagination style matches other modules

## Product smoke

- search/sort/page size
- multi-category select
- category search/filter
- selected chips
- grouped fields
- mock create/edit/delete

## Waybill Template smoke

- search/status/page size/prev-next
- create/edit/delete
- active/inactive
- add/edit/delete/reorder field
- preview
- default value type-aware
- validation/options/min-max/length/regex/settings preserved

## Waybill create

- template assignment obvious
- active template selectable
- static fields
- dynamic fields from template
- defaults
- required validation
- status and priority Selects
- save builds `template_id + attributes`

## Waybill edit

- static prefilled
- assigned template selected
- dynamic values prefilled
- editing works
- template change confirmation
- new defaults initialize
- full update shape remains correct

## Build/review

```powershell
git status --short
npm run build
```

Review: modified files, unused imports, encoding, route registration, sidebar duplication.
