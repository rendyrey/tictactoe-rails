
class Api::V1::PlayController < ApplicationController
  def new_game
    new_game = Plays.new(session).new_game(params)
    render json: new_game[:data], status: new_game[:status_code]
  end

  def reset_game
    reset_game = Plays.new(session).reset_game
    render json: reset_game[:data], status: reset_game[:status_code]
  end

  def move
    move = Plays.new(session).move(params)
    render json: { status: move[:status], log: move[:log], combination: move[:combination] }, status: move[:statu_code]
  end
end
