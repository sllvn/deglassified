class AddSlugsToLocationsAndBusinesses < ActiveRecord::Migration
  def change
    add_column :locations, :slug, :string
    add_index :locations, :slug, unique: true
    add_column :businesses, :slug, :string
    add_index :businesses, :slug, unique: true
  end
end
