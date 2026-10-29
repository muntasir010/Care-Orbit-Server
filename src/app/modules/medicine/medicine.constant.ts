export const medicineForms = [
  "TABLET",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "CREAM",
  "DROPS",
  "INHALER",
  "OTHER",
] as const;

export const medicineSearchableFields = ["name", "genericName", "manufacturer", "category"];

export const medicineFilterableFields = [
  "searchTerm",
  "category",
  "form",
  "manufacturer",
  "requiresPrescription",
  "inStock",
  "minPrice",
  "maxPrice",
];

export const medicinePaginationFields = ["page", "limit", "sortBy", "sortOrder"];

export const medicineSortableFields = ["name", "price", "stock", "createdAt"];
