class UpdateProfilePicJob < ApplicationJob
  queue_as :default

  def perform(user_id, profile_picture, prev_pic, crop_x, crop_y, crop_size)
    user = User.find(user_id);
    if !(profile_picture.present? || prev_pic.present?)
      user.profile_picture.purge;
    elsif(profile_picture.present?)
      image = Vips::Image.new_from_file(profile_picture.path);

      cropped_image = image.crop(crop_x.to_i, crop_y.to_i, crop_size.to_i, crop_size.to_i);
      cropped_temp_file = Tempfile.new(['cropped', '.jpg']);
      cropped_image.write_to_file(cropped_temp_file.path);
      
      user.profile_picture.purge;

      user.profile_picture.attach(
        io: File.open(cropped_temp_file.path),
        filename: profile_picture.original_filename,
        content_type: profile_picture.content_type
      );

      user.save!

      if user.errors.any?
        Turbo::StreamsChannel.broadcast_update_to(
          "#{user.id}error_notifications",
          target: "error-notifications",
          partial: "shared/error_message",
          locals: { message: "Checking turbo" }
        )
      end

      cropped_temp_file.close;
      cropped_temp_file.unlink;
    end
  end
end
