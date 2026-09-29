# Dynamic Fields System

## مدل مفهومی

```text
Category defines fields → Product fills values
Waybill Template defines fields → Waybill fills values
```

## Shared واقعی

این موارد Shared مناسب هستند:

- DynamicFieldType
- DynamicFieldOption
- DynamicFieldDefinition
- runtime renderer
- validation primitives
- generic value helpers

مسیر: `src/shared/dynamic-fields/`

## Business-specific editors

Editorهای Business را زودهنگام یکی نکن. Category و Waybill Template ممکن است بعداً rules متفاوت داشته باشند.

Long-term design بهتر:

```text
shared/dynamic-fields/
├── types
├── validation
├── renderer
└── editor-core

categories/.../CategoryDynamicFieldEditor
waybill-templates/.../WaybillTemplateDynamicFieldEditor
```

Wrapperها می‌توانند config بدهند.

## Default Value

باید type-aware باشد:

- string → text + length + regex
- integer → integer + min/max
- decimal → decimal + min/max + decimal_places
- boolean → bool
- date → date
- datetime → datetime
- select → یکی از option values
- multi_select → array of valid option values

## Type change

state نامرتبط پاک شود. مثال string→decimal باید length/regex را پاک کند؛ select→string باید options را پاک کند.

## Options

برای select/multi_select حداقل یک option، label/value کامل، valueها unique.

## `settings`

حتی اگر UI همه Settings را نشان ندهد باید Preserve شوند. نمونه:

```json
{"generator":"WB-{sequence}","padding":8}
{"thousand_separator":true}
{"searchable":true}
{"max_selections":3}
{"calendar":"jalali","format":"YYYY/MM/DD"}
```

## Product runtime

Multi-category است و dynamic fields را بر اساس `field_id` مدیریت کند، نه صرفاً `name`.

## Waybill runtime

یک Template دارد. Detail Backend `fields[].value` می‌دهد؛ Create/Update باید آن‌ها را به `attributes[]` تبدیل کند.

## اصل معماری

نه یک editor غول‌پیکر پر از شرط مخصوص Domain، نه چند Copy/Paste divergent. تعادل مطلوب: Shared engine/core + feature wrapper/config.
