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