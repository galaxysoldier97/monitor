export class StockAdminCategories {
  static WAREHOUSE = new StockAdminCategories('Warehouse', true);
  static MANUFACTURER = new StockAdminCategories('Manufacturer', true);

  constructor(category, isFilterable) {
    this.category = category;
    this.isFilterable = isFilterable;
  }

  toString() {
    return this.category;
  }
}
