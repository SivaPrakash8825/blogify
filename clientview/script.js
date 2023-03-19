const text = document.querySelectorAll(".container h1");
const email = document.querySelector("#reg-mail");
const reg_pass = document.querySelector("#reg-pass");
const curpass = document.querySelector("#reg-cpass");
const reginfo = document.querySelector("#reginfo");
const log_mail = document.querySelector("#logmail");
const log_pass = document.querySelector("#logpass");
const user_name = document.querySelector("#user-details");

let val;

const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  preloader.style.display = "none";
});
window.addEventListener("DOMContentLoaded", async () => {
  const val = await axios.get("http://127.0.0.1:3030/checkcook", {
    withCredentials: true,
  });
  if (val.data === "exists") {
    window.location = "http://127.0.0.1:5500/clientview/home.html";
  }
});

async function postlogdata() {
  let val = await axios.post(
    "http://127.0.0.1:3030/logdata",
    {
      name: `${log_mail.value}`,
      pass: `${log_pass.value}`,
    },
    {
      withCredentials: true,
    }
  );
  let data = val.data;
  console.log(data);

  if (data != "error") {
    window.location.href = "http://127.0.0.1:5500/clientview/home.html";
  }
}

async function senddata() {
  const val = await axios.post("http://127.0.0.1:3030/regis", {
    name: `${email.value}`,
    pass: `${reg_pass.value}`,
    curpass: `${curpass.value}`,
  });
  let dat = val.data;
  if (dat.msg) {
    reginfo.innerHTML = dat.msg;
  }
  setTimeout(() => {
    reginfo.innerHTML = "";
  }, 3000);
  if (dat.msg === "saved") {
    await axios.get(`http://127.0.0.1:3030/insertavatar/${dat.ele}`);
  }
}
// async function homedata() {
//   // const val = await axios.post("http://127.0.0.1:3030/home.html");
//   console.log("siva");
// }
