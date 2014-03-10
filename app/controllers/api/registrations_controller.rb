class Api::RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params)

    if resource.save
      yield resource if block_given?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render json: successful_registration(resource)
      else
        expire_data_after_sign_in!
        render json: successful_inactive_registration(resource``)
      end
    else
      clean_up_passwords resource
      render json: failed_registration(resource)
    end
  end

  private

  def successful_registration(resource)
    { auth: { status: 'success', email: resource.email, token: resource.authentication_token } }
  end

  def successful_inactive_registration(resource)
    { auth: { status: 'success' } }
  end

  def failed_registration(resource)
    errors = resource.errors.messages.map { |k,v| v.map { |v2| "#{k} #{v2}.".humanize } }.flatten
    { auth: { status: 'failure', errors: errors } }
  end
end
