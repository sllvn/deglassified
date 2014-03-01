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

  def http_auth_body
    return i18n_message unless request_format
    method = "to_#{request_format}"
    if method == "to_xml"
      { :error => i18n_message }.to_xml(:root => "errors")
    elsif {}.respond_to?(method)
      { auth: { status: 'failure', errors: [i18n_message] } }.send(method)
    else
      i18n_message
    end
  end
end
