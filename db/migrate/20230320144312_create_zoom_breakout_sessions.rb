class CreateZoomBreakoutSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :zoom_breakout_sessions do |t|
      t.string :access_token, null: false
      t.string :refresh_token, null: false

      t.timestamps
    end
  end
end
