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
        reaction_div_parent.classList.remove("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 1;
      }
      else if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList.remove("dislike");
        reaction_div_parent.classList.add("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 2;
      }
      else {
        reaction_div_parent.classList.add("like");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 1;
      }
    });
  });

  parent_dislike_buttons.forEach((parent_dislike_button) => { 
    parent_dislike_button.addEventListener("click", (event) => {
      let id = parent_dislike_button.id.replace("dislike_button_parent_", "")
      let reaction_div_parent = document.getElementById("reaction_div_parent_"+id);
      if (reaction_div_parent.classList.contains("dislike")) {
        reaction_div_parent.classList.remove("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) + 1;
      }
      else if (reaction_div_parent.classList.contains("like")) {
        reaction_div_parent.classList.remove("like");
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 2;
      }
      else {
        reaction_div_parent.classList.add("dislike");
        reaction_div_parent.querySelector("span").textContent = parseInt(reaction_div_parent.querySelector("span").textContent.trim()) - 1;
      }
    });
  });
}

export function commentLikeToggle() {
  const comment_like_buttons = document.querySelectorAll('[id^="comment_like_button_"]');
  const comment_dislike_buttons = document.querySelectorAll('[id^="comment_dislike_button_"]');

  comment_like_buttons.forEach((comment_like_button) => { 
    comment_like_button.addEventListener("click", (event) => {
      //TODO: This is not working efficiently as links gets changed before event gets fired.
      //Solution: Either use 2 buttons and try turbo streams.
      // event.preventDefault();
      // let redirect_link = event.currentTarget.href;
      // Turbo.visit(redirect_link, { action: "replace" });
      let current_url = new URL(event.currentTarget.href);
      let id = comment_like_button.id.replace("comment_like_button_", "")
      let comment_reaction = document.getElementById("comment_reaction_" + id);

      let comment_dislike_button = document.getElementById("comment_dislike_button_" + id);
      let comment_dislike_button_url = new URL(comment_dislike_button.href);

      comment_dislike_button_url.searchParams.set('reaction', 'dislike');
      comment_dislike_button.href = comment_dislike_button_url;

      if (comment_reaction.classList.contains("like")) {
        comment_reaction.classList.remove("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 1;
        current_url.searchParams.set('reaction', 'like');
        comment_like_button.href = current_url;
      }
      else if (comment_reaction.classList.contains("dislike")) {
        
        comment_reaction.classList.remove("dislike");
        comment_reaction.classList.add("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 2;
        current_url.searchParams.delete('reaction');
        comment_like_button.href = current_url;
      }
      else {
        comment_reaction.classList.add("like");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 1;
        current_url.searchParams.delete('reaction');
        comment_like_button.href = current_url;
      }
    });
  });

  comment_dislike_buttons.forEach((comment_dislike_button) => { 
    comment_dislike_button.addEventListener("click", (event) => {
      // event.preventDefault();
      // let redirect_link = event.currentTarget.href;
      // Turbo.visit(redirect_link, { action: "replace" });
      let current_url = new URL(event.currentTarget.href);
      let id = comment_dislike_button.id.replace("comment_dislike_button_", "")
      let comment_reaction = document.getElementById("comment_reaction_" + id);
      
      let comment_like_button = document.getElementById("comment_like_button_" + id);
      let comment_like_button_url = new URL(comment_like_button.href);

      comment_like_button_url.searchParams.set('reaction', 'like');
      comment_like_button.href = comment_like_button_url;

      if (comment_reaction.classList.contains("dislike")) {
        comment_reaction.classList.remove("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) + 1;
        current_url.searchParams.set('reaction', 'dislike');
        comment_dislike_button.href = current_url;
      }
      else if (comment_reaction.classList.contains("like")) {
        comment_reaction.classList.remove("like");
        comment_reaction.classList.add("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 2;
        current_url.searchParams.delete('reaction');
        comment_dislike_button.href = current_url;
      }
      else {
        comment_reaction.classList.add("dislike");
        comment_reaction.querySelector("span").textContent = parseInt(comment_reaction.querySelector("span").textContent.trim()) - 1;
        current_url.searchParams.delete('reaction');
        comment_dislike_button.href = current_url;
      }
    });
  });
}