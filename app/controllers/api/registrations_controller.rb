class Api::RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params)

    if resource.save
      yield resource if block_given?
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        render json: successful_registration(resource)
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
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
    { auth: { status: 'success', token: resource.authorization_token } }
  end

  def successful_inactive_registration(resource)
    { auth: { status: 'success' } }
  end

  def failed_registration(resource)
    errors = resource.errors.messages.map { |k,v| v.map { |v2| "#{k} #{v2}" } }.flatten
    { auth: { status: 'failure', errors: errors } }
  end
end
