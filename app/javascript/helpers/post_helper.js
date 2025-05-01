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
  const parent_like_buttons = document.querySelectorAll('[id^="like_button_parent_"]');
  const parent_dislike_buttons = document.querySelectorAll('[id^="dislike_button_parent"]');

  parent_like_buttons.forEach((button) => { 
    button.addEventListener("click", (event) => {
      let id = button.id.includes("like_button_parent_liked_") ? button.id.replace("like_button_parent_liked_", "") : button.id.replace("like_button_parent_", ""); 
      
      let parent_like_button = document.getElementById("like_button_parent_" + id);
      let parent_like_button_liked = document.getElementById("like_button_parent_liked_" + id);
      let parent_dislike_button_disliked = document.getElementById("dislike_button_parent_disliked_" + id);
      let parent_dislike_button = document.getElementById("dislike_button_parent_" + id);


      let reaction_div_parent = document.getElementById("reaction_div_parent_" + id);
      if (reaction_div_parent.classList.contains("like")) {
        reaction_div_parent.classList.remove("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 1;
        parent_like_button_liked.classList.add("hidden");
        parent_like_button.classList.remove("hidden");
      }
      else if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList.remove("dislike");
        reaction_div_parent.classList.add("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 2;
        parent_dislike_button.classList.remove("hidden");
        parent_dislike_button_disliked.classList.add("hidden");
        parent_like_button_liked.classList.remove("hidden");
        parent_like_button.classList.add("hidden");
      }
      else {
        reaction_div_parent.classList.add("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 1;
        parent_like_button_liked.classList.remove("hidden");
        parent_like_button.classList.add("hidden");
      }
    });
  });

  parent_dislike_buttons.forEach((button) => { 
    button.addEventListener("click", (event) => {
      let id = button.id.includes("dislike_button_parent_disliked_") ? button.id.replace("dislike_button_parent_disliked_", "") : button.id.replace("dislike_button_parent_", "");

      let parent_like_button = document.getElementById("like_button_parent_" + id);
      let parent_like_button_liked = document.getElementById("like_button_parent_liked_" + id);
      let parent_dislike_button_disliked = document.getElementById("dislike_button_parent_disliked_" + id);
      let parent_dislike_button = document.getElementById("dislike_button_parent_" + id);

      let reaction_div_parent = document.getElementById("reaction_div_parent_" + id);
      if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList.remove("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 1;
        parent_dislike_button_disliked.classList.add("hidden");
        parent_dislike_button.classList.remove("hidden");
      }
      else if (reaction_div_parent.classList.contains("like")) {
        reaction_div_parent.classList.remove("like");
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 2;
        parent_like_button.classList.remove("hidden");
        parent_like_button_liked.classList.add("hidden");
        parent_dislike_button_disliked.classList.remove("hidden");
        parent_dislike_button.classList.add("hidden");
      }
      else {
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 1;
        parent_dislike_button_disliked.classList.remove("hidden");
        parent_dislike_button.classList.add("hidden");
      }
    });
  });
}

export function commentLikeToggle() {
  const comment_like_buttons = document.querySelectorAll('[id^="comment_like_button_"]');
  const comment_dislike_buttons = document.querySelectorAll('[id^="comment_dislike_button_"]');

  comment_like_buttons.forEach((button) => { 
    button.addEventListener("click", (event) => {
      let id = button.id.includes("comment_like_button_liked_") ? button.id.replace("comment_like_button_liked_", "") : button.id.replace("comment_like_button_", "")
      let comment_reaction = document.getElementById("comment_reaction_" + id);

      let comment_like_button = document.getElementById("comment_like_button_" + id);
      let comment_liked_button = document.getElementById("comment_like_button_liked_" + id);
      let comment_dislike_button = document.getElementById("comment_dislike_button_" + id);
      let comment_disliked_button = document.getElementById("comment_dislike_button_disliked_" + id);

      if (comment_reaction.classList.contains("like")) {
        comment_reaction.classList.remove("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 1;
        comment_liked_button.classList.add("hidden");
        comment_like_button.classList.remove("hidden");
      }
      else if (comment_reaction.classList.contains("dislike")) {
        comment_reaction.classList.remove("dislike");
        comment_reaction.classList.add("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 2;
        comment_disliked_button.classList.add("hidden");
        comment_dislike_button.classList.remove("hidden");
        comment_liked_button.classList.remove("hidden");
        comment_like_button.classList.add("hidden");
      }
      else {
        comment_reaction.classList.add("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 1;
        comment_liked_button.classList.remove("hidden");
        comment_like_button.classList.add("hidden");
      }
    });
  });

  comment_dislike_buttons.forEach((button) => { 
    button.addEventListener("click", (event) => {
      let id = button.id.includes("comment_dislike_button_disliked_") ? button.id.replace("comment_dislike_button_disliked_", "") : button.id.replace("comment_dislike_button_", "")
      let comment_reaction = document.getElementById("comment_reaction_" + id);
      
      let comment_like_button = document.getElementById("comment_like_button_" + id);
      let comment_liked_button = document.getElementById("comment_like_button_liked_" + id);
      let comment_dislike_button = document.getElementById("comment_dislike_button_" + id);
      let comment_disliked_button = document.getElementById("comment_dislike_button_disliked_" + id);

      if (comment_reaction.classList.contains("dislike")) {
        comment_reaction.classList.remove("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 1;
        comment_disliked_button.classList.add("hidden");
        comment_dislike_button.classList.remove("hidden");
      }
      else if (comment_reaction.classList.contains("like")) {
        comment_reaction.classList.remove("like");
        comment_reaction.classList.add("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 2;
        comment_like_button.classList.remove("hidden");
        comment_liked_button.classList.add("hidden");
        comment_disliked_button.classList.remove("hidden");
        comment_dislike_button.classList.add("hidden");
      }
      else {
        comment_reaction.classList.add("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 1;
        comment_disliked_button.classList.remove("hidden");
        comment_dislike_button.classList.add("hidden");
      }
    });
  });
}