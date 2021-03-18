// const setImage(imgPath){
//   const hero = document.getElementById(".hero-category")
//   switch(imgPath){
//   hero.style.background = "url(images/)"}
// }
document.addEventListener("click", (e) => {
  const card = e.target.closest(".article-card");
  const id = e.target.dataset.id;

  // CARD CLICK
  if (card) {
    const path =
      "http://" + window.location.host + "/articles/article/" + card.dataset.id;
    console.log(window.location.host);
    window.location.assign(path);
  }

  // DELETE BUTTON CLICK
  if (e.target.classList.contains("btn-delete")) {
    console.log("deleted");
    if (id) {
      axios.delete("/admin/articles/delete/" + id);
      const path = "http://" + window.location.host + "/admin/articles";
      window.location.assign(path);
    }
  }
});
