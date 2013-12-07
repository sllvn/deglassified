class CreateBusinesses < ActiveRecord::Migration
  def change
    create_table :businesses do |t|
      t.string :name
      t.string :address
      t.float :lat
      t.float :lng
      t.string :website
      t.string :facebook
      t.string :twitter
      t.string :yelp

      t.timestamps
    end
  end
end
