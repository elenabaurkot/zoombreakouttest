# frozen_string_literal: true
# test

# require 'rest-client'
require 'json'

class ZoomBreakoutAPI
  include Rails.application.routes.url_helpers
  ZM_BREAKOUT_CLIENT_ID = ENV['ZM_BREAKOUT_CLIENT_ID']
  ZM_BREAKOUT_CLIENT_SECRET = ENV['ZM_BREAKOUT_CLIENT_SECRET']
  ZM_BREAKOUT_REDIRECT_URL = ENV['ZM_BREAKOUT_REDIRECT_URL']

  def self.client
    @auth_params = {
      :client_id => ZM_BREAKOUT_CLIENT_ID,
      :client_secret => ZM_BREAKOUT_CLIENT_SECRET
    }
    new
  end

  def get_access_token(code)
    # may want to include code_verifier here https://marketplace.zoom.us/docs/guides/auth/oauth/
    params = "grant_type=authorization_code&code=#{code}&redirect_uri=#{ZM_BREAKOUT_REDIRECT_URL}"

    zm_breakout_credentials = "#{ZM_BREAKOUT_CLIENT_ID}:#{ZM_BREAKOUT_CLIENT_SECRET}"
    url_encoded_client_credentials = "#{Base64.urlsafe_encode64(zm_breakout_credentials)}"

    headers = {
      'Authorization' => "Basic #{url_encoded_client_credentials}",
      'Content-Type' => 'application/x-www-form-urlencoded',
      'Host' => 'zoom.us'
    }

    token_response = RestClient.post('https://zoom.us/oauth/token', params, headers)
    JSON.parse(token_response.body)
  end

  def get_deep_link(access_token)
    headers = {
      'Authorization' => "Bearer #{access_token}",
      'Content-Type' => 'application/json',
    }

    # TODO: Update URL to zoom_breakouts_home_url, right now hardcoding production URL to test in dev
    params = {
      'url' => 'https://platform.braven.org/zoom_breakouts/home',
      'role_name' => 'Owner',
      'verified' => 1,
      'role_id' => 0
    }.to_json

    response = RestClient.post('https://zoom.us/v2/zoomapp/deeplink', params, headers)
    JSON.parse(response)['deeplink']
  end
end
