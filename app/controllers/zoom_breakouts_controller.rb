# frozen_string_literal: true

require 'zoom_breakout_api'

class ZoomBreakoutsController < ApplicationController
  layout 'application'
  class ZoomAuthCodeError < StandardError; end
  class MissingZoomAccessTokenError < StandardError; end

  # Gets access and refresh tokens and stores them in Zoom Session for current user
  def auth
    request_code = request.parameters['code']

    if request_code.blank?
      msg = 'No Zoom auth code found. This route should only be hit when adding the Zoom Breakout Manager app ' \
            'from the Zoom interface, which will route you here with an authentication code from Zoom.'
      raise ZoomAuthCodeError, msg
    end

    token_response = ZoomBreakoutAPI.client.get_access_token(request_code)
    
    zm_breakout_session = ZoomBreakoutSession.last
    if zm_breakout_session
      zm_breakout_session.update!(access_token: token_response['access_token'], refresh_token: token_response['refresh_token'])
    else
      zm_breakout_session = ZoomBreakoutSession.create!(
        access_token: token_response['access_token'],
        refresh_token: token_response['refresh_token']
      )
    end
  end

  def install
    access_token = ZoomBreakoutSession.last&.access_token
    if access_token.blank?
      raise MissingZoomAccessTokenError, "No Zoom Access token found"
    end

    deep_link = ZoomBreakoutAPI.client.get_deep_link(access_token)
    puts "##### dee p link = #{deep_link}"
    redirect_to deep_link, allow_other_host: true
  end

  def home
  end
end