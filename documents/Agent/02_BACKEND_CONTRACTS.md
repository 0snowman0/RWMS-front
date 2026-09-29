# Backend Contracts

## Pagination

Request:

```text
page_number >= 1
page_size 1..100
sort_by: string | null
is_ascending: boolean
filter: TFilter | null
```

Response:

```text
items
total_count
page_number
page_size
total_pages
has_previous_page
has_next_page
```

## DynamicFieldDefinition

```text
field_id: UUID
name: string
title: string
field_type: string|integer|decimal|boolean|date|datetime|select|multi_select
required
unique
default_value
auto_generate
readonly
is_active
sort_order
unit
placeholder
description
show_in_list
min_value
max_value
decimal_places
min_length
max_length
regex
options[]
settings{}
```

`field_id` هویت پایدار Field است.

## Category

```text
name
description
fields[]
```

Create/Update همان سه بخش بالا. Output همچنین `id`, `created_at`, `updated_at`.

## Product

Product ↔ Categories = many-to-many.

Create/Update:

```text
name
category_ids[]
attributes[]
```

Update از نوع Full Replacement است، نه PATCH. Frontend باید کل `name`, همه `category_ids`, همه `attributes` فعلی را بفرستد.

Output شامل:

```text
categories[{id,name}]
fields[DynamicFieldDefinition + category_id + category_name + value]
```

## Waybill Template

```text
name (DB unique)
description
is_active
fields[]
```

Create/Update:

```text
name
description | null
is_active
fields[]
```

Summary DTO عمداً `fields` ندارد. Detail DTO دارد.

Routes:

```text
POST /create
GET  /
GET  /{template_id}
PUT  /{template_id}
DELETE /{template_id}
```

## Waybill

Static fields:

```text
name
waybill_number
template_id
waybill_date
received_date
sender_name
sender_contact
receiver_name
receiver_contact
origin
destination
vehicle_type
vehicle_number
driver_name
driver_contact
total_weight
status
priority
description
internal_notes
created_by
```

Create DTO نیازمند `name` و `template_id` است؛ سایر فیلدها optional، و `attributes[]` دارد.

Output Detail شامل:

```text
template {id,name}
fields[DynamicFieldDefinition + template_id + template_name + value]
```

### WaybillPriority

```text
low
normal
high
urgent
```

Labels:

```text
کم
عادی
بالا
فوری
```

### WaybillStatus

```text
registered
pending_approval
approved
receiving
received
partially_received
cancelled
```

Labels:

```text
ثبت‌شده
در انتظار تأیید
تأییدشده
در حال دریافت
دریافت‌شده
دریافت جزئی
لغوشده
```

## Correct Waybill workflow

Waybill به Category assign نمی‌شود؛ رابطه اصلی:

```text
Waybill.template_id
  ↓
WaybillTemplate.fields
  ↓
Waybill.attributes
```

Create/Edit:

```text
Assign template
→ render template fields
→ fill values
→ build attributes[]
→ create/full update
```

Edit باید template قبلی و `fields[].value` را prefill کند.
