function gohomepage() {
  window.location = "http://127.0.0.1:5500/view/home.html";
}
const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  preloader.style.display = "none";
});
const menuopen = document.querySelector(".lets");
const username = document.querySelector("#username");
const closebtn = document.querySelector(".slide-holder");
const slideholder = document.querySelector(".slidemenu");
const postview = document.querySelector(".postview");
menuopen.addEventListener("click", () => {
  console.log("clicked");
  if (slideholder.classList.contains("active")) {
    slideholder.classList.remove("active");
  }
});
closebtn.addEventListener("click", () => {
  slideholder.classList.add("active");
});
window.addEventListener("DOMContentLoaded", async () => {
  const vale = await axios.get("http://127.0.0.1:3030/checkcook", {
    withCredentials: true,
  });
  if (vale.data != "exists") {
    window.location = "http://127.0.0.1:5500/view/index.html";
  } else {
    const val = await axios.get("http://127.0.0.1:3030/homedata", {
      withCredentials: true,
    });
    const dat = val.data;
    setheadimg(dat[0].user_id);
    username.innerHTML = dat[0].username;
  }
});

async function setheadimg(id) {
  const val = await axios.get(`http://127.0.0.1:3030/getavatar/${id}`);
  document.querySelector(".profile img").src = "./images/" + val.data[0].avatar;
  document.querySelector("#imghead img").src = "./images/" + val.data[0].avatar;
}
async function payload() {
  const title = document.querySelector("#title");
  const textarea = document.querySelector("#textarea");
  if (title.value == "" || textarea.value == "") {
    alert("type something");
    return 0;
  } else {
    const val = await axios.post(
      "http://127.0.0.1:3030/setdata",
      {
        titleval: `${title.value}`,
        describe: `${textarea.value}`,
      },
      {
        withCredentials: true,
      }
    );
    const data = val.data;
    if (data === "added") {
      const aeroid = document.querySelector("#showupdated");
      aeroid.classList.remove("active");
      setTimeout(() => {
        aeroid.classList.add("active");
      }, 4000);
    }
  }
}
