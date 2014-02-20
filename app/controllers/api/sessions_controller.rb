class Api::SessionsController < Devise::SessionsController
  def create
    # there seems to be a bug with warden's authenticate! where recall never is actually called
    user = warden.authenticate!(scope: resource_name, recall: "#{controller_path}#failure")
    render json: { status: 'success', auth: { token: user.authentication_token } }
  end

  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    render json: { status: 'success' }
  end

  def failure
    render json: { status: 'failure', errors: ["Login failed"] }
  end
end
