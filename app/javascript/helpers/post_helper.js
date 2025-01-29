export function parentCommentToggle() {
  const parent_comment_button = document.getElementById('parent_comment_button');
  const parent_comment_form = document.getElementById('parent_comment_form');
  const cancel_parent_comment_form = document.getElementById('cancel_parent_comment_form');

  parent_comment_button.addEventListener('click', (event) => {
    parent_comment_button.style.display = 'none';
    parent_comment_form.style.display = 'block';
  });

  cancel_parent_comment_form.addEventListener('click', (event) => {
    parent_comment_button.style.display = 'block';
    parent_comment_form.style.display = 'none';
  });

  parent_comment_form.addEventListener('submit', (event) => {
    parent_comment_button.style.display = 'block';
    parent_comment_form.style.display = 'none';
   });
}

export function parentLikeToggle() {
  const parent_like_buttons = document.querySelectorAll('[id^="like_button_parent"]');
  const parent_dislike_buttons = document.querySelectorAll('[id^="dislike_button_parent"]');

  parent_like_buttons.forEach((parent_like_button) => { 
    parent_like_button.addEventListener("click", (event) => {
      let id = parent_like_button.id.replace("like_button_parent_", "")
      let reaction_div_parent = document.getElementById("reaction_div_parent_"+id);
      if (reaction_div_parent.classList.contains("like")) {
        reaction_div_parent.classList = [];
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) - 1;
      }
      else if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList = [];
        reaction_div_parent.classList.add("like");
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) + 2;
      }
      else {
        reaction_div_parent.classList.add("like");
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) + 1;
      }
    });
  });

  parent_dislike_buttons.forEach((parent_dislike_button) => { 
    parent_dislike_button.addEventListener("click", (event) => {
      let id = parent_dislike_button.id.replace("dislike_button_parent_", "")
      let reaction_div_parent = document.getElementById("reaction_div_parent_"+id);
      if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList = [];
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) + 1;
      }
      else if (reaction_div_parent.classList.contains("like")) {
        reaction_div_parent.classList = [];
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) - 2;
      }
      else {
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.getElementsByTagName("span")[1].textContent = parseInt(reaction_div_parent.getElementsByTagName("span")[1].textContent.trim()) - 1;
      }
    });
  });
}