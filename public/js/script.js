const cardText = document.querySelectorAll(".article-card .card-text");
const articleText = document.querySelectorAll(".list-group-item .article-text");
const sideBarItems = document.querySelectorAll(
  ".list-group-item side-bar-item"
);
const scrollingLimit = document.body.scrollHeight - window.innerHeight;

if (window.location.pathname.includes("/articles/article")) {
  // get elements
  const progressBar = document.querySelector("progress");
  const articleContainer = document.querySelector(".container-850");
  const sideBar = document.querySelector(".sidebar");
  const navBar = document.querySelector(".main-nav");

  // get distance from top of page
  navBarHeight = navBar.offsetHeight;
  console.log(articleContainer.o);
  //show progressbar and set the limit
  progressBar.classList.remove("hidden");
  progressBar.max = scrollingLimit;

  // observer for container

  document.addEventListener("scroll", (_) => {
    containerTop =
      articleContainer.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY + navBarHeight >= containerTop)
      sideBar.classList.add("display-sidebar");
    else sideBar.classList.remove("display-sidebar");
    progressBar.value = window.scrollY;
  });
}

// cut text
const formatText = (element, characters) => {
  element.forEach((text) => {
    // text will be cut after  100 letters
    text.innerText = text.innerText.slice(0, characters) + "...";
    // remove all new lines from text
    text.innerHTML = text.innerHTML.split("<br>").join("");
  });
};
formatText(cardText, 100);
formatText(articleText, 200);

document.addEventListener("click", (e) => {
  const card = e.target.closest(".article-card");
  const id = e.target.dataset.id;

  // CARD CLICK
  if (card) {
    const path =
      "http://" + window.location.host + "/articles/article/" + card.dataset.id;
    window.location.assign(path);
  }

  // DELETE BUTTON CLICK
  if (e.target.classList.contains("btn-delete")) {
    if (id) {
      axios.delete("/admin/articles/delete/" + id);
      const path = "http://" + window.location.host + "/admin/articles/new";
      window.location.assign(path);
    }
  }
});
