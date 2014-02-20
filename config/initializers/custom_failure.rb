class CustomFailure < Devise::FailureApp
  def redirect_url
     new_user_session_url(:subdomain => 'secure')
  end

  def respond
    if http_auth?
      http_auth
    else
      redirect
    end
  end

  def request_format
    'json'
  end
end
