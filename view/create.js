const title = document.querySelector("#title");
const describe = document.querySelector("#textarea");
const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  preloader.style.display = "none";
});
window.addEventListener("DOMContentLoaded", async () => {
  const vale = await axios.get("http://127.0.0.1:3030/checkcook", {
    withCredentials: true,
  });
  if (vale.data != "exists") {
    window.location = "http://127.0.0.1:5500/clientview/index.html";
  } else {
    const urlparam = new URLSearchParams(window.location.search);
    const id = urlparam.get("conid");
    setcontent(id);
  }
});
async function fetchdata(id) {
  const val = await axios.get(`http://127.0.0.1:3030/updatedataid/${id}`);
  const data = val.data;

  return data;
}

async function setcontent(id) {
  const data = await fetchdata(id);
  title.value = data[0].title;
  describe.value = data[0].describetion;
}

async function payload() {
  const urlparam = new URLSearchParams(window.location.search);
  const id = urlparam.get("conid");
  const val = await axios.post(`http://127.0.0.1:3030/updatedataid/${id}`, {
    title: `${title.value}`,
    describe: `${describe.value}`,
  });
}

function gohomepage() {
  window.location = "http://127.0.0.1:5500/clientview/editprofile.html";
}