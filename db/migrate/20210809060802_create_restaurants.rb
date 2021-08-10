class CreateRestaurants < ActiveRecord::Migration[6.1]
  def change
    create_table :restaurants do |t|
      t.string :name, null: false
      t.string :fee, null: false, default: 0
      t.string :time_required, null: false

      t.timestamps
    end
  end
end
